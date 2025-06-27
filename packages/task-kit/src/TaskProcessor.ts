import { SupabaseClient } from '@supabase/supabase-js';
import { GoogleAiProvider } from '@microfox/ai-provider-google';
import { SupabaseConfig, SupabaseService } from './services';
import { selectTools } from './services/ai';
import { Task, Activity, CreateActivityInput } from './schemas';

export class TaskProcessor {
    private db: SupabaseService;
    private googleProvider?: GoogleAiProvider;
    private task: Task;
    private availableTools: any[];

    constructor(
        supabaseConfig: SupabaseConfig,
        task: Task,
        availableTools: any[] = [],
        googleApiKey?: string
    ) {
        this.db = new SupabaseService(supabaseConfig);
        this.task = task;
        this.availableTools = availableTools;
        if (googleApiKey) {
            this.googleProvider = new GoogleAiProvider({ apiKey: googleApiKey });
        }
    }

    public async execute(): Promise<void> {
        console.log(`Executing task ${this.task.id}: ${this.task.name}`);
        await this.logActivity({ type: 'system_update', metadata: { note: 'Task execution started.' } });

        try {
            if (!this.googleProvider) {
                console.warn('[TaskKit] Google API key not provided. Cannot select tools.');
                await this.db.updateTask(this.task.id, { status: 'failed' });
                await this.logActivity({ type: 'system_update', metadata: { note: 'Execution failed: Missing Google API Key.' } });
                return;
            }

            const toolSelection = await selectTools(this.googleProvider, this.task, this.availableTools);
            
            if (toolSelection.tool_calls && toolSelection.tool_calls.length > 0) {
                 await this.logActivity({
                    type: 'tool_call',
                    metadata: {
                        note: `AI selected ${toolSelection.tool_calls.length} tool(s) to run.`,
                        selection_notes: toolSelection.notes,
                    },
                    messageMetadata: {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `Executing tools: ${toolSelection.tool_calls.map(t => t.tool_name).join(', ')}`,
                        parts: [],
                        attachments: [],
                        annotations: [],
                        originClientRequestId: `tool-request-${this.task.id}`,
                        toolInvocations: toolSelection.tool_calls,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                });
                
                // In a real application, you would now iterate through the tool_calls
                // and execute them using a tool dispatcher.
                // For this package, we log that the tools *would* be called.
            } else {
                await this.logActivity({ type: 'system_update', metadata: { note: 'No tools selected for execution.' } });
            }

            await this.db.updateTask(this.task.id, { status: 'completed' });
            await this.logActivity({ type: 'system_update', metadata: { note: 'Task execution completed successfully.' } });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            console.error(`[TaskKit] Failed to execute task ${this.task.id}:`, errorMessage);
            await this.db.updateTask(this.task.id, { status: 'failed' });
            await this.logActivity({
                type: 'system_update',
                metadata: {
                    note: 'Task execution failed.',
                    error: errorMessage
                }
            });
        }
    }

    private async logActivity(activityData: Omit<CreateActivityInput, 'task_id' | 'sequence_number'>): Promise<Activity> {
        const { data: latestActivity } = await this.db.supabase
            .from('activities')
            .select('sequence_number')
            .eq('task_id', this.task.id)
            .order('sequence_number', { ascending: false })
            .limit(1);

        const nextSequenceNumber = (latestActivity?.[0]?.sequence_number || 0) + 1;

        return this.db.createActivity({
            ...activityData,
            task_id: this.task.id,
            sequence_number: nextSequenceNumber,
        });
    }
} 