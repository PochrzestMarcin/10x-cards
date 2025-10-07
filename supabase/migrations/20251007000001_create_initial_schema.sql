-- Migration: Create Initial Schema for 10x-cards MVP
-- Description: Creates the core tables (flashcards, generations, generation_error_logs) with RLS policies
-- Author: AI Assistant
-- Date: 2025-10-07

-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- Create generations table first since flashcards references it
create table generations (
    id bigserial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    model varchar not null,
    generated_count integer not null,
    accepted_unedited_count integer,
    accepted_edited_count integer,
    source_text_hash varchar not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    generation_duration_ms integer not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on generations
alter table generations enable row level security;

-- Create RLS policies for generations table
comment on table generations is 'Stores metadata about AI-generated flashcard batches';

-- Policy: Users can only view their own generations
create policy "Users can view own generations"
    on generations for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy: Users can only insert their own generations
create policy "Users can insert own generations"
    on generations for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy: Users can only update their own generations
create policy "Users can update own generations"
    on generations for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy: Users can only delete their own generations
create policy "Users can delete own generations"
    on generations for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create flashcards table
create table flashcards (
    id bigserial primary key,
    front varchar(200) not null,
    back varchar(500) not null,
    source varchar not null check (source in ('ai-full', 'ai-edited', 'manual')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    user_id uuid not null references auth.users(id) on delete cascade,
    generation_id bigint references generations(id) on delete set null
);

-- Enable RLS on flashcards
alter table flashcards enable row level security;

-- Create RLS policies for flashcards table
comment on table flashcards is 'Stores user flashcards with their content and metadata';

-- Policy: Users can only view their own flashcards
create policy "Users can view own flashcards"
    on flashcards for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy: Users can only insert their own flashcards
create policy "Users can insert own flashcards"
    on flashcards for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy: Users can only update their own flashcards
create policy "Users can update own flashcards"
    on flashcards for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy: Users can only delete their own flashcards
create policy "Users can delete own flashcards"
    on flashcards for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create generation_error_logs table
create table generation_error_logs (
    id bigserial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    model varchar not null,
    source_text_hash varchar not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    error_code varchar(100) not null,
    error_message text not null,
    metadata jsonb,
    created_at timestamptz not null default now()
);

-- Enable RLS on generation_error_logs
alter table generation_error_logs enable row level security;

-- Create RLS policies for generation_error_logs table
comment on table generation_error_logs is 'Stores error logs from flashcard generation attempts';

-- Policy: Users can only view their own error logs
create policy "Users can view own error logs"
    on generation_error_logs for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy: Users can only insert their own error logs
create policy "Users can insert own error logs"
    on generation_error_logs for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy: Users can only delete their own error logs
create policy "Users can delete own error logs"
    on generation_error_logs for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create indexes for better query performance
create index idx_flashcards_user_id on flashcards(user_id);
create index idx_flashcards_generation_id on flashcards(generation_id);
create index idx_generations_user_id on generations(user_id);
create index idx_generation_error_logs_user_id on generation_error_logs(user_id);

-- Create trigger function for updating updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updating updated_at columns
create trigger update_flashcards_updated_at
    before update on flashcards
    for each row
    execute function update_updated_at_column();

create trigger update_generations_updated_at
    before update on generations
    for each row
    execute function update_updated_at_column();
