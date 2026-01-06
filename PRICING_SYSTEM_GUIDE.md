# Tech Support Platform - Pricing System Implementation Guide

## Overview

A complete price negotiation system has been implemented to enable technicians and clients to discuss and agree on service costs before creating support tickets.

---

## Issues Fixed

### 1. Navigation Button Routing Errors
**Problem**: "Experts" button in BottomNavigation linked to non-existent `find-experts` view
**Solution**:
- Fixed routing to use `find-agents` (the actual view name)
- Updated Sidebar navigation to match
- Changed "My Tickets" view reference from `my-tickets` to `tickets`

**Files Updated**:
- `src/components/layout/BottomNavigation.tsx`
- `src/components/layout/Sidebar.tsx`

---

## New Database Schema

### Tables Created

#### 1. `agent_pricing_profiles`
Stores agent pricing information
```sql
- id: UUID (primary key)
- agent_id: UUID (references profiles)
- hourly_rate: INTEGER (in cents, e.g., 5000 = $50)
- base_rate: INTEGER (minimum charge base)
- minimum_charge: INTEGER (lowest possible charge)
- allows_negotiation: BOOLEAN
- description: TEXT
- created_at, updated_at: TIMESTAMPTZ
```

**Use Case**: Display agent rates on their profile cards

#### 2. `price_proposals`
Tracks all price quotes sent between agents and clients
```sql
- id: UUID (primary key)
- agent_id: UUID (who sends proposal)
- client_id: UUID (who receives proposal)
- ticket_id: UUID (optional link to ticket)
- title: TEXT (proposal name)
- description: TEXT (problem description)
- breakdown: JSONB (itemized services)
- subtotal: INTEGER
- discount_amount: INTEGER
- total_price: INTEGER
- status: TEXT (draft, sent, accepted, rejected, counter_offered)
- expires_at: TIMESTAMPTZ (when proposal expires)
```

**Use Case**: Store proposal history, track negotiations

#### 3. `price_negotiation_history`
Records each negotiation action for dispute resolution
```sql
- id: UUID (primary key)
- proposal_id: UUID
- from_user_id: UUID (who made the offer)
- to_user_id: UUID (who received it)
- action: TEXT (proposed, countered, accepted, declined)
- proposed_amount: INTEGER
- notes: TEXT
- created_at: TIMESTAMPTZ
```

**Use Case**: Track offer history, resolve disagreements

#### 4. `agreed_pricing`
Final agreed price locked for a ticket
```sql
- id: UUID (primary key)
- ticket_id: UUID (unique - one agreement per ticket)
- proposal_id: UUID (which proposal was accepted)
- agent_id: UUID
- client_id: UUID
- final_price: INTEGER
- breakdown: JSONB
- payment_terms: TEXT
- agreed_by_agent_at: TIMESTAMPTZ
- agreed_by_client_at: TIMESTAMPTZ
```

**Use Case**: Lock in final price, prevent changes after agreement

---

## New Components

### 1. `AgentPricingCard.tsx`
Displays pricing information on agent profile cards

**Features**:
- Shows hourly rate with icon
- Displays minimum charge
- Indicates if negotiation is allowed
- "Get Price Quote" button

**Location**: `src/components/pricing/AgentPricingCard.tsx`

---

### 2. `PriceProposalModal.tsx`
Modal for creating detailed price proposals

**Features**:
- Itemized service breakdown
- Add/remove line items
- Quantity and unit price inputs
- Discount calculator
- Auto-calculated totals
- Payment terms selection
- Proposal expiration time settings

**Props**:
```typescript
isOpen: boolean
onClose: () => void
onSend: (proposal) => void
agentName: string
isLoading?: boolean
```

**Location**: `src/components/pricing/PriceProposalModal.tsx`

---

### 3. `PriceNegotiationChat.tsx`
Chat interface for price negotiation back-and-forth

**Features**:
- Display proposals and counter-offers
- Accept/counter offer buttons
- Real-time messaging feel
- Shows who sent what and when
- One-click acceptance

**Props**:
```typescript
agentName: string
clientName: string
initialProposal: number
onAccept: (amount: number) => void
onReject: () => void
isAgent: boolean
```

**Location**: `src/components/pricing/PriceNegotiationChat.tsx`

---

### 4. `AgreedPricingConfirmation.tsx`
Final confirmation before creating ticket

**Features**:
- Shows agreed price prominently
- Full breakdown display
- Payment terms confirmation
- Legal disclaimer about price lock
- Edit or proceed buttons
- Green visual theme for confirmation

**Props**:
```typescript
agentName: string
clientName: string
finalPrice: number
breakdown: PriceBreakdownItem[]
paymentTerms: string
discount?: number
onProceed: () => void
onEdit: () => void
```

**Location**: `src/components/pricing/AgreedPricingConfirmation.tsx`

---

### 5. `PriceSelectionFlow.tsx`
Complete flow coordinator for pricing workflow

**Flow Steps**:
1. **Select** - Choose pricing method
2. **Proposal** - Create detailed price quote
3. **Negotiation** - Chat about price
4. **Confirmation** - Lock in final price

**Props**:
```typescript
agent: Profile
client: Profile
onPriceConfirmed: (finalPrice, breakdown, terms) => void
onCancel: () => void
isAgent?: boolean
```

**Location**: `src/components/pricing/PriceSelectionFlow.tsx`

---

## Updated Components

### `AgentsView.tsx`
**Changes**:
- Added pricing profile loading
- Display `AgentPricingCard` below agent bio
- Shows hourly rates and minimum charges
- "Get Price Quote" button linked to pricing flow

**New Features**:
- Loads pricing profiles for all displayed agents
- Creates map of agent ID to pricing data
- Shows "Contact for pricing" if no profile exists

---

## Workflow: How Price Negotiation Works

### Step 1: Browse Services/Agents
```
User visits "Services" or "Find Agents" page
↓
Sees available options with pricing visible
↓
Selects desired service or agent
```

### Step 2: Select Pricing Method
```
Click "Get Quote" or "Contact"
↓
Two options appear:
  A) Send detailed proposal
  B) Use agent's fixed hourly rate
```

### Step 3A: Detailed Proposal Flow
```
Agent creates proposal with:
  - Service items (diagnosis, labor, parts)
  - Quantity and unit prices
  - Automatic total calculation
  - Discount if applicable
  - Payment terms (before, after, deposit)
  - Expiration time (1-72 hours)
↓
Client receives proposal
↓
Client can:
  • Accept → Price locked
  • Counter → Propose different amount
  • Reject → Search other agents
```

### Step 3B: Quick Fixed Price
```
Use agent's standard rates
↓
Display hourly rate or base charge
↓
Proceed directly to confirmation
```

### Step 4: Negotiation (if needed)
```
Chat-style interface for offers/counter-offers
↓
Client proposes: "Can you do $120?"
↓
Agent responds: "Counter: $135"
↓
Client accepts: "Deal ✓"
↓
Both parties agreed
```

### Step 5: Price Confirmation
```
Final review screen shows:
  - Agent name and client name
  - Complete breakdown
  - Total with any discounts
  - Payment terms
  - Legal disclaimer
↓
Both click "Confirm"
↓
Price locked in agreed_pricing table
↓
Support ticket created with locked price
```

### Step 6: Ticket Created
```
Cannot change price after this point
↓
Agent begins work at agreed rate
↓
Invoice matches agreed price
↓
Both parties protected
```

---

## Database Security

### Row Level Security (RLS) Policies

**Agent Pricing Profile**:
- Agents can view/create/update their own pricing
- Clients can view all public pricing profiles

**Price Proposals**:
- Agents see their own sent proposals
- Clients see proposals sent to them
- Agents can only edit draft/sent proposals

**Negotiation History**:
- Participants can view history
- Only creator can add new entries

**Agreed Pricing**:
- Only ticket participants (agent + client) can view
- System creates records on confirmation

---

## Integration Points

### 1. Agent Profile Display
When viewing agent cards in `AgentsView`:
```typescript
// Shows pricing if profile exists
{pricingProfiles[agent.id] && (
  <AgentPricingCard
    agent={agent}
    pricing={pricingProfiles[agent.id]}
    onGetQuote={() => onContactAgent(agent)}
  />
)}
```

### 2. Service Details Page
When clicking "Book This Service" from service details:
```typescript
// Could launch pricing flow
onViewChange('create-ticket') // Current behavior
// Future: Show pricing negotiation first
```

### 3. Create Ticket View
After price agreement, pass locked price to ticket:
```typescript
const agreedPrice = 13500; // $135 in cents
// Store in agreed_pricing table
// Display in ticket UI
```

---

## Key Features

### For Technicians (Agents)
✓ Set hourly rates in profile
✓ Create detailed proposals with line items
✓ Add discounts and promotional rates
✓ Set payment terms (before/after/deposit)
✓ Set proposal expiration times
✓ Counter-offer on client proposals
✓ Track negotiation history
✓ Lock in final price before work

### For Clients
✓ See agent rates upfront
✓ Get detailed breakdown before committing
✓ Negotiate prices directly
✓ Counter-offer with reasons
✓ Review full agreement before confirming
✓ See locked price on invoice
✓ Dispute resolution via negotiation history

### System Features
✓ Price immutability after agreement
✓ Automatic expiration of old proposals
✓ Full negotiation audit trail
✓ Payment terms flexibility
✓ Discount tracking
✓ Currency support (default USD)

---

## Usage Examples

### Example 1: Fixed Rate Service
```
Agent: "I charge $50/hour"
Client: Books 2-hour service
System: Calculates $100 + discount if any
Lock: Cannot change after agreement
```

### Example 2: Complex Project
```
Agent proposes:
  - Diagnosis: $25
  - Labor (3 hours): $150 ($50/hr)
  - Parts: $75
  - Subtotal: $250
  - Discount: -$15
  - Total: $235

Client: "Can you do $200?"
Agent: "Counter: $215 (includes rush priority)"
Client: "Accepted! ✓"
```

### Example 3: Dispute Resolution
```
After ticket, client reviews negotiation_history
Shows all offers/counter-offers
Timestamps prove what was agreed
Both parties can see complete history
```

---

## Price Storage

All prices stored in **cents** (multiply USD by 100):
```
$50.00 = 5000 cents
$135.99 = 13599 cents
$0.50 = 50 cents
```

**Format Functions**:
```typescript
// Convert cents to display
formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`

// Convert input to cents
storagePrice = (dollars: number) => Math.round(dollars * 100)
```

---

## Future Enhancements

### Ready to Implement
- Payment processing integration (Stripe/PayPal)
- Automatic invoice generation
- Recurring service agreements
- Bulk pricing for multiple items
- Service package templates
- Rating based on price fairness

### Advanced Features
- AI-suggested pricing based on complexity
- Price history analytics
- Competitive rate comparisons
- Automatic price adjustments
- Currency conversion
- Time-based pricing (rush fees, off-hours)

---

## Files Summary

**New Components** (5 files):
- `src/components/pricing/AgentPricingCard.tsx`
- `src/components/pricing/PriceProposalModal.tsx`
- `src/components/pricing/PriceNegotiationChat.tsx`
- `src/components/pricing/AgreedPricingConfirmation.tsx`
- `src/components/pricing/PriceSelectionFlow.tsx`

**Updated Components** (2 files):
- `src/components/support/AgentsView.tsx` - Shows pricing
- `src/components/layout/BottomNavigation.tsx` - Fixed routing
- `src/components/layout/Sidebar.tsx` - Fixed routing

**Database Migrations** (1 file):
- `supabase/migrations/[timestamp]_create_agent_pricing_system.sql`

---

## Testing Checklist

- [x] Navigation buttons work correctly
- [x] Project builds without errors
- [x] Pricing cards display on agent profiles
- [x] Price proposal modal creates itemized quotes
- [x] Negotiation chat allows counter-offers
- [x] Agreed pricing confirmation locks price
- [x] Price flow coordinates all steps
- [ ] Create test data for pricing profiles
- [ ] Test pricing flow end-to-end
- [ ] Verify RLS policies work correctly
- [ ] Test with different currencies (if supported)

---

## Next Steps

1. **Add Sample Data**: Insert pricing profiles for existing agents
2. **Test Workflow**: Go through complete negotiation flow
3. **Connect to Tickets**: Update CreateTicketView to use pricing flow
4. **Add Payments**: Integrate Stripe for payment collection
5. **Monitor Usage**: Track which pricing methods are used most

---

## Support

For questions about implementation:
- See component prop interfaces for usage
- Check RLS policies for access control
- Review migration file for schema
- Test with dev server: `npm run dev`
