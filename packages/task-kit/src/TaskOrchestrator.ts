import { WebhookSqsPayload } from '@microfox/webhook-core';
import { SupabaseConfig, SupabaseService } from './services';
import { preClassifyEvent, ClassificationResult, generateTaskDetails } from './services/ai';
import { Task, CreateTaskInput, TaskType, OrchestrationOutput } from './schemas';
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

    public async processIncomingEvent(payload: WebhookSqsPayload): Promise<OrchestrationOutput[]> {
        console.log('[TaskKit] Processing incoming event:', JSON.stringify(payload, null, 2));
        const { webhook_event, microfox_connections } = payload;
        
        if (!webhook_event) {
            console.warn('[TaskKit] SQS payload is missing webhook_event. Cannot process.');
            return [];
        }
        
        if (!microfox_connections || microfox_connections.length === 0) {
            console.warn('[TaskKit] SQS payload is missing microfox_connections. Cannot process.');
            return [];
        }
        
        if (!webhook_event.event_type && webhook_event.original_payload?.event?.type) {
            (webhook_event as any).event_type = webhook_event.original_payload.event.type;
        }

        const cleanedTextForAi = webhook_event.clean_text?.replace(/^@\w+\s/, '') ?? '';
        
        const loggedEvent = await this.db.logEvent({
            microfox_ids: microfox_connections.map(c => c.microfox_bot_id),
            provider_name: webhook_event.provider,
            event_type: webhook_event.event_type,
            content: cleanedTextForAi,
            metadata: webhook_event.original_payload,
        });
        console.log(`[TaskKit] Logged event with ID: ${loggedEvent.id}`);
        
        const resultsPromises = microfox_connections.map(connection =>
            this.processForSingleMicrofoxId(payload, connection.microfox_bot_id, loggedEvent)
        );

        const results = await Promise.all(resultsPromises);
        console.log(`[TaskKit] Processed event. Returning ${results.length} results.`);
        return results;
    }

    private async processForSingleMicrofoxId(payload: WebhookSqsPayload, microfox_id: string, db_event: any): Promise<OrchestrationOutput> {
        const { webhook_event, microfox_connections, channel, react_access } = payload;

        if (!webhook_event) {
            // This case is already handled in the caller, but this satisfies TypeScript's strictness
            throw new Error("processForSingleMicrofoxId called with undefined webhook_event");
        }

        console.log(`[TaskKit] Processing event for microfox_id: ${microfox_id}`);
        const watchedTasks = await this.db.findWatchedTasks(webhook_event, microfox_id);
        console.log(`[TaskKit] Found ${watchedTasks.length} watched tasks.`);

        if (this.googleProvider) {
            const cleanedTextForAi = webhook_event.clean_text?.replace(/^@\w+\s/, '') ?? '';
            if (cleanedTextForAi) {
                try {
                    const preClassification = await preClassifyEvent(this.googleProvider, cleanedTextForAi);
                    const isTaskImportant = (payload as any).isTaskImportant === true;

                    switch (preClassification.decision) {
                        case 'new_task':
                            if (isTaskImportant) {
                                const sender = webhook_event.original_payload?.event?.user || webhook_event.original_payload?.user || {};
                                const eventDetails = {
                                    cleanText: cleanedTextForAi,
                                    providerName: webhook_event.provider,
                                    eventType: webhook_event.event_type,
                                    sender,
                                };
                                const aiClassification = await generateTaskDetails(this.googleProvider, eventDetails);
                                const [createdTask] = await this.handleAiClassification(aiClassification, microfox_id, webhook_event.provider, db_event.id);
                                return { isNewTask: true, isOldTask: false, isTaskImportant: true, classified: true, webhook_event, db_event, newTask: createdTask, microfox_connections, channel, react_access };
                            } else {
                                return { isNewTask: true, isOldTask: false, isTaskImportant: false, classified: false, webhook_event, db_event, newTask: {}, microfox_connections, channel, react_access };
                            }
                        case 'old_task':
                            return { isNewTask: false, isOldTask: true, isTaskImportant: isTaskImportant, classified: false, webhook_event, db_event, microfox_connections, channel, react_access };
                        case 'irrelevant':
                        default:
                            break;
                    }
                } catch (error) {
                    console.error('[TaskKit] AI processing failed:', error);
                }
            }
        }

        return {
            isNewTask: false,
            isOldTask: false,
            isTaskImportant: (payload as any).isTaskImportant === true,
            classified: false,
            webhook_event,
            db_event,
            microfox_connections,
            channel,
            react_access,
        };
    }

    private async handleAiClassification(
        classification: ClassificationResult,
        microfox_id: string,
        provider_name: string,
        eventId: string
    ): Promise<Task[]> {
        console.log('[TaskKit] Handling AI classification...');
        const createdTasks: Task[] = [];
        if (classification.new_task) {
            const { watcher, ...taskDetailsData } = classification.new_task;
            let task_type: TaskType = 'default';
            if (watcher) task_type = 'watcher';
            else if (taskDetailsData.scheduled_for) task_type = 'scheduled';

            const taskDetails: CreateTaskInput = { ...taskDetailsData, microfox_id, provider_name, status: 'pending', triggering_event_id: eventId, task_type };
            const newTask = await this.db.createTask(taskDetails);
            createdTasks.push(newTask);

            if (watcher && newTask) {
                await this.db.createEventWatcher({ ...watcher, match_query: watcher.match_query ?? {}, task_id: newTask.id, microfox_id });
            }
        }
        return createdTasks;
    }
} 