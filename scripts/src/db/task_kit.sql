-- =================================================================
--  Task Kit Tables
--  This script creates the tables required for the @microfox/task-kit
--  package, based on the Zod schemas.
-- =================================================================

-- -----------------------------------------------------------------
--  Custom Types (Enums)
--  These types enforce specific values for task properties.
-- -----------------------------------------------------------------

CREATE TYPE public.task_status AS ENUM (
    'pending',
    'scheduled',
    'progress',
    'input-await',
    'completed',
    'failed',
    'archived'
);

CREATE TYPE public.task_type AS ENUM (
    'default',
    'watcher',
    'scheduled',
    'stale'
);

CREATE TYPE public.task_priority AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

CREATE TYPE public.event_status AS ENUM (
    'unclassified',
    'classified',
    'failed'
);


-- -----------------------------------------------------------------
--  Table: events
--  Logs raw incoming events before they are classified into tasks.
-- -----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    microfox_ids text[] NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    provider_name text,
    provider_event_id text,
    event_type text NOT NULL,
    status public.event_status NOT NULL DEFAULT 'unclassified',
    content text,
    metadata jsonb,
    classification_notes text,
    CONSTRAINT events_microfox_ids_check CHECK (array_length(microfox_ids, 1) > 0)
);

COMMENT ON TABLE public.events IS 'Logs raw incoming events from various providers before they are classified into actionable tasks.';
COMMENT ON COLUMN public.events.id IS 'The unique identifier for the event.';
COMMENT ON COLUMN public.events.microfox_ids IS 'The project/workspace IDs this event is associated with.';
COMMENT ON COLUMN public.events.provider_name IS 'The name of the originating provider, e.g., ''slack'', ''stripe''.';
COMMENT ON COLUMN public.events.provider_event_id IS 'The native event ID from the provider for deduplication.';
COMMENT ON COLUMN public.events.event_type IS 'The type of event, e.g., ''message'', ''reaction_added'', ''payment.succeeded''.';
COMMENT ON COLUMN public.events.status IS 'The processing status of the event.';
COMMENT ON COLUMN public.events.content IS 'The text content of the event, typically for messages.';
COMMENT ON COLUMN public.events.metadata IS 'A flexible field for storing the full, raw event payload or other data.';
COMMENT ON COLUMN public.events.classification_notes IS 'Notes added during processing, explaining why an event was classified a certain way or failed.';

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_microfox_ids ON public.events USING GIN(microfox_ids);
CREATE INDEX IF NOT EXISTS idx_events_provider_event_id ON public.events(provider_event_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);


-- -----------------------------------------------------------------
--  Table: tasks
--  Stores individual tasks to be processed.
-- -----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    microfox_id text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    scheduled_for timestamptz,
    expires_at timestamptz,
    name text,
    task_type public.task_type NOT NULL,
    status public.task_status NOT NULL,
    priority public.task_priority,
    authorized_users text[],
    input jsonb,
    output jsonb,
    metadata jsonb,
    provider_name text,
    ai_description text,
    triggering_event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
    CONSTRAINT tasks_microfox_id_check CHECK (char_length(microfox_id) > 0)
);

COMMENT ON TABLE public.tasks IS 'Stores individual tasks to be processed, including their status, priority, and data.';
COMMENT ON COLUMN public.tasks.id IS 'The internal unique identifier for the task.';
COMMENT ON COLUMN public.tasks.microfox_id IS 'The project/workspace ID this task belongs to.';
COMMENT ON COLUMN public.tasks.scheduled_for IS 'For scheduling tasks to run at a specific time.';
COMMENT ON COLUMN public.tasks.expires_at IS 'A timestamp after which the task should not be executed.';
COMMENT ON COLUMN public.tasks.name IS 'A human-readable name for the task type, e.g., "ProcessStripeWebhook".';
COMMENT ON COLUMN public.tasks.status IS 'The current lifecycle status of the task.';
COMMENT ON COLUMN public.tasks.priority IS 'The priority level of the task.';
COMMENT ON COLUMN public.tasks.authorized_users IS 'An array of user IDs authorized to interact with this task.';
COMMENT ON COLUMN public.tasks.input IS 'The data the task needs to run.';
COMMENT ON COLUMN public.tasks.output IS 'The result of a successful task execution.';
COMMENT ON COLUMN public.tasks.metadata IS 'A flexible field for storing any other unstructured data.';
COMMENT ON COLUMN public.tasks.provider_name IS 'The system or event source that initiated this task.';
COMMENT ON COLUMN public.tasks.ai_description IS 'An AI-generated description of the task or its purpose.';
COMMENT ON COLUMN public.tasks.triggering_event_id IS 'The ID of the event that triggered this task.';

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tasks_microfox_id ON public.tasks(microfox_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_provider_name ON public.tasks(provider_name);
CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_for ON public.tasks(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_tasks_triggering_event_id ON public.tasks(triggering_event_id);


-- -----------------------------------------------------------------
--  Table: activities
--  Records a sequence of actions or events within a single task.
-- -----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    sequence_number integer NOT NULL,
    parent_activity_id uuid REFERENCES public.activities(id) ON DELETE SET NULL,
    prev_activity_id uuid,
    next_activity_id uuid,
    type text NOT NULL,
    timestamp timestamptz NOT NULL DEFAULT now(),
    message_id uuid,
    message_content text,
    metadata jsonb,
    messageMetadata jsonb,
    ai_generated_data jsonb,
    CONSTRAINT activities_sequence_check UNIQUE (task_id, sequence_number)
);

COMMENT ON TABLE public.activities IS 'A record of an action or event that occurred during the lifecycle of a task.';
COMMENT ON COLUMN public.activities.task_id IS 'The task this activity belongs to.';
COMMENT ON COLUMN public.activities.sequence_number IS 'The sequence number of this activity within its task.';
COMMENT ON COLUMN public.activities.parent_activity_id IS 'The parent activity, for creating threaded conversations or sub-actions.';
COMMENT ON COLUMN public.activities.type IS 'The type of the activity. If "message", specific fields are required.';
COMMENT ON COLUMN public.activities.messageMetadata IS 'Specific metadata, required if the activity type is "message".';

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_activities_task_id ON public.activities(task_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_parent_activity_id ON public.activities(parent_activity_id);


-- -----------------------------------------------------------------
--  Table: event_watchers
--  Defines rules to match incoming events to tasks.
-- -----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.event_watchers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    microfox_id text NOT NULL,
    provider_name text NOT NULL,
    event_type text NOT NULL,
    team_id text,
    organization_id text,
    match_query jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.event_watchers IS 'Stores rules to proactively match incoming events to specific tasks.';
COMMENT ON COLUMN public.event_watchers.task_id IS 'The ID of the task this watcher is associated with.';
COMMENT ON COLUMN public.event_watchers.microfox_id IS 'The project/workspace ID this watcher belongs to.';
COMMENT ON COLUMN public.event_watchers.provider_name IS 'The name of the originating provider, e.g., ''slack''.';
COMMENT ON COLUMN public.event_watchers.event_type IS 'The type of event to watch for, e.g., ''message''.';
COMMENT ON COLUMN public.event_watchers.match_query IS 'The JSONB query used to match against incoming webhook payloads.';

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_event_watchers_task_id ON public.event_watchers(task_id);
CREATE INDEX IF NOT EXISTS idx_event_watchers_keys ON public.event_watchers(microfox_id, provider_name, event_type);

-- =================================================================
--  End of Script
-- =================================================================