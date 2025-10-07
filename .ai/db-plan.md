# Database Schema - 10x-cards MVP

## 1. Tables with Columns, Data Types, and Constraints

### Table `users`

This table is managed by Supabase Auth

- id: UUID PRIMARY KEY
- email: VARCHAR(255) NOT NULL UNIQUE
- encrypted_password: VARCHAR NOT NULL
- created_at: TIMESTAMPTZ NOT NULL DEFAULT now()
- confirmed_at: TIMESTAMPTZ

### Table: `flashcards`

 - id: BIGSERIAL PRIMARY KEY
 - front: VARCHAR(200) NOT NULL
 - back: VARCHAR(500) NOT NULL
 - source: VARCHAR NOT NULL CHECK (source IN ('ai-full', 'ai-edited', 'manual'))
 - created_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()
 - updated_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()
 - user_id: UUID NOT NULL REFERENCES users(id)
 - generation_id: BIGINT REFERENCES generations(id) ON DELETE SET NULL

*Trigger: Automatically update the `updated_at` column on record updates.*

### Table: `generations`

 - id: BIGSERIAL PRIMARY KEY
 - user_id: UUID NOT NULL REFERENCES users(id)
 - model: VARCHAR NOT NULL
 - generated_count: INTEGER NOT NULL
 - accepted_unedited_count: INTEGER NULLABLE
 - accepted_edited_count: INTEGER NULLABLE
 - source_text_hash: VARCHAR NOT NULL
 - source_text_length: INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000) |
 - generation_duration_ms: INTEGER NOT NULL
 - created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 - updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

### Table: `generation_error_logs`
 - id: BIGSERIAL PRIMARY KEY
 - user_id: UUID NOT NULL REFERENCES users(id)
 - model: VARCHAR NOT NULL 
 - source_text_hash: VARCHAR NOT NULL
 - source_text_length: INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000) |
 - error_code: VARCHAR(100) NOT NULL
 - error_message: TEXT NOT NULL
 - created_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

## 2. Relationships Between Tables

 - One user (users) has many flash cards (flashcards)
 - One user (users) has many records in table generations
 - One user (users) has many records in table generation_error_logs
 - Each flash card (flashcards) can optionally refer to one generation (generations) via generation_id

---

## 3. Indexes

 - Index in column `user_id` in table flashcards
 - Index in column `generation_id` in table flashcards
 - Index in column `user_id` in table generations
 - Index in column `user_id` in table generation_error_logs

---

## 4. PostgreSQL Row-Level Security (RLS) Policies

In tables flashcards, generations, generation_error_logs implement RLS policies, which allow the user to access only those records, where `user_id` is equal to Supabase Auth user identification (ie. auth.uid() = user_id).

---

## 5. Additional Design Notes and Decisions

### Database Triggers

Automatically update the `updated_at` timestamp whenever a card is modified.

