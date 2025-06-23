import { WebhookSqsPayload } from '@microfox/webhook-core';
import { SupabaseConfig, SupabaseService } from './services';
import { classifyTask, generateTaskQuery, ClassificationResult } from './services/ai';
import { Task, CreateTaskInput } from './schemas';
import { GoogleAiProvider } from '@microfox/ai-provider-google';

export class TaskOrchestrator {
    private db: SupabaseService;
    private googleProvider?: GoogleAiProvider;

    constructor(supabaseConfig: SupabaseConfig, googleApiKey?: string) {
        this.db = new SupabaseService(supabaseConfig);
        if (googleApiKey) {
            this.googleProvider = new GoogleAiProvider({ apiKey: googleApiKey });
        }
    }

    public async processIncomingEvent(payload: WebhookSqsPayload): Promise<Task[]> {
        const { webhook_event, microfox_connections } = payload;
        
        if (!webhook_event) {
            console.warn('[TaskKit] SQS payload is missing webhook_event. Cannot process.');
            return [];
        }
        
        if (!microfox_connections || microfox_connections.length === 0) {
            console.warn('[TaskKit] SQS payload is missing microfox_connections. Cannot process.');
            return [];
        }
        
        // If a task_id is provided, use it to provide extra context to the AI classifier.
        const task_id = webhook_event?.event?.task_id;
        const contextTask = task_id ? await this.db.getTask(task_id) : undefined;
        
        const taskPromises = microfox_connections.map(connection =>
            this.processForSingleMicrofoxId(webhook_event, connection.microfox_bot_id, contextTask)
        );

        const tasksFromAllIds = await Promise.all(taskPromises);
        const allTasks = tasksFromAllIds.flat();

        const taskQueue = new Map<string, Task>();
        allTasks.forEach(task => {
            if (task) taskQueue.set(task.id, task);
        });

        return Array.from(taskQueue.values());
    }

    private async processForSingleMicrofoxId(webhook_event: any, microfox_id: string, contextTask?: Task | null): Promise<Task[]> {
        // 1. Find tasks activated by predefined event watchers.
        const watchedTasks = await this.db.findWatchedTasks(webhook_event, microfox_id);

        // 2. Use AI to classify the event for new or related tasks.
        let aiSelectedTasks: Task[] = [];
        if (this.googleProvider) {
            const recentTasks = contextTask ? [contextTask] : await this.findRecentTasks(this.googleProvider, webhook_event.content, microfox_id, webhook_event.provider);
            const aiClassification = await classifyTask(this.googleProvider, webhook_event.text, recentTasks);
            aiSelectedTasks = await this.handleAiClassification(aiClassification, microfox_id, webhook_event.provider);
        } else {
            console.warn('[TaskKit] Google API key not provided. Skipping AI classification for microfox_id:', microfox_id);
        }

        return [...watchedTasks, ...aiSelectedTasks];
    }
    
    private async findRecentTasks(googleProvider: GoogleAiProvider, eventContent: unknown, microfox_id: string, provider_name: string): Promise<Partial<Task>[]> {
        const aiQuery = await generateTaskQuery(googleProvider, eventContent);
        // build and execute query based on aiQuery...
        // this is a simplified placeholder
        const { data, error } = await this.db.supabase
            .from('tasks')
            .select('id, name, ai_description, status, priority, created_at')
            .eq('microfox_id', microfox_id)
            .eq('provider_name', provider_name)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('[TaskKit] Failed to fetch recent tasks with dynamic query:', error.message);
            return [];
        }
        return data || [];
    }

    private async handleAiClassification(
        classification: ClassificationResult,
        microfox_id: string,
        provider_name: string
    ): Promise<Task[]> {
        const createdTasks: Task[] = [];
        if (classification.new_tasks) {
            for (const taskDef of classification.new_tasks) {
                const { watcher, ...taskDetailsData } = taskDef;
                const taskDetails: CreateTaskInput = {
                    ...taskDetailsData,
                    microfox_id,
                    provider_name,
                    status: 'pending',
                };
                const newTask = await this.db.createTask(taskDetails);
                createdTasks.push(newTask);

                if (watcher && newTask) {
                    await this.db.createEventWatcher({
                        ...watcher,
                        task_id: newTask.id,
                        microfox_id,
                    });
                }
            }
        }

        const existingTasks: Task[] = [];
        if (classification.existing_task_ids) {
            for (const taskId of classification.existing_task_ids) {
                const task = await this.db.getTask(taskId);
                if (task) {
                    await this.db.updateTask(task.id, {
                        metadata: {
                            ...task.metadata,
                            last_ai_note: classification.notes,
                        }
                    });
                    existingTasks.push(task);
                }
            }
        }

        return [...createdTasks, ...existingTasks];
    }
} 