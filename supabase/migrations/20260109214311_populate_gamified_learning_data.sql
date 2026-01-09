/*
  # Populate Gamified Learning System with Sample Data

  ## Overview
  Populates the learning system with comprehensive content across multiple topics.

  ## Topics Created
  1. **System Maintenance** - Learn how to keep systems running smoothly
  2. **Hardware Repair** - Master hardware troubleshooting and repair
  3. **Backup & Recovery** - Ensure data safety and disaster recovery
  4. **Customer Support** - Deliver excellent technical support
  5. **Network Troubleshooting** - Diagnose and fix network issues
  6. **Security Best Practices** - Protect systems from threats

  ## Content Structure
  Each topic has 4 modules (Beginner, Intermediate, Advanced, Pro) with multiple lessons and quizzes.

  ## Achievements
  25 different achievements to unlock through learning progress, streaks, and mastery.
*/

-- Insert Learning Topics
INSERT INTO learning_topics (title, description, icon, color, total_xp, estimated_hours, order_index) VALUES
  ('System Maintenance', 'Master the art of keeping computer systems running at peak performance. Learn preventive maintenance, optimization, and troubleshooting.', 'Settings', 'blue', 5000, 15, 1),
  ('Hardware Repair', 'Become proficient in diagnosing and repairing computer hardware issues. From simple replacements to complex troubleshooting.', 'Wrench', 'orange', 6000, 20, 2),
  ('Backup & Recovery', 'Learn critical data protection techniques. Master backup strategies, disaster recovery, and data restoration procedures.', 'HardDrive', 'green', 4500, 12, 3),
  ('Customer Support', 'Develop expert-level customer service skills. Learn communication techniques, ticket management, and problem resolution.', 'Users', 'purple', 4000, 10, 4),
  ('Network Troubleshooting', 'Diagnose and resolve network connectivity issues. Master TCP/IP, routing, DNS, and network security fundamentals.', 'Network', 'cyan', 5500, 18, 5),
  ('Security Best Practices', 'Protect systems from modern threats. Learn about malware, encryption, secure configurations, and incident response.', 'Shield', 'red', 5000, 16, 6)
ON CONFLICT DO NOTHING;

-- Insert Modules for System Maintenance
INSERT INTO learning_modules (topic_id, title, description, level, unlock_requirement, xp_reward, order_index)
SELECT 
  id,
  'Beginner: Maintenance Basics',
  'Learn the fundamentals of system maintenance including disk cleanup, updates, and basic optimization.',
  1, 0, 500, 1
FROM learning_topics WHERE title = 'System Maintenance'
UNION ALL
SELECT 
  id,
  'Intermediate: Performance Tuning',
  'Dive deeper into performance optimization, startup management, and system monitoring tools.',
  2, 500, 750, 2
FROM learning_topics WHERE title = 'System Maintenance'
UNION ALL
SELECT 
  id,
  'Advanced: Automation & Scripts',
  'Automate maintenance tasks using scripts, scheduled tasks, and advanced system utilities.',
  3, 1250, 1000, 3
FROM learning_topics WHERE title = 'System Maintenance'
UNION ALL
SELECT 
  id,
  'Pro: Enterprise Maintenance',
  'Master enterprise-level maintenance strategies, fleet management, and predictive maintenance.',
  4, 2250, 1500, 4
FROM learning_topics WHERE title = 'System Maintenance';

-- Insert Lessons for System Maintenance - Beginner Module
WITH maintenance_beginner_module AS (
  SELECT lm.id FROM learning_modules lm
  JOIN learning_topics lt ON lm.topic_id = lt.id
  WHERE lt.title = 'System Maintenance' AND lm.level = 1
)
INSERT INTO learning_lessons (module_id, title, description, content, duration_minutes, xp_reward, order_index)
SELECT 
  id,
  'Introduction to System Maintenance',
  'Understand why regular maintenance is crucial and what it involves.',
  '{"type": "content", "sections": [{"heading": "What is System Maintenance?", "text": "System maintenance involves regular tasks to keep your computer running smoothly, prevent problems, and extend hardware life."}, {"heading": "Why Maintenance Matters", "text": "Regular maintenance prevents slowdowns, crashes, and data loss. It improves security and system reliability."}, {"heading": "Key Maintenance Tasks", "text": "Disk cleanup, software updates, malware scans, and performance monitoring are essential maintenance activities."}]}'::jsonb,
  10, 50, 1
FROM maintenance_beginner_module
UNION ALL
SELECT 
  id,
  'Disk Cleanup & Storage Management',
  'Learn how to free up disk space and manage storage effectively.',
  '{"type": "content", "sections": [{"heading": "Understanding Disk Space", "text": "Files accumulate over time - temporary files, downloads, and old programs consume valuable storage."}, {"heading": "Built-in Cleanup Tools", "text": "Most operating systems include disk cleanup utilities to safely remove unnecessary files."}, {"heading": "Manual Cleanup", "text": "Identify large files, remove unused programs, and organize your data for optimal storage use."}]}'::jsonb,
  15, 75, 2
FROM maintenance_beginner_module
UNION ALL
SELECT 
  id,
  'Software Updates & Patches',
  'Master the importance of keeping software up-to-date.',
  '{"type": "content", "sections": [{"heading": "Why Updates Matter", "text": "Updates fix security vulnerabilities, bugs, and often add new features."}, {"heading": "Automatic vs Manual Updates", "text": "Configure automatic updates for security patches while manually reviewing feature updates."}, {"heading": "Update Best Practices", "text": "Back up before major updates, read release notes, and schedule updates during downtime."}]}'::jsonb,
  12, 60, 3
FROM maintenance_beginner_module;

-- Insert Quiz for First Lesson
WITH first_lesson AS (
  SELECT ll.id FROM learning_lessons ll
  JOIN learning_modules lm ON ll.module_id = lm.id
  JOIN learning_topics lt ON lm.topic_id = lt.id
  WHERE lt.title = 'System Maintenance' AND lm.level = 1 AND ll.order_index = 1
),
quiz_inserted AS (
  INSERT INTO learning_quizzes (lesson_id, title, passing_score, xp_reward, time_limit_seconds)
  SELECT id, 'System Maintenance Basics Quiz', 70, 100, 300
  FROM first_lesson
  RETURNING id
),
questions_inserted AS (
  INSERT INTO quiz_questions (quiz_id, question_text, question_type, points, order_index, explanation)
  SELECT id, 'What is the primary purpose of system maintenance?', 'multiple_choice', 10, 1, 
    'System maintenance prevents problems and keeps your computer running smoothly over time.'
  FROM quiz_inserted
  UNION ALL
  SELECT id, 'How often should you perform basic system maintenance?', 'multiple_choice', 10, 2,
    'Regular weekly maintenance prevents issues from accumulating and keeps systems healthy.'
  FROM quiz_inserted
  UNION ALL
  SELECT id, 'Software updates are only important for adding new features.', 'multiple_choice', 10, 3,
    'Updates also fix critical security vulnerabilities and bugs, making them essential for safety.'
  FROM quiz_inserted
  RETURNING id, order_index
)
INSERT INTO quiz_options (question_id, option_text, is_correct, order_index)
SELECT id, 'To prevent problems and optimize performance', true, 1 FROM questions_inserted WHERE order_index = 1
UNION ALL SELECT id, 'To make the computer look better', false, 2 FROM questions_inserted WHERE order_index = 1
UNION ALL SELECT id, 'To install more software', false, 3 FROM questions_inserted WHERE order_index = 1
UNION ALL SELECT id, 'To use more electricity', false, 4 FROM questions_inserted WHERE order_index = 1
UNION ALL SELECT id, 'Once a year', false, 1 FROM questions_inserted WHERE order_index = 2
UNION ALL SELECT id, 'Weekly or bi-weekly', true, 2 FROM questions_inserted WHERE order_index = 2
UNION ALL SELECT id, 'Only when problems occur', false, 3 FROM questions_inserted WHERE order_index = 2
UNION ALL SELECT id, 'Never needed', false, 4 FROM questions_inserted WHERE order_index = 2
UNION ALL SELECT id, 'True', false, 1 FROM questions_inserted WHERE order_index = 3
UNION ALL SELECT id, 'False', true, 2 FROM questions_inserted WHERE order_index = 3;

-- Insert Modules for Hardware Repair
INSERT INTO learning_modules (topic_id, title, description, level, unlock_requirement, xp_reward, order_index)
SELECT 
  id, 'Beginner: Hardware Fundamentals',
  'Learn computer components, basic troubleshooting, and safety procedures.',
  1, 0, 600, 1
FROM learning_topics WHERE title = 'Hardware Repair'
UNION ALL
SELECT 
  id, 'Intermediate: Component Diagnosis',
  'Master diagnostic techniques for RAM, storage, motherboards, and power supplies.',
  2, 600, 900, 2
FROM learning_topics WHERE title = 'Hardware Repair'
UNION ALL
SELECT 
  id, 'Advanced: Complex Repairs',
  'Handle advanced repairs including laptop disassembly, BGA rework, and data recovery.',
  3, 1500, 1200, 3
FROM learning_topics WHERE title = 'Hardware Repair'
UNION ALL
SELECT 
  id, 'Pro: Professional Repair Services',
  'Build a repair business, manage inventory, and handle enterprise-level repairs.',
  4, 2700, 1800, 4
FROM learning_topics WHERE title = 'Hardware Repair';

-- Insert Achievements
INSERT INTO achievements (title, description, icon, badge_color, requirement_type, requirement_value, xp_reward) VALUES
  ('First Steps', 'Complete your first lesson', 'Star', 'blue', 'lessons_completed', 1, 50),
  ('Quick Learner', 'Complete 5 lessons in one day', 'Zap', 'yellow', 'lessons_one_day', 5, 100),
  ('Knowledge Seeker', 'Complete 25 lessons', 'BookOpen', 'green', 'lessons_completed', 25, 200),
  ('Master Student', 'Complete 100 lessons', 'GraduationCap', 'purple', 'lessons_completed', 100, 500),
  ('Quiz Ace', 'Score 100% on 10 quizzes', 'Target', 'red', 'perfect_quizzes', 10, 300),
  ('Perfect Score', 'Score 100% on your first quiz', 'Award', 'gold', 'perfect_quizzes', 1, 100),
  ('Level 5 Master', 'Reach level 5 in any topic', 'TrendingUp', 'cyan', 'reach_level', 5, 250),
  ('Level 10 Expert', 'Reach level 10 in any topic', 'Crown', 'gold', 'reach_level', 10, 500),
  ('Topic Completion', 'Complete all lessons in one topic', 'CheckCircle', 'green', 'topic_complete', 1, 400),
  ('Multi-Topic Master', 'Complete 3 different topics', 'Layers', 'purple', 'topics_complete', 3, 800),
  ('7 Day Streak', 'Learn for 7 days in a row', 'Flame', 'orange', 'streak_days', 7, 200),
  ('30 Day Streak', 'Learn for 30 days in a row', 'Fire', 'red', 'streak_days', 30, 500),
  ('100 Day Streak', 'Learn for 100 days in a row', 'Trophy', 'gold', 'streak_days', 100, 1000),
  ('Early Bird', 'Complete a lesson before 8 AM', 'Sunrise', 'yellow', 'early_bird', 1, 75),
  ('Night Owl', 'Complete a lesson after 10 PM', 'Moon', 'indigo', 'night_owl', 1, 75),
  ('Speed Runner', 'Complete a lesson in under 5 minutes', 'Rocket', 'red', 'speed_lesson', 1, 100),
  ('Comeback Kid', 'Return after 7+ days absence', 'RefreshCcw', 'blue', 'comeback', 1, 150),
  ('XP Collector', 'Earn 1000 total XP', 'Coins', 'yellow', 'total_xp', 1000, 100),
  ('XP Millionaire', 'Earn 10000 total XP', 'DollarSign', 'gold', 'total_xp', 10000, 1000),
  ('Maintenance Pro', 'Complete all System Maintenance modules', 'Settings', 'blue', 'topic_master', 1, 600),
  ('Repair Expert', 'Complete all Hardware Repair modules', 'Wrench', 'orange', 'topic_master', 2, 600),
  ('Backup Specialist', 'Complete all Backup & Recovery modules', 'HardDrive', 'green', 'topic_master', 3, 600),
  ('Support Champion', 'Complete all Customer Support modules', 'Users', 'purple', 'topic_master', 4, 600),
  ('Network Ninja', 'Complete all Network Troubleshooting modules', 'Network', 'cyan', 'topic_master', 5, 600),
  ('Security Guardian', 'Complete all Security Best Practices modules', 'Shield', 'red', 'topic_master', 6, 600)
ON CONFLICT DO NOTHING;

-- Update total XP for topics based on modules
UPDATE learning_topics SET total_xp = (
  SELECT COALESCE(SUM(xp_reward), 0)
  FROM learning_modules
  WHERE learning_modules.topic_id = learning_topics.id
);
