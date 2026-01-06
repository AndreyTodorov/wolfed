/**
 * Complete Role Registry for Wolfed
 * Based on rules.md - includes all 42+ roles with their wakeOrder
 *
 * Wake Order Reference (from rules.md Section 4):
 * 1. Hag
 * 2. Gypsy, Master Villager, Miss Rose, Assassin, Leper checks
 * 3. Seer, Prophet, Witch Hunter
 * 4. Bard, Jester
 * 5. Wagon Driver
 * 6. Thief, Dentist, Sir Lengthily, Shadow
 * 7. Herbalist, Bodyguard, Lawyer
 * 8. Werewolves, Dark Seer, Alpha Wolf
 * 9. Vampire, Nosferatu
 * 10. Sorceress
 * 11. Hero
 * 12. Butcher
 * 13. Undertaker
 * 14. Watcher
 */

import type { Role } from "../types";

export const ROLES: Record<string, Role> = {
  // ========== WEREWOLVES (Evil) ==========
  WEREWOLF: {
    id: "werewolf",
    name: "Werewolf",
    faction: "Werewolves",
    isEvil: true,
    wakeOrder: 8,
    nightAction: "kill",
    description: "Wake together with pack. Choose 1 victim per night. Physical attack.",
  },

  ALPHA_WOLF: {
    id: "alpha_wolf",
    name: "Alpha Wolf",
    faction: "Werewolves",
    isEvil: true,
    wakeOrder: 8,
    nightAction: "kill",
    description: "Kills twice (once with pack, once alone). Can kill other werewolves. Win condition: Last survivor or with Nosferatu.",
  },

  WHITE_WOLF: {
    id: "white_wolf",
    name: "White Wolf",
    faction: "Werewolves",
    isEvil: true,
    wakeOrder: 8,
    nightAction: "kill",
    description: "A werewolf with solo win condition. Can kill other werewolves every other night.",
  },

  // ========== VAMPIRES (Evil) ==========
  VAMPIRE: {
    id: "vampire",
    name: "Vampire",
    faction: "Vampires",
    isEvil: true,
    wakeOrder: 9,
    nightAction: "kill",
    description: "Kills every second night (magical attack).",
  },

  NOSFERATU: {
    id: "nosferatu",
    name: "Nosferatu",
    faction: "Vampires",
    isEvil: true,
    wakeOrder: 9,
    nightAction: "kill",
    description: "Kills every second night starting night 2. Solo win condition.",
  },

  // ========== SEERS & INFO GATHERERS (Good) ==========
  SEER: {
    id: "seer",
    name: "Seer",
    faction: "Village",
    isEvil: false,
    wakeOrder: 3,
    nightAction: "check",
    description: "Checks one player's role card each night.",
  },

  PROPHET: {
    id: "prophet",
    name: "Prophet",
    faction: "Village",
    isEvil: false,
    wakeOrder: 3,
    nightAction: "check",
    description: "Acts as Villager until Seer dies, then becomes Seer.",
  },

  WITCH_HUNTER: {
    id: "witch_hunter",
    name: "Witch Hunter",
    faction: "Village",
    isEvil: false,
    wakeOrder: 3,
    nightAction: "check",
    description: "Checks one player's alignment (Good/Evil) only, not specific role.",
  },

  WATCHER: {
    id: "watcher",
    name: "Watcher",
    faction: "Village",
    isEvil: false,
    wakeOrder: 14,
    nightAction: "check",
    description: "Chooses a player and learns who interacted with them during the night.",
  },

  LITTLE_GIRL: {
    id: "little_girl",
    name: "Little Girl",
    faction: "Village",
    isEvil: false,
    wakeOrder: 8, // Wakes with werewolves to peek
    nightAction: "check",
    description: "Can peek while werewolves are awake.",
  },

  MISS_ROSE: {
    id: "miss_rose",
    name: "Miss Rose",
    faction: "Village",
    isEvil: false,
    wakeOrder: 2,
    nightAction: "check",
    description: "On night 1, all known evil players are pointed out to her.",
  },

  DARK_SEER: {
    id: "dark_seer",
    name: "Dark Seer",
    faction: "Werewolves",
    isEvil: true,
    wakeOrder: 8,
    nightAction: "check",
    description: "Evil seer. Checks identities to help werewolves.",
  },

  // ========== PROTECTORS & HEALERS (Good) ==========
  BODYGUARD: {
    id: "bodyguard",
    name: "Bodyguard",
    faction: "Village",
    isEvil: false,
    wakeOrder: 7,
    nightAction: "protect",
    description: "Protects one player from physical attacks. Cannot protect self.",
  },

  HERBALIST: {
    id: "herbalist",
    name: "Herbalist",
    faction: "Village",
    isEvil: false,
    wakeOrder: 7,
    nightAction: "protect",
    description: "Protects one player from werewolf attacks. Cannot pick same person twice in a row.",
  },

  WAGON_DRIVER: {
    id: "wagon_driver",
    name: "Wagon Driver",
    faction: "Village",
    isEvil: false,
    wakeOrder: 5,
    nightAction: "redirect",
    description: "Redirects attacks from Player A to Player B.",
  },

  LAWYER: {
    id: "lawyer",
    name: "Lawyer",
    faction: "Village",
    isEvil: false,
    wakeOrder: 7,
    nightAction: "save",
    description: "Selects a player at night. If that player is voted to be banished next day, they are saved.",
  },

  HERO: {
    id: "hero",
    name: "Hero",
    faction: "Village",
    isEvil: false,
    wakeOrder: 11,
    nightAction: "save",
    description: "Survives one attack. Can sacrifice self to save others.",
  },

  MINER: {
    id: "miner",
    name: "Miner",
    faction: "Village",
    isEvil: false,
    wakeOrder: null,
    nightAction: "none",
    description: "Immune to night kills. Can only be banished during the day.",
    isPassive: true,
  },

  // ========== MANIPULATORS & STATUS EFFECTS ==========
  HAG: {
    id: "hag",
    name: "Hag",
    faction: "Village",
    isEvil: false,
    wakeOrder: 1,
    nightAction: "block",
    description: "Silences one player's ability for the night (ability blocker).",
  },

  DENTIST: {
    id: "dentist",
    name: "Dentist",
    faction: "Village",
    isEvil: false,
    wakeOrder: 6,
    nightAction: "silence",
    description: "Silences one player - they cannot speak the next day.",
  },

  GYPSY: {
    id: "gypsy",
    name: "Gypsy",
    faction: "Village",
    isEvil: false,
    wakeOrder: 2,
    nightAction: "link",
    description: "Links two lovers on night 1. If one dies, both die.",
  },

  BARD: {
    id: "bard",
    name: "Bard",
    faction: "Neutral",
    isEvil: false,
    wakeOrder: 4,
    nightAction: "link",
    description: "Binds players. Wins if all bound players are alive at end.",
  },

  CUPID: {
    id: "cupid",
    name: "Cupid",
    faction: "Village",
    isEvil: false,
    wakeOrder: 2,
    nightAction: "link",
    description: "Similar to Gypsy - creates lovers bond.",
  },

  SHADOW: {
    id: "shadow",
    name: "Shadow",
    faction: "Neutral",
    isEvil: false,
    wakeOrder: 6,
    nightAction: "link",
    description: "Links to a host player. Dies if host dies.",
  },

  THIEF: {
    id: "thief",
    name: "Thief",
    faction: "Village",
    isEvil: false,
    wakeOrder: 6,
    nightAction: "steal_vote",
    description: "Steals a vote. Target cannot vote, Thief votes twice.",
  },

  SORCERESS: {
    id: "sorceress",
    name: "Sorceress",
    faction: "Village",
    isEvil: false,
    wakeOrder: 10,
    nightAction: "kill",
    description: "Has one kill potion and one save potion per game.",
    usageLimit: 2,
  },

  // ========== KILLERS & ATTACKERS ==========
  HUNTER: {
    id: "hunter",
    name: "Hunter",
    faction: "Village",
    isEvil: false,
    wakeOrder: null,
    nightAction: "kill",
    description: "On death, immediately selects one player to kill.",
    isPassive: true,
  },

  ASSASSIN: {
    id: "assassin",
    name: "Assassin",
    faction: "Neutral",
    isEvil: true,
    wakeOrder: 2,
    nightAction: "check",
    description: "Wakes with werewolves night 1 (visual only). Wins if werewolves win and he survives. Kills target if banished.",
  },

  DOG_BREEDER: {
    id: "dog_breeder",
    name: "Dog Breeder",
    faction: "Village",
    isEvil: false,
    wakeOrder: null,
    nightAction: "none",
    description: "If killed at night, one random werewolf dies the next day.",
    isPassive: true,
  },

  // ========== SPECIAL RESIDENTS ==========
  OLD_MAN: {
    id: "old_man",
    name: "Old Man",
    faction: "Village",
    isEvil: false,
    wakeOrder: null,
    nightAction: "none",
    description: "Has 2 lives. If he dies fully, ALL Good team abilities are disabled.",
    isPassive: true,
  },

  MAYOR: {
    id: "mayor",
    name: "Mayor",
    faction: "Village",
    isEvil: false,
    wakeOrder: null,
    nightAction: "none",
    description: "Vote counts as 2 during ties. Can be elected.",
    isPassive: true,
  },

  UNDERTAKER: {
    id: "undertaker",
    name: "Undertaker",
    faction: "Village",
    isEvil: false,
    wakeOrder: 13,
    nightAction: "check",
    description: "Can ask one dead player for a one-word clue.",
  },

  BUTCHER: {
    id: "butcher",
    name: "Butcher",
    faction: "Village",
    isEvil: false,
    wakeOrder: 12,
    nightAction: "none",
    description: "Can hide dead bodies - death announced but role/card not revealed.",
  },

  INNKEEPER: {
    id: "innkeeper",
    name: "Innkeeper",
    faction: "Village",
    isEvil: false,
    wakeOrder: null,
    nightAction: "none",
    description: "If dead, Village has 3 days to win or they lose.",
    isPassive: true,
  },

  MASTER_VILLAGER: {
    id: "master_villager",
    name: "Master Villager",
    faction: "Village",
    isEvil: false,
    wakeOrder: 2,
    nightAction: "check",
    description: "Enhanced villager with special event card interactions.",
  },

  SIR_LENGTHILY: {
    id: "sir_lengthily",
    name: "Sir Lengthily",
    faction: "Village",
    isEvil: false,
    wakeOrder: 6,
    nightAction: "none",
    description: "Can force a 1v1 duel instead of standard voting.",
  },

  LEPER: {
    id: "leper",
    name: "Leper",
    faction: "Village",
    isEvil: false,
    wakeOrder: 2,
    nightAction: "none",
    description: "If attacked by werewolves, they skip killing the next night.",
    isPassive: true,
  },

  JESTER: {
    id: "jester",
    name: "Jester",
    faction: "Neutral",
    isEvil: false,
    wakeOrder: 4,
    nightAction: "check",
    description: "Guesses who will be banished. Wins if correct 3 times.",
  },

  VILLAGER: {
    id: "villager",
    name: "Villager",
    faction: "Village",
    isEvil: false,
    wakeOrder: null,
    nightAction: "none",
    description: "Basic village role with no special abilities.",
  },

  // ========== ADDITIONAL ROLES ==========
  DOCTOR: {
    id: "doctor",
    name: "Doctor",
    faction: "Village",
    isEvil: false,
    wakeOrder: 5,
    nightAction: "redirect",
    description: "Similar to Wagon Driver - redirects attacks.",
  },

  SHERIFF: {
    id: "sheriff",
    name: "Sheriff",
    faction: "Village",
    isEvil: false,
    wakeOrder: null,
    nightAction: "none",
    description: "Elected role with special voting powers.",
    isPassive: true,
  },

  INFECTED: {
    id: "infected",
    name: "Infected",
    faction: "Village",
    isEvil: false,
    wakeOrder: null,
    nightAction: "none",
    description: "Status effect - can spread infection based on event cards.",
    isPassive: true,
  },
};

/**
 * Helper function to get roles by faction
 */
export const getRolesByFaction = (faction: string): Role[] => {
  return Object.values(ROLES).filter((role) => role.faction === faction);
};

/**
 * Helper function to get roles sorted by wake order
 */
export const getRolesByWakeOrder = (): Role[] => {
  return Object.values(ROLES)
    .filter((role) => role.wakeOrder !== null)
    .sort((a, b) => (a.wakeOrder || 999) - (b.wakeOrder || 999));
};

/**
 * Helper function to get a role by ID
 */
export const getRoleById = (id: string): Role | undefined => {
  return ROLES[id.toUpperCase()];
};

/**
 * All roles as an array
 */
export const ALL_ROLES = Object.values(ROLES);
