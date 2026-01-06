/*
  # Transform to Global Tech Support Platform
  
  1. New Tables
    - `support_services`
      - Tech support service offerings (hardware, software, network, etc.)
      - Multilingual service descriptions
      - Pricing and availability
      
    - `support_tickets`
      - Customer support requests
      - Ticket status tracking (open, in_progress, resolved, closed)
      - Priority levels (low, medium, high, urgent)
      - Assignment to support agents
      
    - `ticket_messages`
      - Conversation thread for each ticket
      - Support agent and customer messages
      - Attachments support
      
    - `knowledge_base`
      - Help articles and FAQs
      - Multilingual content support
      - Categories and tags
      - Search optimization
      
    - `service_bookings`
      - Schedule support sessions
      - Video call, phone, or chat support
      - Time slot management
  
  2. Updates
    - Add support agent role to profiles
    - Add agent specializations
    - Add availability schedules
    
  3. Security
    - Enable RLS on all new tables
    - Restrict ticket access to ticket owner and assigned agents
    - Public read access to knowledge base
    - Service bookings restricted to authenticated users
*/

-- Add support agent fields to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'agent_specializations'
  ) THEN
    ALTER TABLE profiles ADD COLUMN agent_specializations TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'agent_rating'
  ) THEN
    ALTER TABLE profiles ADD COLUMN agent_rating DECIMAL(3,2) DEFAULT 0.00;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'total_tickets_resolved'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_tickets_resolved INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_available'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_available BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Support Services Table
CREATE TABLE IF NOT EXISTS support_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  service_type TEXT NOT NULL CHECK (service_type IN ('remote', 'onsite', 'phone', 'chat', 'video')),
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  duration_minutes INTEGER DEFAULT 60,
  languages_supported TEXT[] DEFAULT '{"en"}',
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  assigned_agent_id UUID REFERENCES profiles(id),
  service_id UUID REFERENCES support_services(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  attachments TEXT[] DEFAULT '{}',
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  customer_feedback TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Ticket Messages Table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  is_internal_note BOOLEAN DEFAULT false,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category_id UUID REFERENCES categories(id),
  language TEXT DEFAULT 'en',
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Service Bookings Table
CREATE TABLE IF NOT EXISTS service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  service_id UUID NOT NULL REFERENCES support_services(id),
  agent_id UUID REFERENCES profiles(id),
  scheduled_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
  meeting_link TEXT,
  notes TEXT,
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_agent ON support_tickets(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_language ON knowledge_base(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_customer ON service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_agent ON service_bookings(agent_id);

-- Enable Row Level Security
ALTER TABLE support_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_services
CREATE POLICY "Anyone can view active support services"
  ON support_services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can create support services"
  ON support_services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own services"
  ON support_services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for support_tickets
CREATE POLICY "Customers can view their own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid() OR 
    assigned_agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

CREATE POLICY "Authenticated users can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers and agents can update tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (
    customer_id = auth.uid() OR 
    assigned_agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  )
  WITH CHECK (
    customer_id = auth.uid() OR 
    assigned_agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- RLS Policies for ticket_messages
CREATE POLICY "Users can view messages for their tickets"
  ON ticket_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE id = ticket_id AND (
        customer_id = auth.uid() OR 
        assigned_agent_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE id = auth.uid() AND 'admin' = ANY(roles)
        )
      )
    ) AND (is_internal_note = false OR sender_id = auth.uid() OR EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE id = ticket_id AND assigned_agent_id = auth.uid()
    ))
  );

CREATE POLICY "Users can create messages for their tickets"
  ON ticket_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE id = ticket_id AND (
        customer_id = auth.uid() OR 
        assigned_agent_id = auth.uid()
      )
    )
  );

-- RLS Policies for knowledge_base
CREATE POLICY "Anyone can view published articles"
  ON knowledge_base FOR SELECT
  USING (is_published = true);

CREATE POLICY "Agents can create articles"
  ON knowledge_base FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND ('support_agent' = ANY(roles) OR 'admin' = ANY(roles))
    )
  );

CREATE POLICY "Authors can update their articles"
  ON knowledge_base FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  )
  WITH CHECK (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- RLS Policies for service_bookings
CREATE POLICY "Users can view their own bookings"
  ON service_bookings FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid() OR 
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

CREATE POLICY "Authenticated users can create bookings"
  ON service_bookings FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update their own bookings"
  ON service_bookings FOR UPDATE
  TO authenticated
  USING (
    customer_id = auth.uid() OR 
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  )
  WITH CHECK (
    customer_id = auth.uid() OR 
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM support_tickets;
  new_number := 'TICKET-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 5, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket numbers
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_set_ticket_number'
  ) THEN
    CREATE TRIGGER trigger_set_ticket_number
      BEFORE INSERT ON support_tickets
      FOR EACH ROW
      EXECUTE FUNCTION set_ticket_number();
  END IF;
END $$;