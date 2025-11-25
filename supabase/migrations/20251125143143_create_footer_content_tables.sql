/*
  # Create Footer Content Tables

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `subscribed_at` (timestamptz)
      - `is_active` (boolean)
      - `unsubscribe_token` (text, unique)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `author_id` (uuid, foreign key)
      - `featured_image` (text)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `static_pages`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `content` (text)
      - `meta_description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Restrict write access to authenticated users/admins
*/

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL CHECK (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  unsubscribe_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Subscribers can view own subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Subscribers can update own subscription"
  ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  featured_image TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Authors can create blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Static Pages Table
CREATE TABLE IF NOT EXISTS static_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view static pages"
  ON static_pages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create static pages"
  ON static_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update static pages"
  ON static_pages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_static_pages_slug ON static_pages(slug);

-- Insert default static pages
INSERT INTO static_pages (title, slug, content, meta_description) VALUES
  (
    'About Us',
    'about',
    '<h1>About MarketHub</h1><p>MarketHub is your complete marketplace and career hub, connecting buyers, sellers, job seekers, and employers in one unified platform.</p><p>Founded in 2024, we are committed to creating a trusted community where commerce and career opportunities thrive.</p>',
    'Learn about MarketHub - your trusted marketplace and career platform'
  ),
  (
    'Help Center',
    'help',
    '<h1>Help Center</h1><h2>Frequently Asked Questions</h2><h3>How do I create an account?</h3><p>Click the Sign Up button and follow the registration process.</p><h3>How do I sell products?</h3><p>Navigate to "Sell Products" and complete the seller registration.</p>',
    'Get help with your MarketHub account, orders, and more'
  ),
  (
    'Contact Us',
    'contact',
    '<h1>Contact Us</h1><p>Have questions? We are here to help!</p><p><strong>Email:</strong> support@markethub.com</p><p><strong>Phone:</strong> 1-800-MARKET-HUB</p><p><strong>Hours:</strong> Monday-Friday, 9am-5pm EST</p>',
    'Get in touch with MarketHub support team'
  ),
  (
    'Terms of Service',
    'terms',
    '<h1>Terms of Service</h1><p>Last updated: 2024</p><h2>1. Agreement to Terms</h2><p>By accessing MarketHub, you agree to these Terms of Service.</p><h2>2. User Responsibilities</h2><p>You are responsible for maintaining the security of your account.</p>',
    'MarketHub Terms of Service and user agreement'
  ),
  (
    'Privacy Policy',
    'privacy',
    '<h1>Privacy Policy</h1><p>Last updated: 2024</p><h2>Information We Collect</h2><p>We collect information you provide when creating an account and using our services.</p><h2>How We Use Information</h2><p>We use your information to provide and improve our services.</p>',
    'Learn how MarketHub protects your privacy'
  ),
  (
    'Refund Policy',
    'refund-policy',
    '<h1>Refund Policy</h1><h2>Returns</h2><p>Items can be returned within 30 days of purchase in original condition.</p><h2>Refund Process</h2><p>Refunds are processed within 5-7 business days after we receive your return.</p>',
    'MarketHub refund and return policy'
  )
ON CONFLICT (slug) DO NOTHING;
