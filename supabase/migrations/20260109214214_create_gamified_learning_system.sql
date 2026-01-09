/*
  # Create Gamified Learning System

  ## Overview
  A comprehensive gamified learning platform with topics, modules, lessons, quizzes,
  achievements, XP system, daily streaks, and leaderboards.

  ## 1. New Tables

  ### Learning Content Tables
  - `learning_topics` - Main learning categories (Maintenance, Repair, etc.)
    - `id` (uuid, primary key)
    - `title` (text) - Topic name
    - `description` (text) - Topic description
    - `icon` (text) - Icon identifier
    - `color` (text) - Theme color for topic
    - `total_xp` (integer) - Total XP available in topic
    - `estimated_hours` (integer) - Estimated time to complete
    - `order_index` (integer) - Display order
    - `created_at` (timestamptz)

  - `learning_modules` - Difficulty-based modules within topics
    - `id` (uuid, primary key)
    - `topic_id` (uuid, foreign key)
    - `title` (text) - Module name (Beginner, Intermediate, Advanced, Pro)
    - `description` (text)
    - `level` (integer) - 1=Beginner, 2=Intermediate, 3=Advanced, 4=Pro
    - `unlock_requirement` (integer) - XP needed to unlock
    - `xp_reward` (integer) - XP for completing module
    - `order_index` (integer)
    - `created_at` (timestamptz)

  - `learning_lessons` - Individual lessons within modules
    - `id` (uuid, primary key)
    - `module_id` (uuid, foreign key)
    - `title` (text)
    - `description` (text)
    - `content` (jsonb) - Rich content (text, images, videos, code)
    - `duration_minutes` (integer)
    - `xp_reward` (integer)
    - `order_index` (integer)
    - `created_at` (timestamptz)

  - `learning_quizzes` - Quizzes for lessons
    - `id` (uuid, primary key)
    - `lesson_id` (uuid, foreign key)
    - `title` (text)
    - `passing_score` (integer) - Percentage needed to pass
    - `xp_reward` (integer)
    - `time_limit_seconds` (integer)
    - `created_at` (timestamptz)

  - `quiz_questions` - Individual quiz questions
    - `id` (uuid, primary key)
    - `quiz_id` (uuid, foreign key)
    - `question_text` (text)
    - `question_type` (text) - multiple_choice, true_false, code
    - `points` (integer)
    - `order_index` (integer)
    - `explanation` (text) - Shown after answer
    - `created_at` (timestamptz)

  - `quiz_options` - Answer options for questions
    - `id` (uuid, primary key)
    - `question_id` (uuid, foreign key)
    - `option_text` (text)
    - `is_correct` (boolean)
    - `order_index` (integer)
    - `created_at` (timestamptz)

  ### User Progress Tables
  - `user_learning_progress` - Track lesson completion
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key)
    - `lesson_id` (uuid, foreign key)
    - `completed` (boolean)
    - `xp_earned` (integer)
    - `completed_at` (timestamptz)
    - `created_at` (timestamptz)

  - `user_quiz_attempts` - Track quiz attempts
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key)
    - `quiz_id` (uuid, foreign key)
    - `score` (integer) - Percentage score
    - `xp_earned` (integer)
    - `passed` (boolean)
    - `time_taken_seconds` (integer)
    - `answers` (jsonb) - User's answers
    - `created_at` (timestamptz)

  - `user_xp_totals` - Total XP per topic
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key)
    - `topic_id` (uuid, foreign key)
    - `total_xp` (integer)
    - `current_level` (integer)
    - `updated_at` (timestamptz)

  ### Gamification Tables
  - `achievements` - Available achievements
    - `id` (uuid, primary key)
    - `title` (text)
    - `description` (text)
    - `icon` (text)
    - `badge_color` (text)
    - `requirement_type` (text) - complete_topic, reach_level, streak, etc.
    - `requirement_value` (integer)
    - `xp_reward` (integer)
    - `created_at` (timestamptz)

  - `user_achievements` - Achievements earned
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key)
    - `achievement_id` (uuid, foreign key)
    - `earned_at` (timestamptz)

  - `daily_streaks` - Track daily learning streaks
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key)
    - `current_streak` (integer)
    - `longest_streak` (integer)
    - `last_activity_date` (date)
    - `total_days_learned` (integer)
    - `updated_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Users can read all learning content
  - Users can only read/write their own progress
  - Leaderboards are publicly readable
*/

-- Learning Content Tables
CREATE TABLE IF NOT EXISTS learning_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'BookOpen',
  color text NOT NULL DEFAULT 'blue',
  total_xp integer NOT NULL DEFAULT 0,
  estimated_hours integer NOT NULL DEFAULT 10,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES learning_topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  unlock_requirement integer NOT NULL DEFAULT 0,
  xp_reward integer NOT NULL DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  duration_minutes integer NOT NULL DEFAULT 10,
  xp_reward integer NOT NULL DEFAULT 50,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  passing_score integer NOT NULL DEFAULT 70,
  xp_reward integer NOT NULL DEFAULT 100,
  time_limit_seconds integer DEFAULT 300,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES learning_quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'multiple_choice',
  points integer NOT NULL DEFAULT 10,
  order_index integer NOT NULL DEFAULT 0,
  explanation text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User Progress Tables
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  xp_earned integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES learning_quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  xp_earned integer NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  time_taken_seconds integer,
  answers jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_xp_totals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES learning_topics(id) ON DELETE CASCADE,
  total_xp integer NOT NULL DEFAULT 0,
  current_level integer NOT NULL DEFAULT 1,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Gamification Tables
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Award',
  badge_color text NOT NULL DEFAULT 'gold',
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL DEFAULT 0,
  xp_reward integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS daily_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_activity_date date,
  total_days_learned integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE learning_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp_totals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Learning Content (Public Read)
CREATE POLICY "Anyone can view learning topics"
  ON learning_topics FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view learning modules"
  ON learning_modules FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view learning lessons"
  ON learning_lessons FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view learning quizzes"
  ON learning_quizzes FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view quiz options"
  ON quiz_options FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated, anon
  USING (true);

-- RLS Policies for User Progress (Own Data Only)
CREATE POLICY "Users can view own learning progress"
  ON user_learning_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress"
  ON user_learning_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress"
  ON user_learning_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own XP totals"
  ON user_xp_totals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP totals"
  ON user_xp_totals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own XP totals"
  ON user_xp_totals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own daily streaks"
  ON daily_streaks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily streaks"
  ON daily_streaks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily streaks"
  ON daily_streaks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learning_modules_topic ON learning_modules(topic_id);
CREATE INDEX IF NOT EXISTS idx_learning_lessons_module ON learning_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_learning_quizzes_lesson ON learning_quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question ON quiz_options(question_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_learning_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_totals_user ON user_xp_totals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_streaks_user ON daily_streaks(user_id);
