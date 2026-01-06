# Wolfed Moderator Assistant - Development Plan

## 1. Architecture & Tech Stack

- **Framework:** React 18+ (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix Primitives)
- **State Management:** Zustand (preferred for complex game state) or React Context + Reducer.
- **Routing:** React Router (minimal needed, mostly phase-based rendering).
- **Hosting:** GitHub Pages.
- **Persistence:** `localStorage` (to prevent data loss on refresh).

## 2. Data Structure Design

The app requires a robust state machine.

### Types (`types.ts`)

```typescript
type Faction = "Village" | "Werewolves" | "Vampires" | "Neutral";

interface Role {
  id: string;
  name: string;
  faction: Faction;
  isEvil: boolean;
  wakeOrder: number; // For Night sorting
  nightAction: "kill" | "check" | "save" | "silence" | "link" | "none";
  description: string;
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
}

interface GameState {
  phase: "SETUP" | "NIGHT" | "DAY_ANNOUNCE" | "DAY_VOTE" | "GAME_OVER";
  turnNumber: number;
  players: Player[];
  nightLog: string[]; // History of tonight's actions
  pendingDeaths: string[]; // Calculated at end of night
  winner: Faction | null;
}
```

## 3. Implementation Steps

### Step 1: Project Initialization

- Initialize Vite project with React/TS.
- Install Tailwind and configure `postcss`.
- Initialize `chadcn/ui` and install core components:
  - `Card` (for player/role cards)
  - `Button`, `Input`, `Select`
  - `Dialog` (for confirming kills/actions)
  - `Badge` (for status effects like "Silenced")
  - `ScrollArea` (for logs)

### Step 2: Role & Data Registry

- Create a `roles.ts` constant file containing all 42 roles with their metadata (Start specific rules from `rules.md`).
- Create `events.ts` for Event cards.
- **Agent Task:** Ensure the "Wake Order" index matches the rulebook (Hag = 1, Watcher = 14).

### Step 3: Phase 1 - Setup Screen

- **Input:** Add Player names.
- **Assignment:**
  - Manual Mode: Assign specific role to specific player.
  - Random Mode: Select a "Set" (e.g., "Classic 6 player") or custom list of roles, then randomize assignment.
- **Output:** Grid view of all players with their hidden roles (visible only to Mod).

### Step 4: Phase 2 - The Night Loop (The Core Logic)

- **UI:** A "Wizard" style stepper.
- **Logic:**
  1.  Filter `players` to find active roles.
  2.  Sort by `wakeOrder`.
  3.  Iterate one by one.
  4.  **Display:** "Wake up [Role Name]. Player is [Player Name]."
  5.  **Action Input:** "Select Target". (e.g., Werewolves select Player X).
  6.  **Resolution:** _Do not apply death immediately._ Store action in a `nightActions` queue.
  7.  **Auto-Logic:**
      - If `Hag` targets `Seer`, when `Seer` turn comes, show "Seer is blocked".
      - If `Werewolves` target `Protected` player, log "Attack Failed".
      - If `Leper` attacked, set `skipNextWolfKill` flag.

### Step 5: Phase 3 - The Day Loop

- **Morning Report:**
  - Process `nightActions` queue.
  - Apply logic (Protection vs Attack).
  - Handle "Lovers" (if A dies, B dies).
  - **Display:** "Deaths tonight: [List Names]".
  - Prompt Moderator to reveal cards (or keep hidden for Butcher).
- **Voting Interface:**
  - List alive players.
  - Track votes (support Mayor double vote).
  - "Banish" button -> Triggers death logic -> Checks "On Death" triggers (Hunter, Old Man).

### Step 6: Win Condition Checking

- Run a check after every Death (Day or Night).
- _Algorithm:_
  - Count Living Evil.
  - Count Living Good.
  - Check Solo win cons (White Wolf, Jester).
  - If `Evil >= Good` -> Evil Win warning.
  - If `Evil == 0` -> Good Win warning.

### Step 7: UI Refinement & Polish

- **Theme:** Dark mode by default (Wolf/Forest theme).
- **Player Cards:** Status icons (Shield icon for protected, Mute icon for silenced).
- **Log:** A side panel showing the history of the game ("Night 1: Seer checked Bob").

## 4. Specific Component Plan

1.  `GameManager.tsx`: The main container handling the State Machine.
2.  `SetupPhase.tsx`: Form for players/roles.
3.  `NightPhase.tsx`: The stepper for role calls.
4.  `ActionPanel.tsx`: Context-aware buttons (Kill, Save, Check) based on current active role.
5.  `DayPhase.tsx`: Dashboard for voting and status tracking.
6.  `PlayerCard.tsx`: Reusable component displaying state.

## 5. Development Prompt for Agent

_To use this plan with an AI coder, provide the `rules.md` context and ask it to implement one Phase at a time, starting with the Data Structures in Step 2, then the Setup Phase._
