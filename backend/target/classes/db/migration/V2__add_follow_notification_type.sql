-- Migration: Add 'FOLLOW' to notifications type constraint
-- Run this script in PostgreSQL before restarting the backend
-- 
-- Root Cause: The notifications table has a CHECK constraint that was created
-- before the FOLLOW notification type was added to the Java enum.

-- Step 1: Inspect the current constraint (run this to see what types are allowed)
-- SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'notifications_type_check';

-- Step 2: Drop the existing constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Step 3: Recreate the constraint with all valid notification types
-- This includes all types from the Java NotificationType enum:
-- MATCH, MESSAGE, APPLICATION, APPLICATION_STATUS, PROFILE_VIEW, FOLLOW
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('MATCH', 'MESSAGE', 'APPLICATION', 'APPLICATION_STATUS', 'PROFILE_VIEW', 'FOLLOW'));

-- Verification: Confirm the constraint is updated
-- SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'notifications_type_check';
