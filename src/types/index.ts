/**
 * Core type definitions for Wolfed Moderator Assistant
 */

export type Faction = "Village" | "Werewolves" | "Vampires" | "Neutral";

export type NightAction =
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

export type GamePhase =
  | "SETUP"
  | "NIGHT"
  | "DAY_ANNOUNCE"
  | "DAY_VOTE"
  | "GAME_OVER";

export interface Role {
  id: string;
  name: string;
  faction: Faction;
  isEvil: boolean;
  wakeOrder: number | null; // null for roles that don't wake up
  nightAction: NightAction;
  description: string;
  isPassive?: boolean; // For roles like Leper, Miner
  usageLimit?: number; // For roles like Sorceress (limited use abilities)
}

export interface Player {
  id: string;
  name: string;
  role: Role;
  isAlive: boolean;
  isSilenced: boolean; // Cannot speak (Dentist effect)
  isAbilityBlocked: boolean; // Hag effect
  isProtectedPhysical: boolean; // Bodyguard protection
  isProtectedWerewolf: boolean; // Herbalist protection
  linkedTo: string | null; // For Lovers/Shadow (Player ID)
  attributes: string[]; // ['Mayor', 'Infected', 'Sheriff', etc.]
  metadata?: {
    oldManLives?: number; // For Old Man (2 lives)
    heroShieldActive?: boolean; // For Hero (survives 1 attack)
    usedAbilities?: number; // Track ability usage for limited roles
    lastProtectedPlayer?: string; // For Herbalist (can't protect same twice)
  };
}

export interface NightActionRecord {
  roleId: string;
  playerId: string;
  targetId: string | null;
  secondTargetId?: string | null; // For Wagon Driver, Gypsy
  actionType: NightAction;
  timestamp: number;
  blocked?: boolean;
  protected?: boolean;
  successful?: boolean;
}

export interface GameState {
  phase: GamePhase;
  turnNumber: number;
  players: Player[];
  nightLog: string[]; // History of tonight's actions
  nightActions: NightActionRecord[]; // Queue of actions to resolve
  pendingDeaths: string[]; // Player IDs scheduled to die
  dayLog: string[]; // History of day events
  winner: Faction | null;
  metadata: {
    skipNextWolfKill?: boolean; // Leper effect
    allGoodAbilitiesDisabled?: boolean; // Old Man death effect
    innkeeperDeadTurnNumber?: number | null; // Innkeeper effect (Village has 3 days)
    currentNightRoleIndex?: number; // Track position in night sequence
    activeRoleId?: string | null; // Currently waking role
  };
}

export interface VoteRecord {
  voterId: string;
  targetId: string;
  voteWeight: number; // 1 for normal, 2 for Mayor tie-breaker
}

export interface DayVotingState {
  votes: VoteRecord[];
  silencedPlayers: string[]; // Players who cannot vote
  thiefTarget?: string | null; // Player whose vote was stolen
}

/**
 * Event Card types (for future implementation)
 */
export interface EventCard {
  id: string;
  name: string;
  description: string;
  trigger: "NIGHT_START" | "DAY_START" | "MANUAL";
  effect: string;
}
