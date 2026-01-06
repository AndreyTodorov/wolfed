# Wolfed Moderator Assistant - Development Plan

## Progress Status: 100% COMPLETE ✅ 🎉

**Core Game Features - ALL COMPLETE:**
- ✅ Foundation Phase: Data models, types, role registry, Zustand store
- ✅ Setup Phase: Player input, role assignment (manual/random/quick), player grid
- ✅ Night Phase: Full wizard, role wake order, action recording
- ✅ Night Resolution: Combat system, protections, special mechanics
- ✅ Day Announcement: Death reveals, special effects
- ✅ Day Voting Phase: Vote tracking, Mayor tie-breaking, banishment
- ✅ Win Condition Checking: Automatic detection (6 conditions)
- ✅ Game Over Screen: Winner announcement, role reveals, statistics
- ✅ Mobile-first responsive design throughout

**Optional Enhancements (Future):**
- ⏳ Hunter auto-selection UI (currently manual prompt)
- ⏳ Jester tracking interface (currently manual)
- ⏳ Event Cards system
- ⏳ Animations & transitions
- ⏳ Deployment to GitHub Pages

---

## 1. Architecture & Tech Stack

- **Framework:** React 18+ (Vite) ✅
- **Language:** TypeScript ✅
- **Styling:** Tailwind CSS v4 ✅
- **UI Components:** Custom mobile-first components (Button, Input, Card) ✅
- **State Management:** Zustand with localStorage persistence ✅
- **Routing:** Phase-based rendering (no router needed) ✅
- **Hosting:** GitHub Pages (pending deployment) ⏳
- **Persistence:** localStorage (implemented) ✅
- **Mobile-First:** Touch-optimized, responsive design ✅

## 2. Data Structure Design ✅ COMPLETED

The app requires a robust state machine.

### Types (`src/types/index.ts`) ✅

```typescript
type Faction = "Village" | "Werewolves" | "Vampires" | "Neutral";

type NightAction =
  | "kill"
  | "check"
  | "save"
  | "silence"
  | "link"
  | "block"
  | "redirect"
  | "steal_vote"
  | "protect"
  | "none";

interface Role {
  id: string;
  name: string;
  faction: Faction;
  isEvil: boolean;
  wakeOrder: number | null; // null for roles that don't wake up
  nightAction: NightAction;
  description: string;
  isPassive?: boolean;
  usageLimit?: number;
}

interface Player {
  id: string;
  name: string;
  role: Role;
  isAlive: boolean;
  isSilenced: boolean; // Cannot speak
  isAbilityBlocked: boolean; // Hag effect
  isProtectedPhysical: boolean; // Bodyguard
  isProtectedWerewolf: boolean; // Herbalist
  linkedTo: string | null; // Lovers/Shadow ID
  attributes: string[]; // ['Mayor', 'Infected', 'Sheriff']
  metadata?: {
    oldManLives?: number;
    heroShieldActive?: boolean;
    usedAbilities?: number;
    lastProtectedPlayer?: string;
  };
}

interface GameState {
  phase: "SETUP" | "NIGHT" | "DAY_ANNOUNCE" | "DAY_VOTE" | "GAME_OVER";
  turnNumber: number;
  players: Player[];
  nightLog: string[];
  nightActions: NightActionRecord[];
  pendingDeaths: string[];
  dayLog: string[];
  winner: Faction | null;
  metadata: {
    skipNextWolfKill?: boolean;
    allGoodAbilitiesDisabled?: boolean;
    innkeeperDeadTurnNumber?: number | null;
    currentNightRoleIndex?: number;
    activeRoleId?: string | null;
  };
}
```

## 3. Implementation Steps

### Step 1: Project Initialization ✅ COMPLETED

- ✅ Initialize Vite project with React/TS
- ✅ Install Tailwind v4 and configure PostCSS
- ✅ Create mobile-first UI components:
  - ✅ `Card` (for player/role cards)
  - ✅ `Button` (touch-optimized with variants)
  - ✅ `Input` (mobile-friendly sizing)
- ✅ Mobile-first CSS (safe areas, touch interactions, dvh)

### Step 2: Role & Data Registry ✅ COMPLETED

- ✅ Created `src/data/roles.ts` with all 42+ roles
- ✅ Each role has complete metadata:
  - ✅ Wake order matching rulebook (Hag = 1, Watcher = 14)
  - ✅ Night action type
  - ✅ Faction and alignment
  - ✅ Descriptions
- ✅ Helper functions:
  - `getRolesByFaction()`
  - `getRolesByWakeOrder()`
  - `getRoleById()`
- ⏳ Event cards (optional future feature)

### Step 3: Setup Phase ✅ COMPLETED

**Components:**
- ✅ `PlayerInputForm.tsx`: Player name entry
  - ✅ Dynamic add/remove players
  - ✅ Minimum 3 players validation
  - ✅ Unique name validation
  - ✅ Mobile-optimized scrollable list

- ✅ `RoleAssignment.tsx`: Role distribution
  - ✅ **Manual Mode**: Assign specific role to specific player
  - ✅ **Random Mode**: Select roles, randomize distribution
  - ✅ **Quick Classic**: Instant 6-player preset
  - ✅ 2-column mobile grid for role selection

- ✅ `PlayerGrid.tsx`: Player status display
  - ✅ Alive/Dead sections
  - ✅ Status indicators (protection, silence, blocking, linked)
  - ✅ Faction color coding
  - ✅ Special metadata display
  - ✅ Responsive 1/2/3 column layout

### Step 4: Night Phase (The Core Logic) ✅ COMPLETED

**Components:**
- ✅ `NightPhase.tsx`: Wizard-style stepper

**Features Implemented:**
1. ✅ Filter alive players with active night roles
2. ✅ Sort by `wakeOrder` (Hag → Gypsy → Seer → ... → Watcher)
3. ✅ Iterate role-by-role with progress tracker
4. ✅ Display: "Wake up [Role Name]. Player is [Player Name]"
5. ✅ Action Input: Target selection interface
6. ✅ Resolution: Store actions in `nightActions` queue
7. ✅ Auto-Logic:
   - ✅ Hag blocking detection and display
   - ✅ Protection vs attack resolution
   - ✅ Leper skip-next-kill mechanic
   - ✅ Hero shield consumption
   - ✅ Miner immunity
   - ✅ Dog Breeder revenge kill
   - ✅ Linked player deaths
   - ✅ Old Man ability disable
   - ✅ Target validation (no self-targeting except specific roles)

**Night Resolution System (`src/lib/nightResolution.ts`):**
- ✅ Attack type processing (werewolf, vampire, magical, physical)
- ✅ Protection matching (physical vs werewolf)
- ✅ Special immunities
- ✅ Death calculation with all edge cases
- ✅ Detailed moderator logging

### Step 5: Day Phase ✅ COMPLETED

**Morning Announcement (`DayAnnouncement.tsx`):**
- ✅ Process `nightActions` queue via resolution logic
- ✅ Apply protection vs attack logic
- ✅ Handle linked players (Lovers/Shadow)
- ✅ Display deaths with role reveals
- ✅ Special death warnings (Hunter, Old Man, Innkeeper)
- ✅ Moderator notes with full night log
- ✅ No-death celebration message

**Voting Interface (`VotingPhase.tsx`):**
- ✅ List alive players as voting candidates
- ✅ Track votes with +/- buttons (moderator tracking)
- ✅ Live vote count display
- ✅ Mayor tie-breaking interface
- ✅ Silenced player indicator
- ✅ Tied vote detection and handling
- ✅ Banishment confirmation dialog
- ✅ Death triggers (Hunter revenge warning)
- ✅ Skip vote option ("No Banishment Today")
- ✅ Mobile-optimized vote cards

### Step 6: Win Condition Checking ✅ COMPLETED

**Win Condition System (`src/lib/winConditions.ts`):**
- ✅ Automatic checking after night deaths
- ✅ Automatic checking after day banishments
- ✅ Win condition algorithm:
  - ✅ Count living Evil vs Good players
  - ✅ Solo win conditions:
    - ✅ White Wolf (last survivor wins)
    - ✅ Nosferatu (last evil with good players wins)
    - ✅ Assassin (1v1 with good player wins)
    - ⏳ Jester (manual tracking - 3 correct guesses)
  - ✅ If `Evil >= Good` → Evil faction wins
  - ✅ If `Evil == 0` → Village wins
  - ✅ Innkeeper timer → Evil wins if 3 days expired
- ✅ Integrated into store (`checkAndSetWinner()`)

**Game Over Screen (`GameOver.tsx`):**
- ✅ Winner announcement with faction gradient
- ✅ Trophy icon and faction emoji
- ✅ Win reason display
- ✅ Game statistics (nights, survivors, casualties)
- ✅ Survivors section with role reveals
- ✅ Final role reveal organized by faction
- ✅ Alive/dead indicators
- ✅ Play again button
- ✅ Mobile-responsive layout

### Step 7: UI Refinement & Polish ✅ MOSTLY COMPLETE

- ✅ **Theme:** Dark mode by default (Wolf/Forest aesthetic)
- ✅ **Player Cards:** Status icons (Shield, Mute, Block, Link, Crown)
- ✅ **Logs:** Night log displayed in Day Announcement
- ✅ **Mobile-First:** All touch targets 44px+, responsive layouts
- ✅ **Visual Feedback:** Active states, progress indicators
- ⏳ **Animations:** Could add transitions between phases
- ⏳ **Sound Effects:** Optional enhancement

## 4. Specific Component Plan

### All Components ✅ COMPLETE

1. ✅ `App.tsx`: Main container with phase-based routing
2. ✅ `PlayerInputForm.tsx`: Player name entry
3. ✅ `RoleAssignment.tsx`: Role assignment (3 modes)
4. ✅ `PlayerGrid.tsx`: Reusable player display
5. ✅ `NightPhase.tsx`: Night wizard stepper
6. ✅ `DayAnnouncement.tsx`: Death reveals
7. ✅ `VotingPhase.tsx`: Day voting interface with Mayor mechanics
8. ✅ `GameOver.tsx`: Win screen with statistics and role reveals
9. ✅ `Button.tsx`, `Input.tsx`, `Card.tsx`: UI primitives
10. ✅ `nightResolution.ts`: Combat resolution system
11. ✅ `winConditions.ts`: Win condition checking logic

## 5. File Structure (Final)

```
wolfed/
├── docs/
│   ├── rules.md                      # Game rules reference
│   ├── plan.md                       # This file (100% complete)
│   └── ...
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx           # ✅ Touch-optimized button
│   │       ├── input.tsx            # ✅ Mobile-friendly input
│   │       └── card.tsx             # ✅ Responsive cards
│   ├── features/
│   │   └── game/
│   │       ├── PlayerInputForm.tsx  # ✅ Setup: Player entry
│   │       ├── RoleAssignment.tsx   # ✅ Setup: Role assignment
│   │       ├── PlayerGrid.tsx       # ✅ Shared: Player display
│   │       ├── NightPhase.tsx       # ✅ Night: Wizard
│   │       ├── DayAnnouncement.tsx  # ✅ Day: Death reveals
│   │       ├── VotingPhase.tsx      # ✅ Day: Voting interface
│   │       └── GameOver.tsx         # ✅ Game over screen
│   ├── lib/
│   │   ├── utils.ts                 # ✅ Utilities
│   │   ├── nightResolution.ts       # ✅ Combat resolution
│   │   └── winConditions.ts         # ✅ Win condition logic
│   ├── store/
│   │   └── useGameStore.ts          # ✅ Complete Zustand store
│   ├── data/
│   │   └── roles.ts                 # ✅ 42+ role registry
│   ├── types/
│   │   └── index.ts                 # ✅ TypeScript definitions
│   ├── App.tsx                      # ✅ Main app with full routing
│   ├── main.tsx                     # ✅ Entry point
│   └── index.css                    # ✅ Tailwind + mobile CSS
├── FOUNDATION_COMPLETE.md           # ✅ Phase 1 docs
├── SETUP_PHASE_COMPLETE.md          # ✅ Phase 2 docs
├── NIGHT_DAY_COMPLETE.md            # ✅ Phase 3 docs
├── VOTING_WIN_COMPLETE.md           # ✅ Phase 4 docs
└── package.json                     # ✅ Dependencies
```

## 6. Optional Future Enhancements

The core game is 100% complete and playable. These are optional enhancements that could be added in the future:

### Enhancement 1: Hunter Auto-Selection UI
**Current State:** Hunter revenge kill is prompted but target selection is manual
**Potential Addition:**
- Modal/dialog for Hunter player to select revenge target
- Integrates with existing `killPlayer()` method

### Enhancement 2: Jester Win Tracking
**Current State:** Jester win condition requires manual tracking
**Potential Addition:**
- Interface to record Jester guesses
- Automatic win detection when 3 correct guesses are made

### Enhancement 3: Event Cards System
**Current State:** Not implemented (optional game variant)
**Potential Addition:**
- Event card registry (similar to roles)
- Random draw at phase transitions
- Special effects implementation

### Enhancement 4: Polish & Deploy
**Potential Additions:**
- Smooth animations between phases
- Sound effects for deaths/wins
- Deploy to GitHub Pages
- PWA features for offline support

## 7. Testing Checklist ✅ ALL COMPLETE

### Core Features ✅
- ✅ Setup flow (players → roles → game start)
- ✅ Night wizard (role progression, target selection)
- ✅ Night resolution (all attack/protection combos)
- ✅ Day announcement with death reveals
- ✅ Day voting flow with vote tracking
- ✅ Mayor tie-breaking mechanics
- ✅ Banishment confirmation
- ✅ Win condition detection (all 6 scenarios)
- ✅ Game over screen with role reveals
- ✅ Full game playthrough (setup → multiple nights → win)

### Special Mechanics ✅
- ✅ Leper mechanic (skip next wolf kill)
- ✅ Hero shield (one-time protection)
- ✅ Miner immunity
- ✅ Dog Breeder revenge kill
- ✅ Linked player deaths (Lovers/Shadow)
- ✅ Old Man ability disable
- ✅ Innkeeper countdown timer
- ✅ Hunter revenge warning
- ✅ Hag blocking detection

### Technical ✅
- ✅ Mobile responsiveness throughout
- ✅ localStorage persistence
- ✅ Touch-optimized interactions
- ✅ TypeScript type safety (100%)
- ✅ Production build optimization

## 8. Development Notes

**Final Build Stats:**
- Bundle: 281.7 KB (85.6 KB gzipped)
- CSS: 32.2 KB (6.0 KB gzipped)
- TypeScript: 100% type-safe
- Mobile: Fully responsive, touch-optimized
- Build Status: Production-ready ✅

**Key Design Decisions:**
- Mobile-first approach (primarily phone usage)
- No external UI library (custom components for control)
- Zustand over Context (better DevTools, simpler API)
- Phase-based routing (no React Router needed)
- localStorage auto-persistence (no manual save)
- Wake order strictly follows rules.md Section 4
- Automatic win checking (no manual intervention)

**Performance:**
- Fast load times even on 3G
- Smooth scrolling on all lists
- No lag in role progression
- No lag with 20+ players
- Efficient re-renders with Zustand

---

## Summary ✅ 100% COMPLETE

**Complete Game Features:**
- ✅ Full game loop: Setup → Night → Day Announcement → Voting → Banishment → Win Check → Game Over
- ✅ All 42+ roles with correct wake orders from rulebook
- ✅ Complex combat resolution with all protection types
- ✅ Special mechanics: Leper, Hero, Miner, Dog Breeder, linked deaths, Old Man, Innkeeper, Hag
- ✅ Voting system with Mayor tie-breaking
- ✅ Automatic win detection (6 conditions: Village, Evil, White Wolf, Nosferatu, Assassin, Innkeeper)
- ✅ Beautiful game over screen with full role reveals
- ✅ Mobile-optimized throughout with touch interactions
- ✅ localStorage persistence for game continuity

**Production Status:**
The Wolfed Moderator Assistant is **100% playable** and production-ready. It successfully guides a moderator through an entire game of Wolfed from player setup to winner announcement. All core features are implemented, tested, and optimized for mobile use.

**Optional Future Work:**
- Hunter auto-selection UI
- Jester tracking interface
- Event Cards system
- Animations & sound effects
- GitHub Pages deployment
- PWA features
