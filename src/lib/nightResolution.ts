/**
 * Night Resolution Logic
 * Processes all night actions and determines deaths
 */

import type { Player, NightActionRecord, GameState } from "../types";

interface ResolutionResult {
  deaths: string[]; // Player IDs who died
  logs: string[]; // Resolution logs for moderator
  updatedPlayers: Player[]; // Players with updated statuses
  metadata: Partial<GameState["metadata"]>;
}

export function resolveNightActions(
  players: Player[],
  actions: NightActionRecord[],
  metadata: GameState["metadata"]
): ResolutionResult {
  const result: ResolutionResult = {
    deaths: [],
    logs: [],
    updatedPlayers: [...players],
    metadata: {},
  };

  // Track who was attacked and by whom
  const attacks: Map<
    string,
    { type: "werewolf" | "vampire" | "physical" | "magical"; source: string }[]
  > = new Map();

  // Track protections
  const protections: Map<string, { type: "physical" | "werewolf"; source: string }> =
    new Map();

  // Track pack kills to prevent duplicates (each pack kills only ONCE per night)
  const packKills = {
    werewolves: null as string | null, // Target ID
    vampires: null as string | null,   // Target ID
  };

  // Process actions in order
  actions.forEach((action) => {
    const actor = players.find((p) => p.id === action.playerId);
    const target = players.find((p) => p.id === action.targetId);

    if (!actor || !target) return;

    switch (action.actionType) {
      case "block":
        // Hag - block target's ability (already applied during night phase)
        result.logs.push(`Hag blocked ${target.name}'s ability`);
        break;

      case "protect":
        // Bodyguard or Herbalist
        if (actor.role.id === "bodyguard") {
          protections.set(target.id, { type: "physical", source: actor.name });
          result.logs.push(`Bodyguard protected ${target.name} from physical attacks`);
        } else if (actor.role.id === "herbalist") {
          protections.set(target.id, { type: "werewolf", source: actor.name });
          result.logs.push(
            `Herbalist protected ${target.name} from werewolf attacks`
          );
        }
        break;

      case "kill":
        // Various killing roles
        if (actor.role.id === "werewolf" || actor.role.id === "alpha_wolf" || actor.role.id === "white_wolf_werewolf") {
          // PACK KILL DEDUPLICATION: Werewolves act as a pack - only ONE kill per night
          if (packKills.werewolves !== null) {
            // Already recorded a werewolf kill this night - skip duplicate
            result.logs.push(`Skipping duplicate werewolf action (pack already chose ${players.find(p => p.id === packKills.werewolves)?.name})`);
            break;
          }

          // Check if werewolves should skip this kill (Leper effect)
          if (metadata.skipNextWolfKill) {
            result.logs.push("Werewolves skipped their kill (Leper effect)");
            result.metadata.skipNextWolfKill = false;
            packKills.werewolves = target.id; // Mark as processed
            break;
          }

          // Record the pack's ONE kill
          packKills.werewolves = target.id;
          if (!attacks.has(target.id)) attacks.set(target.id, []);
          attacks.get(target.id)!.push({ type: "werewolf", source: "Werewolves Pack" });
          result.logs.push(`Werewolves attacked ${target.name}`);

          // Check if target is Leper
          if (target.role.id === "leper") {
            result.logs.push(
              `${target.name} is a Leper! Werewolves will skip next kill.`
            );
            result.metadata.skipNextWolfKill = true;
          }
        } else if (actor.role.id === "vampire" || actor.role.id === "nosferatu" || actor.role.id === "vampire_master") {
          // PACK KILL DEDUPLICATION: Vampires act as a pack - only ONE kill per night
          if (packKills.vampires !== null) {
            // Already recorded a vampire kill this night - skip duplicate
            result.logs.push(`Skipping duplicate vampire action (pack already chose ${players.find(p => p.id === packKills.vampires)?.name})`);
            break;
          }

          // Record the pack's ONE kill
          packKills.vampires = target.id;
          if (!attacks.has(target.id)) attacks.set(target.id, []);
          attacks.get(target.id)!.push({ type: "vampire", source: "Vampires Pack" });
          result.logs.push(`Vampires attacked ${target.name}`);
        } else if (actor.role.id === "sorceress") {
          if (!attacks.has(target.id)) attacks.set(target.id, []);
          attacks.get(target.id)!.push({ type: "magical", source: actor.name });
          result.logs.push(`Sorceress used kill potion on ${target.name}`);
        }
        break;

      case "check":
        // Seer, Witch Hunter, etc. - just log
        result.logs.push(
          `${actor.role.name} checked ${target.name} (${target.role.name})`
        );
        break;

      case "link":
        // Gypsy, Cupid, Shadow - link players
        const updatedPlayer = result.updatedPlayers.find((p) => p.id === target.id);
        if (updatedPlayer && action.secondTargetId) {
          updatedPlayer.linkedTo = action.secondTargetId;
          result.logs.push(
            `${actor.role.name} linked ${target.name} to another player`
          );
        }
        break;

      case "save":
        // Hero, Lawyer - save actions
        result.logs.push(`${actor.role.name} attempted to save ${target.name}`);
        break;

      case "silence":
        // Dentist - silence for next day
        const silencedPlayer = result.updatedPlayers.find(
          (p) => p.id === target.id
        );
        if (silencedPlayer) {
          silencedPlayer.isSilenced = true;
          result.logs.push(`Dentist silenced ${target.name} for the next day`);
        }
        break;

      case "redirect":
        // Wagon Driver - redirect attacks (simplified)
        result.logs.push(
          `Wagon Driver attempted to redirect attacks from ${target.name}`
        );
        break;

      default:
        break;
    }
  });

  // Resolve attacks vs protections
  attacks.forEach((attackList, targetId) => {
    const target = players.find((p) => p.id === targetId);
    if (!target) return;

    const protection = protections.get(targetId);
    let died = false;

    attackList.forEach((attack) => {
      // Check protection - improved matching logic
      if (protection) {
        let isProtected = false;

        if (protection.type === "physical") {
          // Bodyguard protects from physical attacks: werewolf, vampire, physical
          if (attack.type === "werewolf" || attack.type === "vampire" || attack.type === "physical") {
            isProtected = true;
          }
        } else if (protection.type === "werewolf") {
          // Herbalist only protects from werewolf attacks
          if (attack.type === "werewolf") {
            isProtected = true;
          }
        }

        if (isProtected) {
          result.logs.push(
            `${target.name} was protected from ${attack.type} attack by ${protection.source}`
          );
          return; // Protected - skip this attack
        }
      }

      // Check special immunities
      if (target.role.id === "miner") {
        result.logs.push(
          `${target.name} (Miner) is immune to night attacks!`
        );
        return; // Miner immune
      }

      // Check Hero shield
      if (
        target.metadata?.heroShieldActive &&
        target.role.id === "hero"
      ) {
        result.logs.push(
          `${target.name} (Hero) survived attack using their shield!`
        );
        const heroPlayer = result.updatedPlayers.find((p) => p.id === targetId);
        if (heroPlayer?.metadata) {
          heroPlayer.metadata.heroShieldActive = false;
        }
        return; // Hero survived once
      }

      // Death occurs from this attack
      died = true;
    });

    if (died) {
      result.deaths.push(targetId);
      result.logs.push(`💀 ${target.name} died during the night`);

      // Check for Dog Breeder
      if (target.role.id === "dog_breeder") {
        // Find a random werewolf
        const werewolves = players.filter(
          (p) => p.isAlive && p.role.faction === "Werewolves"
        );
        if (werewolves.length > 0) {
          const randomWW = werewolves[Math.floor(Math.random() * werewolves.length)];
          result.deaths.push(randomWW.id);
          result.logs.push(
            `🐕 Dog Breeder's dogs killed ${randomWW.name} (${randomWW.role.name})`
          );
        }
      }
    }
  });

  return result;
}

/**
 * Apply deaths and handle linked players (Lovers, Shadow)
 */
export function applyDeaths(
  players: Player[],
  deathIds: string[]
): { updatedPlayers: Player[]; linkedDeaths: string[] } {
  const updatedPlayers = [...players];
  const linkedDeaths: string[] = [];

  // Mark initial deaths
  deathIds.forEach((id) => {
    const player = updatedPlayers.find((p) => p.id === id);
    if (player) {
      player.isAlive = false;
    }
  });

  // Check for linked deaths
  deathIds.forEach((id) => {
    const deadPlayer = updatedPlayers.find((p) => p.id === id);
    if (deadPlayer?.linkedTo) {
      const linkedPlayer = updatedPlayers.find((p) => p.id === deadPlayer.linkedTo);
      if (linkedPlayer && linkedPlayer.isAlive) {
        linkedPlayer.isAlive = false;
        linkedDeaths.push(linkedPlayer.id);
      }
    }
  });

  return { updatedPlayers, linkedDeaths };
}
