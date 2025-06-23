import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WebhookEvent } from '@microfox/webhook-core';
import {
  Task,
  Event,
  CreateTaskInput,
  LogEventInput,
  EventWatcher,
  CreateEventWatcherInput,
  Activity,
  CreateActivityInput,
} from '../schemas';

export interface SupabaseConfig {
  url: string;
  key: string;
}

export class SupabaseService {
  public supabase: SupabaseClient;

  constructor(config: SupabaseConfig) {
    if (!config.url || !config.key) {
        throw new Error('[TaskKitDB] Supabase config is missing url or key');
    }
    this.supabase = createClient(config.url, config.key);
  }

  // === Task Methods ===

  public async createTask(input: CreateTaskInput): Promise<Task> {
    const { data, error } = await this.supabase
      .from('tasks')
      .insert(input)
      .select()
      .single();
    if (error) throw new Error(`[TaskKitDB] Failed to create task: ${error.message}`);
    return data;
  }

  public async getTask(id: string): Promise<Task | null> {
    const { data, error } = await this.supabase.from('tasks').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  public async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'created_at'>>): Promise<Task> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select().single();
    if (error) throw new Error(`[TaskKitDB] Failed to update task: ${error.message}`);
    return data;
  }

  // === Watcher Methods ===

  public async createEventWatcher(input: CreateEventWatcherInput): Promise<EventWatcher> {
    const { data, error } = await this.supabase.from('event_watchers').insert(input).select().single();
    if (error) throw new Error(`[TaskKitDB] Failed to create event watcher: ${error.message}`);
    return data;
  }

  public async findWatchedTasks(event: WebhookEvent, microfox_id: string): Promise<Task[]> {
    const { provider, event_type, original_payload } = event;

    if (!original_payload || typeof original_payload !== 'object') {
      return [];
    }

    const query = this.supabase
      .from('event_watchers')
      .select('tasks(*)')
      .eq('microfox_id', microfox_id)
      .eq('provider_name', provider)
      .eq('event_type', event_type)
      .containedBy('match_query', original_payload);

    const { data, error } = await query;

    if (error) {
      console.error(`[TaskKitDB] Failed to find watched tasks: ${error.message}`);
      return [];
    }

    const tasks = data?.map(d => d.tasks).filter(Boolean).flat();
    return (tasks as unknown as Task[]) || [];
  }

  // === Event Methods ===

  public async logEvent(input: LogEventInput): Promise<Event> {
    const { data, error } = await this.supabase
      .from('events')
      .insert(input)
      .select()
      .single();
    if (error) throw new Error(`[TaskKitDB] Failed to log event: ${error.message}`);
    return data;
  }

  // === Activity Methods ===

  public async createActivity(input: CreateActivityInput & { sequence_number: number }): Promise<Activity> {
    const { data, error } = await this.supabase
      .from('activities')
      .insert(input)
      .select()
      .single();
    if (error) throw new Error(`[TaskKitDB] Failed to create activity: ${error.message}`);
    return data;
  }
} 