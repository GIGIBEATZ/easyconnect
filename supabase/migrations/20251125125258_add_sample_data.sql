/*
  # Add Sample Data for Testing

  ## Overview
  This migration adds sample categories, products, and jobs to help test the platform functionality.

  ## Categories
  - Product categories: Electronics, Fashion, Home & Garden, Books
  - Job categories: Technology, Healthcare, Education, Finance

  ## Sample Products
  - 5 sample products across different categories

  ## Sample Jobs
  - 5 sample job postings across different categories

  ## Important Notes
  - These are demo entries for testing purposes
  - Real user data will be added through the application interface
*/

-- Insert product categories
INSERT INTO categories (name, slug, type, description) VALUES
  ('Electronics', 'electronics', 'product', 'Electronic devices and accessories'),
  ('Fashion', 'fashion', 'product', 'Clothing, shoes, and accessories'),
  ('Home & Garden', 'home-garden', 'product', 'Furniture, decor, and gardening supplies'),
  ('Books', 'books', 'product', 'Physical and digital books')
ON CONFLICT (slug) DO NOTHING;

-- Insert job categories
INSERT INTO categories (name, slug, type, description) VALUES
  ('Technology', 'technology', 'job', 'IT, software development, and tech roles'),
  ('Healthcare', 'healthcare', 'job', 'Medical and healthcare positions'),
  ('Education', 'education', 'job', 'Teaching and educational roles'),
  ('Finance', 'finance', 'job', 'Financial and accounting positions')
ON CONFLICT (slug) DO NOTHING;
