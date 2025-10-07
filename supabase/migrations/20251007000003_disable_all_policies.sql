-- Migration: Disable All RLS Policies
-- Description: Drops all RLS policies from flashcards, generations, and generation_error_logs tables
-- Author: AI Assistant
-- Date: 2025-10-07

-- Drop policies from flashcards table
drop policy if exists "Users can view own flashcards" on flashcards;
drop policy if exists "Users can insert own flashcards" on flashcards;
drop policy if exists "Users can update own flashcards" on flashcards;
drop policy if exists "Users can delete own flashcards" on flashcards;

-- Drop policies from generations table
drop policy if exists "Users can view own generations" on generations;
drop policy if exists "Users can insert own generations" on generations;
drop policy if exists "Users can update own generations" on generations;
drop policy if exists "Users can delete own generations" on generations;

-- Drop policies from generation_error_logs table
drop policy if exists "Users can view own error logs" on generation_error_logs;
drop policy if exists "Users can insert own error logs" on generation_error_logs;
drop policy if exists "Users can delete own error logs" on generation_error_logs;

-- Disable RLS on all tables
alter table flashcards disable row level security;
alter table generations disable row level security;
alter table generation_error_logs disable row level security;
