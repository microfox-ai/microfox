# @microfox/task-kit

A robust toolkit for asynchronous task and communication management using Supabase as a backend.

This package provides a `TaskKitClient` to interact with a predefined database schema, enabling you to create, track, and manage tasks, channels, users, and their associated messages.

## Features

-   **Abstract Task Management**: Define and manage any type of task.
-   **Status Tracking**: Comprehensive task statuses (`pending`, `progress`, `completed`, `failed`, etc.).
-   **Communication Logging**: Store and retrieve messages related to each task.
-   **Flexible Data Storage**: Use `jsonb` columns for unstructured `data` and `metadata`.
-   **Provider Agnostic**: Link users and channels from any provider (e.g., Slack, Discord, WhatsApp).
-   **Database Migrations**: Version-controlled schema management with the Supabase CLI.

## Getting Started

### 1. Set up Supabase

You need a Supabase project and the Supabase CLI.

1.  If you don't have a Supabase project, create one at the [Supabase Dashboard](https://app.supabase.io).
2.  Install the Supabase CLI. See the [official documentation](https://supabase.com/docs/guides/cli/getting-started).
3.  Link your local repository to your Supabase project. In your terminal, run:
    ```bash
    supabase link --project-ref <your-project-id>
    ```
4.  Push the initial database schema to your Supabase project:
    ```bash
    supabase db push
    ```
    This command will execute the migration files located in the `supabase/migrations` directory.

### 2. Set Environment Variables

Your serverless function will need access to your Supabase URL and service role key. Store these as environment variables.

-   `SUPABASE_URL`: Find this in your Supabase project's **Settings > API**.
-   `SUPABASE_SERVICE_KEY`: This is the `service_role` key, also found in **Settings > API**. **Keep this secret.**

### 3. Install and Use the Client

```bash
npm install @microfox/task-kit
```

Initialize the client in your serverless function:

```typescript
import { TaskKitClient } from '@microfox/task-kit';

// These should be loaded from environment variables in a serverless environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const taskKit = new TaskKitClient(supabaseUrl, supabaseKey);

async function main() {
  const newTask = await taskKit.createTask({
    task_type: 'process-payment',
    data: { amount: 100, currency: 'USD' },
    source: 'billing-webhook',
  });

  console.log('Created Task:', newTask);
}

main();
```

---

## Database Management

This project uses the Supabase CLI to manage database schema changes.

-   **To create a new migration:** `supabase migration new <migration-name>`
-   **To apply migrations locally (if using Supabase local dev):** `supabase db reset`
-   **To apply migrations to the linked production database:** `supabase db push`

---

## Database Schema SQL

Run this SQL in your Supabase project's SQL Editor to set up the database.

```sql
-- 1. User Status ENUM
CREATE TYPE "public"."user_status" AS ENUM (
    'active',
    'inactive',
    'archived'
);

-- 2. Users Table
CREATE TABLE "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" "timestamp with time zone" DEFAULT "now"() NOT NULL,
    "status" "public"."user_status" DEFAULT 'active'::public.user_status,
    "email" "text",
    "full_name" "text",
    "metadata" "jsonb"
);
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY USING INDEX "users_pkey";

-- 3. User Identities Table (for multiple providers per user)
CREATE TABLE "public"."user_identities" (
    "provider" "text" NOT NULL,
    "provider_user_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" "timestamp with time zone" DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."user_identities" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX user_identities_pkey ON public.user_identities USING btree (provider, provider_user_id);
ALTER TABLE "public"."user_identities" ADD CONSTRAINT "user_identities_pkey" PRIMARY KEY USING INDEX "user_identities_pkey";

-- 4. Channels Table
CREATE TABLE "public"."channels" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" "timestamp with time zone" DEFAULT "now"() NOT NULL,
    "provider" "text" NOT NULL,
    "provider_channel_id" "text" NOT NULL,
    "organization_id" "text",
    "team_id" "text",
    "metadata" "jsonb"
);
ALTER TABLE "public"."channels" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX channels_pkey ON public.channels USING btree (id);
CREATE UNIQUE INDEX channels_provider_provider_channel_id_key ON public.channels USING btree (provider, provider_channel_id);
ALTER TABLE "public"."channels" ADD CONSTRAINT "channels_pkey" PRIMARY KEY USING INDEX "channels_pkey";
ALTER TABLE "public"."channels" ADD CONSTRAINT "channels_provider_provider_channel_id_key" UNIQUE USING INDEX "channels_provider_provider_channel_id_key";

-- 5. Task Status ENUM
CREATE TYPE "public"."task_status" AS ENUM (
    'pending',
    'progress',
    'input-await',
    'completed',
    'failed',
    'stopped',
    'retry'
);

-- 6. Tasks Table
CREATE TABLE "public"."tasks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" "timestamp with time zone" DEFAULT "now"() NOT NULL,
    "updated_at" "timestamp with time zone" DEFAULT "now"() NOT NULL,
    "status" "public"."task_status" DEFAULT 'pending'::public.task_status NOT NULL,
    "task_type" "text" NOT NULL,
    "data" "jsonb",
    "metadata" "jsonb",
    "source" "text",
    "correlation_id" "text",
    "parent_task_id" "uuid",
    "prev_task_ids" "uuid"[],
    "next_task_ids" "uuid"[]
);
ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_pkey" PRIMARY KEY USING INDEX "tasks_pkey";
CREATE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."tasks" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

-- 7. Messages Table
CREATE TABLE "public"."messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "task_id" "uuid" NOT NULL,
    "channel_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" "timestamp with time zone" DEFAULT "now"() NOT NULL,
    "message" "text" NOT NULL,
    "provider_message_id" "text",
    "metadata" "jsonb"
);
ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_pkey" PRIMARY KEY USING INDEX "messages_pkey";

-- 8. Task Channels Join Table
CREATE TABLE "public"."task_channels" (
    "task_id" "uuid" NOT NULL,
    "channel_id" "uuid" NOT NULL
);
ALTER TABLE "public"."task_channels" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX task_channels_pkey ON public.task_channels USING btree (task_id, channel_id);
ALTER TABLE "public"."task_channels" ADD CONSTRAINT "task_channels_pkey" PRIMARY KEY USING INDEX "task_channels_pkey";
``` 