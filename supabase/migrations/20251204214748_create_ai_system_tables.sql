/*
  # AI Product Assistant System Tables

  1. New Tables
    - `ai_generations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `generation_type` (text) - Type of AI generation (description, title, category, pricing, keywords, features)
      - `input_data` (jsonb) - Input data provided to AI
      - `output_data` (jsonb) - AI response/suggestions
      - `selected_variant` (integer) - Which variant user selected
      - `was_used` (boolean) - Whether user actually used the suggestion
      - `ai_provider` (text) - Which AI provider was used (openai, anthropic)
      - `model_used` (text) - Specific model version
      - `tokens_used` (integer) - Number of tokens consumed
      - `cost_usd` (decimal) - Cost in USD
      - `processing_time_ms` (integer) - Processing time in milliseconds
      - `created_at` (timestamptz)
    
    - `ai_usage_tracking`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles, unique)
      - `daily_requests` (integer) - Number of requests today
      - `monthly_requests` (integer) - Number of requests this month
      - `daily_tokens` (integer) - Tokens used today
      - `monthly_tokens` (integer) - Tokens used this month
      - `daily_cost_usd` (decimal) - Cost today
      - `monthly_cost_usd` (decimal) - Cost this month
      - `daily_limit` (integer) - Daily request limit
      - `monthly_limit` (integer) - Monthly request limit
      - `last_daily_reset` (timestamptz) - When daily counters were last reset
      - `last_monthly_reset` (timestamptz) - When monthly counters were last reset
      - `updated_at` (timestamptz)
    
    - `product_suggestions_cache`
      - `id` (uuid, primary key)
      - `cache_key` (text, unique) - Hash of input for cache lookup
      - `suggestion_type` (text) - Type of suggestion cached
      - `input_hash` (text) - Hash of input data
      - `suggestions` (jsonb) - Cached suggestions
      - `hit_count` (integer) - Number of cache hits
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz) - When cache entry expires

  2. Security
    - Enable RLS on all tables
    - Users can only access their own AI generations and usage data
    - Cache table is accessible to all authenticated users for reading
    - Only system can write to cache table

  3. Indexes
    - Performance indexes for common queries
    - Indexes on foreign keys and timestamp columns
*/

-- Create ai_generations table
CREATE TABLE IF NOT EXISTS ai_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  generation_type text NOT NULL CHECK (
    generation_type IN (
      'description', 'title', 'category', 
      'pricing', 'keywords', 'features'
    )
  ),
  
  input_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  selected_variant integer,
  was_used boolean DEFAULT false,
  
  ai_provider text DEFAULT 'openai',
  model_used text,
  tokens_used integer DEFAULT 0,
  cost_usd decimal(10, 6) DEFAULT 0,
  processing_time_ms integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

-- Create indexes for ai_generations
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_type ON ai_generations(generation_type);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON ai_generations(created_at DESC);

-- Create ai_usage_tracking table
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  daily_requests integer DEFAULT 0,
  monthly_requests integer DEFAULT 0,
  daily_tokens integer DEFAULT 0,
  monthly_tokens integer DEFAULT 0,
  
  daily_cost_usd decimal(10, 4) DEFAULT 0,
  monthly_cost_usd decimal(10, 4) DEFAULT 0,
  
  daily_limit integer DEFAULT 50,
  monthly_limit integer DEFAULT 500,
  
  last_daily_reset timestamptz DEFAULT now(),
  last_monthly_reset timestamptz DEFAULT now(),
  
  updated_at timestamptz DEFAULT now()
);

-- Create unique index on user_id for ai_usage_tracking
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage_tracking(user_id);

-- Create product_suggestions_cache table
CREATE TABLE IF NOT EXISTS product_suggestions_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  cache_key text UNIQUE NOT NULL,
  suggestion_type text NOT NULL,
  input_hash text NOT NULL,
  
  suggestions jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  hit_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- Create indexes for cache table
CREATE INDEX IF NOT EXISTS idx_cache_key ON product_suggestions_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON product_suggestions_cache(expires_at);

-- Enable RLS
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_suggestions_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_generations
CREATE POLICY "Users can view own AI generations"
  ON ai_generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own AI generations"
  ON ai_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI generations"
  ON ai_generations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_usage_tracking
CREATE POLICY "Users can view own usage tracking"
  ON ai_usage_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage tracking"
  ON ai_usage_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage tracking"
  ON ai_usage_tracking
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for product_suggestions_cache
CREATE POLICY "Authenticated users can read cache"
  ON product_suggestions_cache
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to auto-initialize usage tracking for new users
CREATE OR REPLACE FUNCTION initialize_ai_usage_tracking()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ai_usage_tracking (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-initialize usage tracking
DROP TRIGGER IF EXISTS on_profile_created_init_ai_tracking ON profiles;
CREATE TRIGGER on_profile_created_init_ai_tracking
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_ai_usage_tracking();

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM product_suggestions_cache
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;