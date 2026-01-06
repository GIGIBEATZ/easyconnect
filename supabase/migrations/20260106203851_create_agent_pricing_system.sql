/*
  # Create Agent Pricing and Price Negotiation System

  1. New Tables
    - `agent_pricing_profiles` - Agent hourly rates and pricing details
    - `price_proposals` - Price quotes sent by agents to clients
    - `price_negotiation_history` - Track all price offer/counter-offer interactions
    - `agreed_pricing` - Final agreed prices for support tickets

  2. Security
    - Enable RLS on all tables
    - Agents can create/view their own pricing profiles
    - Clients can view proposals sent to them and create counter offers
    - Only ticket participants can view agreed pricing

  3. Important Notes
    - All prices stored in cents (multiply USD by 100)
    - Price proposals have expiration dates
    - Track negotiation history for disputes
    - Final agreed price is immutable once ticket created
*/

CREATE TABLE IF NOT EXISTS agent_pricing_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hourly_rate integer NOT NULL DEFAULT 5000,
  base_rate integer NOT NULL DEFAULT 2500,
  minimum_charge integer NOT NULL DEFAULT 2500,
  currency text NOT NULL DEFAULT 'USD',
  allows_negotiation boolean DEFAULT true,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_id)
);

CREATE TABLE IF NOT EXISTS price_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  breakdown jsonb DEFAULT '[]'::jsonb,
  subtotal integer NOT NULL,
  discount_amount integer DEFAULT 0,
  total_price integer NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_terms text,
  status text DEFAULT 'draft',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS price_negotiation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES price_proposals(id) ON DELETE CASCADE,
  from_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  proposed_amount integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agreed_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL UNIQUE REFERENCES support_tickets(id) ON DELETE CASCADE,
  proposal_id uuid REFERENCES price_proposals(id) ON DELETE SET NULL,
  agent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  final_price integer NOT NULL,
  breakdown jsonb DEFAULT '[]'::jsonb,
  currency text NOT NULL DEFAULT 'USD',
  payment_terms text,
  agreed_by_agent_at timestamptz,
  agreed_by_client_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE agent_pricing_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_negotiation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreed_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view own pricing profile"
  ON agent_pricing_profiles FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can create pricing profile"
  ON agent_pricing_profiles FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update own pricing"
  ON agent_pricing_profiles FOR UPDATE
  TO authenticated
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can view pricing profiles for browsing"
  ON agent_pricing_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can create proposals"
  ON price_proposals FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agent can view own proposals"
  ON price_proposals FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Client can view proposals sent to them"
  ON price_proposals FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Agent can update own proposal"
  ON price_proposals FOR UPDATE
  TO authenticated
  USING (agent_id = auth.uid() AND status IN ('draft', 'sent'))
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Users can view negotiation history"
  ON price_negotiation_history FOR SELECT
  TO authenticated
  USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

CREATE POLICY "Users can create negotiation records"
  ON price_negotiation_history FOR INSERT
  TO authenticated
  WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Ticket participants can view agreed pricing"
  ON agreed_pricing FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid() OR client_id = auth.uid());

CREATE POLICY "System can create agreed pricing"
  ON agreed_pricing FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = auth.uid() OR client_id = auth.uid());

CREATE INDEX idx_agent_pricing_agent_id ON agent_pricing_profiles(agent_id);
CREATE INDEX idx_price_proposals_agent_id ON price_proposals(agent_id);
CREATE INDEX idx_price_proposals_client_id ON price_proposals(client_id);
CREATE INDEX idx_price_proposals_status ON price_proposals(status);
CREATE INDEX idx_agreed_pricing_ticket_id ON agreed_pricing(ticket_id);
CREATE INDEX idx_agreed_pricing_agent_id ON agreed_pricing(agent_id);
CREATE INDEX idx_agreed_pricing_client_id ON agreed_pricing(client_id);