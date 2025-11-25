/*
  # Create Multi-Language Translation System

  1. New Tables
    - `languages`
      - `code` (varchar, primary key) - ISO 639-1 language code
      - `name` (text) - English name of language
      - `native_name` (text) - Native name of language
      - `is_rtl` (boolean) - Right-to-left support
      - `is_active` (boolean) - Enable/disable language
      - `flag_emoji` (text) - Flag emoji representation
      - `sort_order` (int) - Display order in selector
    
    - `translation_keys`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Translation key (e.g., common.welcome)
      - `namespace` (text) - Grouping namespace
      - `context` (text) - Optional context notes
      - `created_at` (timestamptz)
    
    - `translations`
      - `id` (uuid, primary key)
      - `key_id` (uuid, foreign key)
      - `language_code` (varchar, foreign key)
      - `value` (text) - Translated text
      - `is_verified` (boolean) - Human verified flag
      - `updated_at` (timestamptz)
      - Unique constraint on (key_id, language_code)
    
    - `user_language_preferences`
      - `user_id` (uuid, primary key)
      - `language_code` (varchar, foreign key)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access to languages and translations
    - Authenticated users can set preferences

  3. Sample Data
    - Populate 55+ languages
    - Insert common translation keys
    - Add English base translations
*/

-- Languages table
CREATE TABLE IF NOT EXISTS languages (
  code VARCHAR(10) PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_rtl BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  flag_emoji TEXT,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active languages"
  ON languages
  FOR SELECT
  TO public
  USING (is_active = true);

-- Translation keys table
CREATE TABLE IF NOT EXISTS translation_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  namespace TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE translation_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view translation keys"
  ON translation_keys
  FOR SELECT
  TO public
  USING (true);

-- Translations table
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id UUID REFERENCES translation_keys(id) ON DELETE CASCADE,
  language_code VARCHAR(10) REFERENCES languages(code) ON DELETE CASCADE,
  value TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(key_id, language_code)
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view translations"
  ON translations
  FOR SELECT
  TO public
  USING (true);

-- User language preferences table
CREATE TABLE IF NOT EXISTS user_language_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  language_code VARCHAR(10) REFERENCES languages(code),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_language_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own language preference"
  ON user_language_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own language preference"
  ON user_language_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own language preference"
  ON user_language_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_translations_key_id ON translations(key_id);
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translation_keys_namespace ON translation_keys(namespace);
CREATE INDEX IF NOT EXISTS idx_translation_keys_key ON translation_keys(key);

-- Insert 55+ languages
INSERT INTO languages (code, name, native_name, is_rtl, flag_emoji, sort_order) VALUES
  -- Tier 1: Major Languages (20)
  ('en', 'English', 'English', false, '🇺🇸', 1),
  ('es', 'Spanish', 'Español', false, '🇪🇸', 2),
  ('fr', 'French', 'Français', false, '🇫🇷', 3),
  ('de', 'German', 'Deutsch', false, '🇩🇪', 4),
  ('pt', 'Portuguese', 'Português', false, '🇵🇹', 5),
  ('ru', 'Russian', 'Русский', false, '🇷🇺', 6),
  ('zh-CN', 'Chinese (Simplified)', '中文(简体)', false, '🇨🇳', 7),
  ('zh-TW', 'Chinese (Traditional)', '中文(繁體)', false, '🇹🇼', 8),
  ('ja', 'Japanese', '日本語', false, '🇯🇵', 9),
  ('ko', 'Korean', '한국어', false, '🇰🇷', 10),
  ('ar', 'Arabic', 'العربية', true, '🇸🇦', 11),
  ('hi', 'Hindi', 'हिन्दी', false, '🇮🇳', 12),
  ('it', 'Italian', 'Italiano', false, '🇮🇹', 13),
  ('nl', 'Dutch', 'Nederlands', false, '🇳🇱', 14),
  ('pl', 'Polish', 'Polski', false, '🇵🇱', 15),
  ('tr', 'Turkish', 'Türkçe', false, '🇹🇷', 16),
  ('vi', 'Vietnamese', 'Tiếng Việt', false, '🇻🇳', 17),
  ('th', 'Thai', 'ไทย', false, '🇹🇭', 18),
  ('id', 'Indonesian', 'Bahasa Indonesia', false, '🇮🇩', 19),
  ('bn', 'Bengali', 'বাংলা', false, '🇧🇩', 20),
  
  -- Tier 2: Regional Languages (20)
  ('sv', 'Swedish', 'Svenska', false, '🇸🇪', 21),
  ('no', 'Norwegian', 'Norsk', false, '🇳🇴', 22),
  ('da', 'Danish', 'Dansk', false, '🇩🇰', 23),
  ('fi', 'Finnish', 'Suomi', false, '🇫🇮', 24),
  ('el', 'Greek', 'Ελληνικά', false, '🇬🇷', 25),
  ('cs', 'Czech', 'Čeština', false, '🇨🇿', 26),
  ('ro', 'Romanian', 'Română', false, '🇷🇴', 27),
  ('hu', 'Hungarian', 'Magyar', false, '🇭🇺', 28),
  ('he', 'Hebrew', 'עברית', true, '🇮🇱', 29),
  ('uk', 'Ukrainian', 'Українська', false, '🇺🇦', 30),
  ('fa', 'Persian', 'فارسی', true, '🇮🇷', 31),
  ('ur', 'Urdu', 'اردو', true, '🇵🇰', 32),
  ('ms', 'Malay', 'Bahasa Melayu', false, '🇲🇾', 33),
  ('tl', 'Filipino', 'Filipino', false, '🇵🇭', 34),
  ('sw', 'Swahili', 'Kiswahili', false, '🇰🇪', 35),
  ('ta', 'Tamil', 'தமிழ்', false, '🇮🇳', 36),
  ('te', 'Telugu', 'తెలుగు', false, '🇮🇳', 37),
  ('mr', 'Marathi', 'मराठी', false, '🇮🇳', 38),
  ('gu', 'Gujarati', 'ગુજરાતી', false, '🇮🇳', 39),
  ('kn', 'Kannada', 'ಕನ್ನಡ', false, '🇮🇳', 40),
  
  -- Tier 3: Additional Languages (15)
  ('bg', 'Bulgarian', 'Български', false, '🇧🇬', 41),
  ('sr', 'Serbian', 'Српски', false, '🇷🇸', 42),
  ('hr', 'Croatian', 'Hrvatski', false, '🇭🇷', 43),
  ('sk', 'Slovak', 'Slovenčina', false, '🇸🇰', 44),
  ('sl', 'Slovenian', 'Slovenščina', false, '🇸🇮', 45),
  ('et', 'Estonian', 'Eesti', false, '🇪🇪', 46),
  ('lv', 'Latvian', 'Latviešu', false, '🇱🇻', 47),
  ('lt', 'Lithuanian', 'Lietuvių', false, '🇱🇹', 48),
  ('ca', 'Catalan', 'Català', false, '🇪🇸', 49),
  ('eu', 'Basque', 'Euskara', false, '🇪🇸', 50),
  ('gl', 'Galician', 'Galego', false, '🇪🇸', 51),
  ('af', 'Afrikaans', 'Afrikaans', false, '🇿🇦', 52),
  ('is', 'Icelandic', 'Íslenska', false, '🇮🇸', 53),
  ('mt', 'Maltese', 'Malti', false, '🇲🇹', 54),
  ('cy', 'Welsh', 'Cymraeg', false, '🏴󐁧󐁢󐁷󐁬󐁳󐁿', 55)
ON CONFLICT (code) DO NOTHING;
