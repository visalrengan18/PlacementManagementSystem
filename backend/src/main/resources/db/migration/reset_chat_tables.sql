-- Migration script to reset chat tables with new schema
-- Run this in PostgreSQL before restarting the backend

-- Drop existing tables (messages first due to foreign key)
DROP TABLE IF EXISTS jobswipe.messages CASCADE;
DROP TABLE IF EXISTS jobswipe.chat_rooms CASCADE;

-- The tables will be recreated by Hibernate on application startup
-- with the new schema:
--   chat_rooms: id, seeker_id, company_id, created_at
--   messages: id, chat_room_id, sender_id, content, status, created_at
