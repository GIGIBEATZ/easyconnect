# Mobile UI Comprehensive Plan

## Current State Analysis

### Available Features:
1. Home
2. Learning Hub (with Topics, Modules, Lessons, Quizzes, Progress)
3. Services (Browse, Service Details)
4. Agents (Find Agents, Agent Profile)
5. Tickets (My Tickets, Ticket Details, Create Ticket)
6. Messages/Chat (Rooms List, Chat Room)
7. Dashboard (Role-based cards)
8. Knowledge Base (Articles with search)
9. Settings
10. Profile
11. Static Pages (About, Terms, Privacy, FAQ, Contact)
12. Global Search (across all entities)

### Current Mobile UI:
- **Header**: Hamburger menu, (missing search button)
- **Bottom Nav**: Home, Learn, Services, Agents, More
- **Sidebar**: Limited menu when opened

### Missing from Mobile:
- Search access on mobile
- Quick access to Dashboard
- Quick access to Tickets
- Quick access to Knowledge Base
- Quick access to Create Ticket
- Chat/Messages easily accessible

## Implementation Strategy

### 1. SimplifiedHeader Enhancement
**Goal**: Add mobile search button that opens GlobalSearch

```typescript
// Add search icon button for mobile
<button onClick={onSearchOpen} className="md:hidden">
  <Search />
</button>
```

### 2. Sidebar Enhancement
**Goal**: Add all missing features to sidebar menu

Add these items:
- Dashboard (for authenticated users)
- Knowledge Base (public)
- Create Ticket (quick action)
- Dividers for better organization

### 3. Bottom Navigation Enhancement
**Goal**: Make 5 tabs more strategic

Current: Home, Learn, Services, Agents, More
Proposed: Home, Tickets, Search, Learn, More

Rationale:
- Tickets = Core feature for support platform
- Search = Quick access to find anything
- Learn = Engaging feature
- More = Access full menu

### 4. Floating Action Button (FAB)
**Goal**: Quick access to "Create Ticket"

- Shows on authenticated pages
- Positioned bottom-right (above bottom nav)
- Hides when scrolling down, shows when scrolling up
- Primary action button

### 5. Mobile Menu Organization (Sidebar)
**Goal**: Better categorization

```
Personal (authenticated)
- Dashboard
- My Profile
- My Tickets
- Messages
- Settings

Discover
- Browse Services
- Find Agents
- Knowledge Base
- Learning Hub

Help
- Create Ticket
- Contact Us
- FAQ
```

## Implementation Files

### Files to Modify:
1. `SimplifiedHeader.tsx` - Add search button, integrate GlobalSearch
2. `Sidebar.tsx` - Add Dashboard, KB, reorganize menu
3. `BottomNavigation.tsx` - Update tabs to include Tickets and Search
4. `App.tsx` - Ensure GlobalSearch is integrated

### Files to Create:
1. `FloatingActionButton.tsx` - Create Ticket FAB
2. (Optional) `MobileMenu.tsx` - If we want a dedicated More page

## User Flow Examples

### Scenario 1: User wants to create a ticket
**Options**:
1. Tap FAB button (quickest)
2. Go to Bottom Nav > More > Create Ticket
3. Go to Bottom Nav > Tickets > "+" button

### Scenario 2: User wants to search
**Options**:
1. Tap Search icon in header (opens GlobalSearch)
2. Go to Bottom Nav > Search tab (opens GlobalSearch)
3. Use Cmd/Ctrl + K on device with keyboard

### Scenario 3: User wants to access Dashboard
**Options**:
1. Open sidebar (hamburger) > Dashboard
2. Tap profile icon > Dashboard option

## Success Criteria

✅ Every desktop feature accessible on mobile
✅ No more than 2 taps to reach any feature
✅ Search prominently featured
✅ Bottom nav shows most important features
✅ FAB for primary action (Create Ticket)
✅ Sidebar well-organized with categories
✅ Mobile UI hides/shows based on user scroll
✅ Responsive on all screen sizes (320px+)

## Testing Checklist

- [ ] All sidebar items navigate correctly
- [ ] Bottom nav highlights active tab
- [ ] Search opens GlobalSearch modal
- [ ] FAB creates ticket
- [ ] Profile menu works on mobile
- [ ] Notifications work on mobile
- [ ] Language selector works on mobile
- [ ] Theme toggle works on mobile
- [ ] Chat height correct with bottom nav
- [ ] All dropdowns fit on screen
- [ ] No horizontal scroll
- [ ] Safe areas respected (notch devices)
