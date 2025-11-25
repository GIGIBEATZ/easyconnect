/*
  # Saved Searches Feature

  ## New Table

  ### saved_searches
  Stores user's saved search queries with filters for quick access
  - `id` (uuid, PK) - Primary key
  - `user_id` (uuid, FK to profiles) - User who saved the search
  - `name` (text) - User-defined name for the search
  - `search_term` (text) - Search query text
  - `filters` (jsonb) - Filter criteria (price range, categories, etc.)
  - `entity_type` (text) - 'product' or 'job'
  - `created_at` (timestamptz) - When search was saved

  ## Security
  - RLS enabled
  - Users can only access their own saved searches
*/

CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  search_term text DEFAULT '',
  filters jsonb DEFAULT '{}'::jsonb,
  entity_type text NOT NULL CHECK (entity_type IN ('product', 'job')),
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own saved searches"
  ON saved_searches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved searches"
  ON saved_searches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved searches"
  ON saved_searches FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved searches"
  ON saved_searches FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
