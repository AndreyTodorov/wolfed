/**
 * Win Condition Checker
 * Determines if the game has ended and who won
 */

import type { Player, Faction, GameState } from "../types";

export type WinResult =
  | { status: "ONGOING" }
  | {
      status: "WIN";
      winner: Faction;
      reason: string;
    };

export function checkWinCondition(
  players: Player[],
  metadata: GameState["metadata"],
  turnNumber: number
): WinResult {
  const alivePlayers = players.filter((p) => p.isAlive);

  // No one left - shouldn't happen but handle it
  if (alivePlayers.length === 0) {
    return {
      status: "WIN",
      winner: "Neutral",
      reason: "Everyone died - No winners",
    };
  }

  // Check Innkeeper countdown
  if (metadata.innkeeperDeadTurnNumber !== null && metadata.innkeeperDeadTurnNumber !== undefined) {
    const daysSinceInnkeeperDied = turnNumber - metadata.innkeeperDeadTurnNumber;
    if (daysSinceInnkeeperDied > 3) {
      return {
        status: "WIN",
        winner: "Werewolves",
        reason: "Innkeeper died 3 days ago - Evil wins!",
      };
    }
  }

  // Count factions
  const evilPlayers = alivePlayers.filter((p) => p.role.isEvil);
  const goodPlayers = alivePlayers.filter((p) => !p.role.isEvil);

  // Check solo win conditions first

  // White Wolf: Last survivor (alone)
  if (alivePlayers.length === 1) {
    const lastPlayer = alivePlayers[0];
    if (lastPlayer.role.id === "white_wolf") {
      return {
        status: "WIN",
        winner: "Neutral",
        reason: `${lastPlayer.name} (White Wolf) is the last survivor!`,
      };
    }
  }

  // Nosferatu: Specific win condition (last evil standing with goods)
  const nosferatu = alivePlayers.find((p) => p.role.id === "nosferatu");
  if (nosferatu && evilPlayers.length === 1 && evilPlayers[0].id === nosferatu.id) {
    if (goodPlayers.length > 0) {
      return {
        status: "WIN",
        winner: "Vampires",
        reason: `${nosferatu.name} (Nosferatu) achieved their win condition!`,
      };
    }
  }

  // Assassin: Wins if 1v1 with a good character OR if werewolves win and assassin survives
  const assassin = alivePlayers.find((p) => p.role.id === "assassin");
  if (assassin && alivePlayers.length === 2) {
    const otherPlayer = alivePlayers.find((p) => p.id !== assassin.id);
    if (otherPlayer && !otherPlayer.role.isEvil) {
      return {
        status: "WIN",
        winner: "Neutral",
        reason: `${assassin.name} (Assassin) wins in 1v1 with ${otherPlayer.name}!`,
      };
    }
  }

  // Jester: Would need to track correct guesses - skip for now (manual win)

  // Standard win conditions

  // No evil left - Good wins
  if (evilPlayers.length === 0) {
    return {
      status: "WIN",
      winner: "Village",
      reason: "All evil players have been eliminated!",
    };
  }

  // Evil >= Good - Evil wins
  if (evilPlayers.length >= goodPlayers.length) {
    // Determine which evil faction
    const werewolves = evilPlayers.filter(
      (p) => p.role.faction === "Werewolves"
    );
    const vampires = evilPlayers.filter((p) => p.role.faction === "Vampires");

    if (werewolves.length > vampires.length) {
      return {
        status: "WIN",
        winner: "Werewolves",
        reason: "Werewolves equal or outnumber the good players!",
      };
    } else if (vampires.length > 0) {
      return {
        status: "WIN",
        winner: "Vampires",
        reason: "Vampires equal or outnumber the good players!",
      };
    } else {
      return {
        status: "WIN",
        winner: "Werewolves",
        reason: "Evil equals or outnumbers the good players!",
      };
    }
  }

  // Game continues
  return { status: "ONGOING" };
}

/**
 * Get a summary of current game state for display
 */
export function getGameStateSummary(players: Player[]): {
  alive: number;
  dead: number;
  evil: number;
  good: number;
  factions: Record<string, number>;
} {
  const alivePlayers = players.filter((p) => p.isAlive);

  const evil = alivePlayers.filter((p) => p.role.isEvil).length;
  const good = alivePlayers.filter((p) => !p.role.isEvil).length;

  const factions = alivePlayers.reduce((acc, p) => {
    acc[p.role.faction] = (acc[p.role.faction] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    alive: alivePlayers.length,
    dead: players.length - alivePlayers.length,
    evil,
    good,
    factions,
  };
}
