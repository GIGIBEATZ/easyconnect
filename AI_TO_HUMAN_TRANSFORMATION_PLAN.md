# AI to Human Transformation Plan

## Executive Summary

**Objective**: Transform the platform from AI/agent-based terminology to human professional/technician-focused branding, removing all AI system components and replacing agent references with real human professionals.

**Scope**: 13+ TypeScript files, 5 SQL migrations, 8 database tables, 30+ UI text instances, 3 major components

**Timeline Estimate**: 4-6 hours for complete transformation

**Risk Level**: Medium (requires careful database migrations with data preservation)

---

## 🎯 Terminology Decision

### Primary Replacement Strategy

**Agent → Technician** (Primary choice for support context)

**Rationale**:
- Clear, human-focused terminology
- Industry-standard for technical support
- Non-corporate, approachable
- Translates well internationally
- No AI connotations

**Alternative Considered**: "Professional" (more generic, less specific)

---

## 📋 Transformation Phases

### **PHASE 1: Remove AI System (1 hour)**
Priority: CRITICAL
Impact: Database cleanup, removes unused AI features

### **PHASE 2: Database Schema Migration (1.5 hours)**
Priority: CRITICAL
Impact: Renames all agent tables/columns to technician

### **PHASE 3: TypeScript Types Update (0.5 hours)**
Priority: HIGH
Impact: Update database types, interfaces, props

### **PHASE 4: Component Refactoring (1.5 hours)**
Priority: HIGH
Impact: Rename components, update all UI text

### **PHASE 5: Icon Replacement (0.5 hours)**
Priority: MEDIUM
Impact: Replace bot/AI icons with human icons

### **PHASE 6: Testing & Verification (1 hour)**
Priority: CRITICAL
Impact: Ensure all features work, no broken references

---

## 📦 PHASE 1: Remove AI System Tables

### Files to Handle

**Migration to Create**:
`supabase/migrations/[timestamp]_remove_ai_system_tables.sql`

### Actions

```sql
-- Drop AI system tables (created in 20251204214748_create_ai_system_tables.sql)
DROP TABLE IF EXISTS ai_generations CASCADE;
DROP TABLE IF EXISTS ai_usage_tracking CASCADE;
DROP TABLE IF EXISTS product_suggestions_cache CASCADE;

-- Drop AI-related functions
DROP FUNCTION IF EXISTS initialize_ai_usage_tracking() CASCADE;
DROP FUNCTION IF EXISTS track_ai_generation() CASCADE;
```

### Verification Checks
- [ ] Confirm no application code references these tables
- [ ] Verify no foreign key dependencies
- [ ] Check for orphaned data requiring cleanup

---

## 📦 PHASE 2: Database Schema Transformation

### Migration File to Create

`supabase/migrations/[timestamp]_transform_agent_to_technician.sql`

### 2.1 Table Renames

```sql
-- Rename agent tables to technician tables
ALTER TABLE agent_pricing_profiles RENAME TO technician_pricing_profiles;
ALTER TABLE agent_availability RENAME TO technician_availability;
ALTER TABLE agent_activity RENAME TO technician_activity;
```

### 2.2 Column Renames

```sql
-- profiles table
ALTER TABLE profiles
  RENAME COLUMN agent_specializations TO technician_specializations;

ALTER TABLE profiles
  RENAME COLUMN agent_rating TO technician_rating;

-- support_tickets table
ALTER TABLE support_tickets
  RENAME COLUMN assigned_agent_id TO assigned_technician_id;

-- technician_pricing_profiles table (formerly agent_pricing_profiles)
ALTER TABLE technician_pricing_profiles
  RENAME COLUMN agent_id TO technician_id;

-- price_proposals table
ALTER TABLE price_proposals
  RENAME COLUMN agent_id TO technician_id;

-- agreed_pricing table
ALTER TABLE agreed_pricing
  RENAME COLUMN agent_id TO technician_id;

-- price_negotiation_history table
ALTER TABLE price_negotiation_history
  RENAME COLUMN agent_id TO technician_id;

-- technician_availability table
ALTER TABLE technician_availability
  RENAME COLUMN agent_id TO technician_id;

-- technician_activity table
ALTER TABLE technician_activity
  RENAME COLUMN agent_id TO technician_id;

-- room_participants table
ALTER TABLE room_participants
  RENAME COLUMN is_agent TO is_technician;
```

### 2.3 Index Renames

```sql
-- Rename indexes to reflect new terminology
ALTER INDEX idx_support_tickets_agent RENAME TO idx_support_tickets_technician;
ALTER INDEX idx_agent_pricing_profiles_agent_id RENAME TO idx_technician_pricing_profiles_technician_id;
-- Add more index renames as discovered
```

### 2.4 Role Value Updates

```sql
-- Update role values in profiles table
UPDATE profiles
SET roles = array_replace(roles, 'support_agent', 'technician')
WHERE 'support_agent' = ANY(roles);

-- Update is_agent column to is_technician in profiles
-- (if column exists - check schema first)
```

### 2.5 RLS Policy Recreation

```sql
-- Drop old agent policies
DROP POLICY IF EXISTS "Agents can read own pricing profile" ON technician_pricing_profiles;
DROP POLICY IF EXISTS "Agents can update own pricing profile" ON technician_pricing_profiles;
-- ... drop all agent-related policies

-- Create new technician policies
CREATE POLICY "Technicians can read own pricing profile"
  ON technician_pricing_profiles FOR SELECT
  TO authenticated
  USING (technician_id = auth.uid() AND 'technician' = ANY((SELECT roles FROM profiles WHERE id = auth.uid())));

CREATE POLICY "Technicians can update own pricing profile"
  ON technician_pricing_profiles FOR UPDATE
  TO authenticated
  USING (technician_id = auth.uid() AND 'technician' = ANY((SELECT roles FROM profiles WHERE id = auth.uid())))
  WITH CHECK (technician_id = auth.uid() AND 'technician' = ANY((SELECT roles FROM profiles WHERE id = auth.uid())));

-- Recreate ALL policies with technician terminology
-- (This is extensive - approximately 20-30 policies)
```

### 2.6 Foreign Key Constraint Updates

```sql
-- Drop and recreate foreign keys with new column names
-- Example:
ALTER TABLE technician_pricing_profiles
  DROP CONSTRAINT IF EXISTS agent_pricing_profiles_agent_id_fkey;

ALTER TABLE technician_pricing_profiles
  ADD CONSTRAINT technician_pricing_profiles_technician_id_fkey
  FOREIGN KEY (technician_id)
  REFERENCES profiles(id) ON DELETE CASCADE;

-- Repeat for all affected tables
```

### Migration Testing Strategy

1. **Backup**: Create backup before migration
2. **Dry Run**: Test on development database first
3. **Data Verification**: Count rows before/after, verify data integrity
4. **Rollback Plan**: Prepare reverse migration if needed

---

## 📦 PHASE 3: TypeScript Types Update

### 3.1 Database Types File

**File**: `src/lib/database.types.ts`

**Changes Required**:

```typescript
// OLD
export interface Profile {
  agent_specializations: string[] | null;
  agent_rating: number | null;
  // ...
}

// NEW
export interface Profile {
  technician_specializations: string[] | null;
  technician_rating: number | null;
  // ...
}

// OLD table names
export interface Database {
  public: {
    Tables: {
      agent_pricing_profiles: { ... }
      agent_availability: { ... }
      agent_activity: { ... }
    }
  }
}

// NEW table names
export interface Database {
  public: {
    Tables: {
      technician_pricing_profiles: { ... }
      technician_availability: { ... }
      technician_activity: { ... }
    }
  }
}

// Update all column references:
// agent_id → technician_id (in all table definitions)
// assigned_agent_id → assigned_technician_id
```

**Action**: Regenerate types from Supabase schema after migration
```bash
npx supabase gen types typescript --local > src/lib/database.types.ts
```

### 3.2 Component Interfaces

Update interfaces in affected components:

**AgentsView.tsx** → **TechniciansView.tsx**
```typescript
// OLD
interface AgentsViewProps {
  onAgentSelect: (agent: Profile) => void;
  onContactAgent: (agent: Profile) => void;
}

// NEW
interface TechniciansViewProps {
  onTechnicianSelect: (technician: Profile) => void;
  onContactTechnician: (technician: Profile) => void;
}
```

---

## 📦 PHASE 4: Component Refactoring

### 4.1 Component File Renames

| Old Name | New Name |
|----------|----------|
| `AgentsView.tsx` | `TechniciansView.tsx` |
| `AgentPricingCard.tsx` | `TechnicianPricingCard.tsx` |
| `AgentAvailability.tsx` | `TechnicianAvailability.tsx` |

### 4.2 Component Code Updates

#### **TechniciansView.tsx** (formerly AgentsView.tsx)

**Text Replacements**:
```typescript
// Line 102
"Find a Support Agent" → "Find a Support Technician"

// Line 105
"Connect with expert technicians ready to help you" → Keep as is ✓

// Line 153
"Showing {filteredAgents.length} agent(s)" → "Showing {filteredTechnicians.length} technician(s)"

// Line 160
"No agents match your search criteria" → "No technicians match your search criteria"

// Line 244
"Assigned to agent" → "Assigned to technician"
```

**Variable Renames**:
```typescript
// Throughout file
agents → technicians
filteredAgents → filteredTechnicians
onAgentSelect → onTechnicianSelect
onContactAgent → onContactTechnician
selectedAgent → selectedTechnician
```

**Query Updates**:
```typescript
// OLD
.from('profiles')
.select('*')
.contains('roles', ['support_agent'])

// NEW
.from('profiles')
.select('*')
.contains('roles', ['technician'])
```

#### **TechnicianPricingCard.tsx** (formerly AgentPricingCard.tsx)

```typescript
// OLD
interface AgentPricingCardProps {
  agent: Profile;
  onViewProfile: (agent: Profile) => void;
}

// NEW
interface TechnicianPricingCardProps {
  technician: Profile;
  onViewProfile: (technician: Profile) => void;
}

// Function name
export function AgentPricingCard({ agent, ... }) { }
// TO
export function TechnicianPricingCard({ technician, ... }) { }

// All internal references
agent.full_name → technician.full_name
agent.bio → technician.bio
// etc.
```

#### **TechnicianAvailability.tsx** (formerly AgentAvailability.tsx)

```typescript
// Update profile checks
profile?.is_agent → profile?.is_technician

// Table queries
.from('agent_availability') → .from('technician_availability')
.from('agent_activity') → .from('technician_activity')

// Column references
agent_id → technician_id
```

#### **PriceNegotiationChat.tsx**

```typescript
// Type updates
from: 'agent' | 'client' → from: 'technician' | 'client'

// Props
agentName → technicianName
isAgent → isTechnician

// Logic
from === 'agent' → from === 'technician'
```

#### **PriceSelectionFlow.tsx**

```typescript
// Props
agent: Profile → technician: Profile

// Variables
agentName → technicianName

// References
agent.full_name → technician.full_name
```

#### **CreateTicketView.tsx**

```typescript
// Line 101
"A support agent will be assigned shortly"
→ "A support technician will be assigned shortly"

// Line 254
"You can chat with your assigned agent directly through the ticket"
→ "You can chat with your assigned technician directly through the ticket"
```

#### **TicketsView.tsx**

```typescript
// Variable
const isAgent → const isTechnician

// Query logic
.contains('roles', ['support_agent'])
→ .contains('roles', ['technician'])

// UI Text
"Assigned to agent" → "Assigned to technician"
"Available to claim" → Keep as is ✓
```

#### **SignUpForm.tsx**

```typescript
// Line 15
'support_agent' → 'technician'

// Line 266
"Support Agent / Technician" → "Support Technician"
```

#### **App.tsx**

```typescript
// State
const [selectedAgent, setSelectedAgent] → const [selectedTechnician, setSelectedTechnician]

// Props
onAgentSelect → onTechnicianSelect
onContactAgent → onContactTechnician

// UI Text (Line 256)
"Contact This Agent" → "Contact This Technician"

// View references
'agents' → 'technicians' (if used as view identifier)
```

#### **Footer.tsx**

```typescript
// Line 38
"For Agents" → "For Technicians"

// Line 40
"Agent Portal" → "Technician Portal"

// Line 41
"Become an Agent" → "Become a Technician"
```

#### **Sidebar.tsx**

```typescript
// Line 64
"Find Agents" → "Find Technicians"
```

### 4.3 Import Statement Updates

After renaming components, update all imports:

```typescript
// OLD
import { AgentsView } from './components/support/AgentsView';
import { AgentPricingCard } from './components/pricing/AgentPricingCard';
import { AgentAvailability } from './components/chat/AgentAvailability';

// NEW
import { TechniciansView } from './components/support/TechniciansView';
import { TechnicianPricingCard } from './components/pricing/TechnicianPricingCard';
import { TechnicianAvailability } from './components/chat/TechnicianAvailability';
```

**Files to Update Imports**:
- `src/App.tsx`
- Any other files importing these components

---

## 📦 PHASE 5: Icon Replacement Strategy

### 5.1 Current Icon Audit

**Icons to Replace**:

| Current Icon | Usage | Replacement Icon | Location |
|--------------|-------|------------------|----------|
| `Bot` | AI/Agent references | `User` / `Users` | Check all components |
| `Cpu` | AI processing | `Wrench` / `Tool` | Technical work |
| `Zap` (if AI) | Automation | `CheckCircle` | Manual verification |

### 5.2 New Icon Mapping

**Human-Focused Icons** (from lucide-react):

```typescript
import {
  User,           // Individual technician
  Users,          // Technician team
  UserCheck,      // Verified technician
  UserCog,        // Technician settings
  Wrench,         // Technical work
  Tool,           // Tools/services
  HardHat,        // Construction/tech work (if available)
  HeadPhones,     // Support
  MessageSquare,  // Chat with technician
  Star,           // Rating
  Award,          // Certification
  BadgeCheck      // Verified professional
} from 'lucide-react';
```

### 5.3 Icon Replacement Locations

**TechniciansView.tsx**:
```typescript
// If using Bot icon, replace with:
<Users className="w-6 h-6" /> // For "Find Technicians"
<User className="w-5 h-5" />   // For individual profile
```

**TechnicianPricingCard.tsx**:
```typescript
<UserCheck className="w-5 h-5" /> // Verified technician indicator
<Star className="w-4 h-4" />       // Rating display
```

**SignUpForm.tsx**:
```typescript
// For technician account type
<Wrench className="w-6 h-6" />     // Technical expertise
```

**Sidebar.tsx**:
```typescript
// Navigation item for technicians
<Users className="w-5 h-5" />      // Find Technicians
```

**Footer.tsx**:
```typescript
// Technician portal links
<UserCog className="w-5 h-5" />    // Technician settings
```

---

## 📦 PHASE 6: Translation Updates

### Translation Keys to Update

**File**: Check translation system for these keys

```typescript
// OLD keys
"agent.find" → "technician.find"
"agent.contact" → "technician.contact"
"agent.assigned" → "technician.assigned"
"agent.portal" → "technician.portal"
"agent.become" → "technician.become"

// Update all translation strings
"Support Agent" → "Support Technician"
"Find Agents" → "Find Technicians"
etc.
```

**Action**:
1. Search for translation keys with "agent"
2. Update all language files
3. Update translation key constants

---

## 🧪 Testing Checklist

### Unit Testing
- [ ] All renamed components render without errors
- [ ] Props are correctly typed and passed
- [ ] Database queries use correct table names
- [ ] Database queries use correct column names

### Integration Testing
- [ ] User can browse technicians list
- [ ] User can view technician profile
- [ ] User can contact technician
- [ ] Ticket assignment to technician works
- [ ] Pricing negotiation flow works
- [ ] Chat with technician works
- [ ] Technician availability displays correctly

### Database Testing
- [ ] All foreign keys intact after column renames
- [ ] RLS policies work correctly
- [ ] Indexes are functioning
- [ ] Data integrity maintained (no lost records)
- [ ] Query performance unchanged

### UI Testing
- [ ] All text displays correctly
- [ ] No broken translations
- [ ] Icons display appropriately
- [ ] Mobile responsive layout works
- [ ] Dark mode compatible

### Regression Testing
- [ ] Authentication still works
- [ ] Authorization (roles) still works
- [ ] Navigation flows work
- [ ] Forms submit correctly
- [ ] Search and filters work

---

## 🚀 Execution Order

### Step-by-Step Implementation

1. **Create Git Branch**
   ```bash
   git checkout -b feature/transform-agent-to-technician
   ```

2. **Phase 1: Remove AI System** (30 min)
   - Create migration to drop AI tables
   - Apply migration
   - Verify no references in code

3. **Phase 2: Database Migration** (1.5 hours)
   - Create comprehensive transformation migration
   - Test on local database
   - Apply migration
   - Regenerate TypeScript types

4. **Phase 3: Update TypeScript Types** (30 min)
   - Run type generation command
   - Manually verify and adjust types
   - Fix any type errors

5. **Phase 4: Rename Components** (1.5 hours)
   - Rename files
   - Update component code
   - Update imports throughout app
   - Update UI text
   - Update variable names

6. **Phase 5: Update Icons** (30 min)
   - Replace Bot/AI icons with human icons
   - Test visual appearance

7. **Phase 6: Update Translations** (15 min)
   - Update translation keys
   - Update all language strings

8. **Testing** (1 hour)
   - Run build
   - Manual testing of all flows
   - Fix any bugs discovered

9. **Commit and Deploy**
   ```bash
   git add .
   git commit -m "Transform agent terminology to technician throughout platform"
   npm run build
   ```

---

## 📊 Impact Assessment

### User-Facing Changes
- **High**: All "agent" text changes to "technician"
- **Medium**: Icons become more human-focused
- **Low**: Backend changes transparent to users

### Developer Impact
- **High**: All database queries need testing
- **High**: Component imports need updating
- **Medium**: Future code must use new terminology

### Database Impact
- **High**: Schema changes affect all agent-related queries
- **Medium**: RLS policies need comprehensive update
- **Low**: Data preserved, no data loss expected

---

## ⚠️ Risks & Mitigation

### Risk 1: Database Migration Failure
**Mitigation**:
- Backup database before migration
- Test on local/staging first
- Have rollback migration ready

### Risk 2: Broken Foreign Key Relationships
**Mitigation**:
- Carefully map all FK dependencies
- Use CASCADE where appropriate
- Test all relationships post-migration

### Risk 3: Missed References in Code
**Mitigation**:
- Use IDE global search for "agent", "Agent", "AGENT"
- TypeScript will catch type mismatches
- Comprehensive testing suite

### Risk 4: RLS Policy Gaps
**Mitigation**:
- Recreate policies methodically
- Test with different user roles
- Verify security isn't compromised

---

## ✅ Success Criteria

- [ ] Zero TypeScript compilation errors
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No database query errors
- [ ] All UI text updated
- [ ] All icons replaced
- [ ] Full application navigation works
- [ ] Technician signup works
- [ ] Ticket assignment works
- [ ] Pricing negotiation works
- [ ] Chat system works
- [ ] No console errors

---

## 📝 Post-Implementation

### Documentation Updates Needed
1. Update README with new terminology
2. Update any API documentation
3. Update development guides
4. Update onboarding materials

### Communication
1. Notify stakeholders of terminology change
2. Update marketing materials
3. Update external documentation
4. Update help center articles

---

## 💰 Estimated Time Investment

| Phase | Time | Complexity |
|-------|------|------------|
| Phase 1: Remove AI | 0.5 hours | Low |
| Phase 2: Database | 1.5 hours | High |
| Phase 3: Types | 0.5 hours | Medium |
| Phase 4: Components | 1.5 hours | Medium |
| Phase 5: Icons | 0.5 hours | Low |
| Phase 6: Testing | 1 hour | High |
| **TOTAL** | **5-6 hours** | **Medium-High** |

---

## 🎯 Final Notes

This transformation represents a significant branding shift from AI/automation-focused to human/professional-focused platform. The changes are extensive but well-structured, with clear benefits:

**Benefits**:
- More trustworthy, human-centered branding
- Clearer terminology for users
- Better reflects actual service model
- Removes unused AI system overhead
- More professional positioning

**Recommendation**: Execute this transformation in a single focused session to maintain consistency and momentum. The systematic approach outlined here minimizes risk while ensuring comprehensive coverage.

---

**Document Version**: 1.0
**Created**: 2026-02-05
**Status**: Ready for Implementation
