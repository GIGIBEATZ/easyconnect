/*
  # Create Real-Time Chat Rooms System

  ## Overview
  A comprehensive real-time communication system connecting clients with technical support agents.
  Supports text chat, file sharing, video calls, and room management.

  ## 1. New Tables

  ### Room Management
  - `chat_rooms` - Virtual rooms for client-agent communication
    - `id` (uuid, primary key)
    - `ticket_id` (uuid, foreign key) - Associated support ticket
    - `room_name` (text) - Display name for the room
    - `room_type` (text) - support, consultation, training
    - `status` (text) - active, paused, resolved, closed
    - `priority` (text) - low, medium, high, urgent
    - `created_by` (uuid, foreign key) - User who created room
    - `created_at` (timestamptz)
    - `closed_at` (timestamptz)
    - `metadata` (jsonb) - Additional room data

  - `room_participants` - Users in each room
    - `id` (uuid, primary key)
    - `room_id` (uuid, foreign key)
    - `user_id` (uuid, foreign key)
    - `role` (text) - client, agent, observer
    - `joined_at` (timestamptz)
    - `left_at` (timestamptz)
    - `is_active` (boolean) - Currently in room
    - `last_seen_at` (timestamptz)

  ### Messaging
  - `chat_messages` - Messages sent in rooms
    - `id` (uuid, primary key)
    - `room_id` (uuid, foreign key)
    - `sender_id` (uuid, foreign key)
    - `message_type` (text) - text, image, file, system, video_call
    - `content` (text) - Message text
    - `metadata` (jsonb) - File info, call data, etc.
    - `reply_to_id` (uuid, foreign key) - For threaded replies
    - `is_edited` (boolean)
    - `is_deleted` (boolean)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `message_reactions` - Emoji reactions to messages
    - `id` (uuid, primary key)
    - `message_id` (uuid, foreign key)
    - `user_id` (uuid, foreign key)
    - `reaction` (text) - Emoji or reaction type
    - `created_at` (timestamptz)

  - `message_read_status` - Track which messages users have read
    - `id` (uuid, primary key)
    - `message_id` (uuid, foreign key)
    - `user_id` (uuid, foreign key)
    - `read_at` (timestamptz)

  ### File Sharing
  - `chat_attachments` - Files shared in chat
    - `id` (uuid, primary key)
    - `message_id` (uuid, foreign key)
    - `file_name` (text)
    - `file_size` (bigint)
    - `file_type` (text)
    - `file_url` (text) - Storage URL
    - `thumbnail_url` (text) - For images
    - `uploaded_by` (uuid, foreign key)
    - `created_at` (timestamptz)

  ### Agent Management
  - `agent_availability` - Track agent online status
    - `id` (uuid, primary key)
    - `agent_id` (uuid, foreign key)
    - `status` (text) - online, busy, away, offline
    - `status_message` (text)
    - `max_concurrent_rooms` (integer)
    - `current_room_count` (integer)
    - `updated_at` (timestamptz)

  - `agent_activity` - Track agent actions
    - `id` (uuid, primary key)
    - `agent_id` (uuid, foreign key)
    - `room_id` (uuid, foreign key)
    - `activity_type` (text) - typing, viewing, calling
    - `created_at` (timestamptz)
    - `expires_at` (timestamptz)

  ### Quick Responses
  - `quick_responses` - Pre-written messages for agents
    - `id` (uuid, primary key)
    - `agent_id` (uuid, foreign key)
    - `category` (text) - greeting, troubleshooting, closing
    - `title` (text)
    - `content` (text)
    - `is_public` (boolean) - Available to all agents
    - `usage_count` (integer)
    - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Participants can only see their own rooms
  - Agents can see all active rooms
  - Messages visible to room participants only
  - Comprehensive access controls
*/

-- Chat Rooms
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE SET NULL,
  room_name text NOT NULL,
  room_type text NOT NULL DEFAULT 'support',
  status text NOT NULL DEFAULT 'active',
  priority text NOT NULL DEFAULT 'medium',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  metadata jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS room_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'client',
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  is_active boolean DEFAULT true,
  last_seen_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Messaging
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type text NOT NULL DEFAULT 'text',
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  reply_to_id uuid REFERENCES chat_messages(id) ON DELETE SET NULL,
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

CREATE TABLE IF NOT EXISTS message_read_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- File Sharing
CREATE TABLE IF NOT EXISTS chat_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  thumbnail_url text,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Agent Management
CREATE TABLE IF NOT EXISTS agent_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'offline',
  status_message text,
  max_concurrent_rooms integer DEFAULT 5,
  current_room_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_id)
);

CREATE TABLE IF NOT EXISTS agent_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '10 seconds')
);

-- Quick Responses
CREATE TABLE IF NOT EXISTS quick_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'general',
  title text NOT NULL,
  content text NOT NULL,
  is_public boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Chat Rooms
CREATE POLICY "Users can view rooms they participate in"
  ON chat_rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = chat_rooms.id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat rooms"
  ON chat_rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room participants can update room"
  ON chat_rooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = chat_rooms.id
      AND room_participants.user_id = auth.uid()
    )
  );

-- RLS Policies for Room Participants
CREATE POLICY "Users can view room participants of their rooms"
  ON room_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants rp
      WHERE rp.room_id = room_participants.room_id
      AND rp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms"
  ON room_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participant status"
  ON room_participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Chat Messages
CREATE POLICY "Users can view messages in their rooms"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = chat_messages.room_id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their rooms"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = chat_messages.room_id
      AND room_participants.user_id = auth.uid()
      AND room_participants.is_active = true
    )
  );

CREATE POLICY "Users can update own messages"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete own messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- RLS Policies for Message Reactions
CREATE POLICY "Users can view reactions in their rooms"
  ON message_reactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_messages
      JOIN room_participants ON room_participants.room_id = chat_messages.room_id
      WHERE chat_messages.id = message_reactions.message_id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions"
  ON message_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON message_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for Message Read Status
CREATE POLICY "Users can view own read status"
  ON message_read_status FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark messages as read"
  ON message_read_status FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Chat Attachments
CREATE POLICY "Users can view attachments in their rooms"
  ON chat_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_messages
      JOIN room_participants ON room_participants.room_id = chat_messages.room_id
      WHERE chat_messages.id = chat_attachments.message_id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload attachments"
  ON chat_attachments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- RLS Policies for Agent Availability
CREATE POLICY "Anyone can view agent availability"
  ON agent_availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can manage own availability"
  ON agent_availability FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update own availability"
  ON agent_availability FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

-- RLS Policies for Agent Activity
CREATE POLICY "Users can view agent activity in their rooms"
  ON agent_activity FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = agent_activity.room_id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can create activity records"
  ON agent_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agent_id);

-- RLS Policies for Quick Responses
CREATE POLICY "Agents can view own and public quick responses"
  ON quick_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id OR is_public = true);

CREATE POLICY "Agents can create quick responses"
  ON quick_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update own quick responses"
  ON quick_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can delete own quick responses"
  ON quick_responses FOR DELETE
  TO authenticated
  USING (auth.uid() = agent_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_status ON chat_rooms(status);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_ticket ON chat_rooms(ticket_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_room ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user ON room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_active ON room_participants(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_status_user ON message_read_status(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_attachments_message ON chat_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_agent_availability_status ON agent_availability(status);
CREATE INDEX IF NOT EXISTS idx_agent_activity_room ON agent_activity(room_id);
CREATE INDEX IF NOT EXISTS idx_agent_activity_expires ON agent_activity(expires_at);
CREATE INDEX IF NOT EXISTS idx_quick_responses_agent ON quick_responses(agent_id);

-- Create function to auto-delete expired agent activity
CREATE OR REPLACE FUNCTION delete_expired_agent_activity()
RETURNS trigger AS $$
BEGIN
  DELETE FROM agent_activity WHERE expires_at < now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-cleanup
CREATE TRIGGER cleanup_expired_activity
  AFTER INSERT ON agent_activity
  EXECUTE FUNCTION delete_expired_agent_activity();
