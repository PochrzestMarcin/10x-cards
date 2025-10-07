-- Migration: Remove metadata column from generation_error_logs
-- Description: Removes the unused metadata column from generation_error_logs table
-- Author: AI Assistant
-- Date: 2025-10-07
-- Special Considerations:
--   - This is a destructive change that removes a column
--   - Any existing data in the metadata column will be permanently lost
--   - This change cannot be rolled back without data loss
--   - Make sure to backup any important metadata before applying this migration

-- Remove metadata column from generation_error_logs table
alter table generation_error_logs
    drop column if exists metadata;

-- Update table comment to reflect the change
comment on table generation_error_logs is 'Stores error logs from flashcard generation attempts. Note: metadata column was removed in migration 20251007000003.';
