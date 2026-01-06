/*
  # Add Sample Tech Support Data
  
  1. Sample Data
    - Tech support service categories
    - Sample support services
    - Knowledge base articles
    
  2. Updates
    - Update existing categories for tech support context
*/

-- Add tech support categories
INSERT INTO categories (name, description, type, slug) VALUES
  ('Hardware Support', 'Computer hardware troubleshooting and repair', 'product', 'hardware-support'),
  ('Software Support', 'Software installation, configuration, and troubleshooting', 'product', 'software-support'),
  ('Network Support', 'Network setup, security, and troubleshooting', 'product', 'network-support'),
  ('Cloud Services', 'Cloud platform setup and management', 'product', 'cloud-services'),
  ('Cybersecurity', 'Security audits and protection services', 'product', 'cybersecurity'),
  ('Data Recovery', 'Data backup and recovery services', 'product', 'data-recovery'),
  ('Mobile Support', 'Smartphone and tablet support', 'product', 'mobile-support'),
  ('Web Development', 'Website and web application support', 'product', 'web-development')
ON CONFLICT (slug) DO NOTHING;

-- Add sample support services
INSERT INTO support_services (title, description, category_id, service_type, price, duration_minutes, languages_supported, features) 
SELECT 
  'Computer Hardware Diagnosis',
  'Professional diagnosis and repair of computer hardware issues including motherboards, RAM, hard drives, and peripherals',
  id,
  'remote',
  49.99,
  60,
  '{"en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "ko", "it"}',
  '["Remote diagnostics", "Hardware testing", "Repair recommendations", "24/7 availability"]'::jsonb
FROM categories WHERE slug = 'hardware-support'
ON CONFLICT DO NOTHING;

INSERT INTO support_services (title, description, category_id, service_type, price, duration_minutes, languages_supported, features)
SELECT 
  'Software Installation & Configuration',
  'Expert assistance with installing and configuring software applications, operating systems, and drivers',
  id,
  'remote',
  39.99,
  45,
  '{"en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "ko", "it"}',
  '["OS installation", "Driver updates", "Application setup", "Configuration optimization"]'::jsonb
FROM categories WHERE slug = 'software-support'
ON CONFLICT DO NOTHING;

INSERT INTO support_services (title, description, category_id, service_type, price, duration_minutes, languages_supported, features)
SELECT 
  'Network Setup & Troubleshooting',
  'Complete network setup, Wi-Fi optimization, and troubleshooting connectivity issues',
  id,
  'video',
  59.99,
  90,
  '{"en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "ko", "it"}',
  '["Router configuration", "Wi-Fi optimization", "VPN setup", "Security hardening"]'::jsonb
FROM categories WHERE slug = 'network-support'
ON CONFLICT DO NOTHING;

INSERT INTO support_services (title, description, category_id, service_type, price, duration_minutes, languages_supported, features)
SELECT 
  'Cloud Migration Services',
  'Seamless migration of your data and applications to cloud platforms like AWS, Azure, or Google Cloud',
  id,
  'video',
  149.99,
  120,
  '{"en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "ko", "it"}',
  '["Cloud architecture", "Data migration", "Cost optimization", "Security setup"]'::jsonb
FROM categories WHERE slug = 'cloud-services'
ON CONFLICT DO NOTHING;

INSERT INTO support_services (title, description, category_id, service_type, price, duration_minutes, languages_supported, features)
SELECT 
  'Cybersecurity Audit',
  'Comprehensive security audit to identify vulnerabilities and implement protection measures',
  id,
  'remote',
  199.99,
  180,
  '{"en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "ko", "it"}',
  '["Vulnerability assessment", "Malware removal", "Firewall setup", "Security training"]'::jsonb
FROM categories WHERE slug = 'cybersecurity'
ON CONFLICT DO NOTHING;

INSERT INTO support_services (title, description, category_id, service_type, price, duration_minutes, languages_supported, features)
SELECT 
  'Data Recovery & Backup',
  'Professional data recovery from failed drives and setup of automated backup solutions',
  id,
  'remote',
  99.99,
  90,
  '{"en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "ko", "it"}',
  '["Data recovery", "Backup setup", "Cloud backup", "Disaster recovery plan"]'::jsonb
FROM categories WHERE slug = 'data-recovery'
ON CONFLICT DO NOTHING;

INSERT INTO support_services (title, description, category_id, service_type, price, duration_minutes, languages_supported, features)
SELECT 
  'Mobile Device Support',
  'Troubleshooting and optimization for smartphones and tablets (iOS and Android)',
  id,
  'chat',
  29.99,
  30,
  '{"en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "ko", "it"}',
  '["iOS & Android support", "App troubleshooting", "Performance optimization", "Data transfer"]'::jsonb
FROM categories WHERE slug = 'mobile-support'
ON CONFLICT DO NOTHING;

INSERT INTO support_services (title, description, category_id, service_type, price, duration_minutes, languages_supported, features)
SELECT 
  'Website Maintenance & Support',
  'Ongoing website maintenance, updates, and technical support for web applications',
  id,
  'remote',
  79.99,
  60,
  '{"en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "ko", "it"}',
  '["Website updates", "Bug fixes", "Performance optimization", "Security patches"]'::jsonb
FROM categories WHERE slug = 'web-development'
ON CONFLICT DO NOTHING;

-- Add sample knowledge base articles
INSERT INTO knowledge_base (title, content, summary, category_id, language, tags, is_published)
SELECT 
  'How to Reset Your Computer Password',
  'Step-by-step guide to resetting your Windows or Mac computer password. Includes methods for both local accounts and Microsoft/Apple accounts.',
  'Learn how to reset your computer password using built-in recovery tools',
  id,
  'en',
  '{"password", "reset", "windows", "mac", "security"}',
  true
FROM categories WHERE slug = 'hardware-support'
LIMIT 1;

INSERT INTO knowledge_base (title, content, summary, category_id, language, tags, is_published)
SELECT 
  'Troubleshooting Slow Computer Performance',
  'Common causes of slow computer performance and how to fix them. Includes disk cleanup, startup program management, and hardware upgrades.',
  'Fix slow computer performance with these proven troubleshooting steps',
  id,
  'en',
  '{"performance", "slow", "optimization", "speed", "troubleshooting"}',
  true
FROM categories WHERE slug = 'software-support'
LIMIT 1;

INSERT INTO knowledge_base (title, content, summary, category_id, language, tags, is_published)
SELECT 
  'Setting Up a Secure Home Wi-Fi Network',
  'Complete guide to setting up a secure home Wi-Fi network including router configuration, password best practices, and guest network setup.',
  'Learn how to set up and secure your home Wi-Fi network',
  id,
  'en',
  '{"wifi", "network", "security", "router", "setup"}',
  true
FROM categories WHERE slug = 'network-support'
LIMIT 1;