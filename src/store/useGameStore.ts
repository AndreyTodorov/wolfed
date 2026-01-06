/**
 * Zustand Store for Wolfed Moderator Assistant
 * Manages the entire game state with persistence to localStorage
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GameState,
  Player,
  Role,
  NightActionRecord,
  GamePhase,
  Faction,
} from "../types";
import { resolveNightActions, applyDeaths } from "../lib/nightResolution";

interface GameStore extends GameState {
  // ========== STATE SETTERS ==========
  setPhase: (phase: GamePhase) => void;
  setPlayers: (players: Player[]) => void;

  // ========== PLAYER MANAGEMENT ==========
  addPlayer: (name: string, role: Role) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  killPlayer: (playerId: string) => void;
  revivePlayer: (playerId: string) => void;

  // ========== GAME FLOW ==========
  startGame: () => void;
  startNight: () => void;
  startDay: () => void;
  endGame: (winner: Faction) => void;
  resetGame: () => void;

  // ========== NIGHT ACTIONS ==========
  recordNightAction: (action: NightActionRecord) => void;
  clearNightActions: () => void;
  resolveNightActions: () => void;

  // ========== LOGGING ==========
  addNightLog: (message: string) => void;
  addDayLog: (message: string) => void;
  clearLogs: () => void;

  // ========== DEATH MANAGEMENT ==========
  addPendingDeath: (playerId: string) => void;
  clearPendingDeaths: () => void;
  processPendingDeaths: () => void;

  // ========== METADATA MANAGEMENT ==========
  updateMetadata: (updates: Partial<GameState["metadata"]>) => void;
  setActiveRole: (roleId: string | null) => void;
}

const initialState: GameState = {
  phase: "SETUP",
  turnNumber: 0,
  players: [],
  nightLog: [],
  nightActions: [],
  pendingDeaths: [],
  dayLog: [],
  winner: null,
  metadata: {
    skipNextWolfKill: false,
    allGoodAbilitiesDisabled: false,
    innkeeperDeadTurnNumber: null,
    currentNightRoleIndex: 0,
    activeRoleId: null,
  },
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========== STATE SETTERS ==========
      setPhase: (phase) => set({ phase }),

      setPlayers: (players) => set({ players }),

      // ========== PLAYER MANAGEMENT ==========
      addPlayer: (name, role) => {
        const newPlayer: Player = {
          id: crypto.randomUUID(),
          name,
          role,
          isAlive: true,
          isSilenced: false,
          isAbilityBlocked: false,
          isProtectedPhysical: false,
          isProtectedWerewolf: false,
          linkedTo: null,
          attributes: [],
          metadata: {
            oldManLives: role.id === "old_man" ? 2 : undefined,
            heroShieldActive: role.id === "hero" ? true : undefined,
            usedAbilities: 0,
          },
        };
        set((state) => ({
          players: [...state.players, newPlayer],
        }));
      },

      removePlayer: (playerId) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== playerId),
        })),

      updatePlayer: (playerId, updates) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, ...updates } : p
          ),
        })),

      killPlayer: (playerId) => {
        const player = get().players.find((p) => p.id === playerId);
        if (!player) return;

        // Check for linked players (Lovers, Shadow)
        const linkedPlayer = get().players.find(
          (p) => p.id === player.linkedTo
        );

        set((state) => ({
          players: state.players.map((p) => {
            if (p.id === playerId) {
              return { ...p, isAlive: false };
            }
            // If linked, kill linked player too
            if (linkedPlayer && p.id === linkedPlayer.id) {
              return { ...p, isAlive: false };
            }
            return p;
          }),
        }));

        // Check for special death effects
        if (player.role.id === "innkeeper") {
          set((state) => ({
            metadata: {
              ...state.metadata,
              innkeeperDeadTurnNumber: state.turnNumber,
            },
          }));
        }

        if (player.role.id === "old_man") {
          const lives = player.metadata?.oldManLives || 0;
          if (lives <= 1) {
            // Old Man fully dead - disable all good abilities
            set((state) => ({
              metadata: {
                ...state.metadata,
                allGoodAbilitiesDisabled: true,
              },
            }));
          } else {
            // Decrement life
            get().updatePlayer(playerId, {
              metadata: { ...player.metadata, oldManLives: lives - 1 },
            });
          }
        }
      },

      revivePlayer: (playerId) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, isAlive: true } : p
          ),
        })),

      // ========== GAME FLOW ==========
      startGame: () =>
        set({
          phase: "NIGHT",
          turnNumber: 1,
          nightLog: [],
          dayLog: [],
          nightActions: [],
          pendingDeaths: [],
        }),

      startNight: () =>
        set((state) => ({
          phase: "NIGHT",
          turnNumber: state.turnNumber + 1,
          nightLog: [],
          nightActions: [],
          pendingDeaths: [],
          metadata: {
            ...state.metadata,
            currentNightRoleIndex: 0,
            activeRoleId: null,
          },
          // Reset protection statuses
          players: state.players.map((p) => ({
            ...p,
            isProtectedPhysical: false,
            isProtectedWerewolf: false,
            isAbilityBlocked: false,
          })),
        })),

      startDay: () =>
        set((state) => ({
          phase: "DAY_ANNOUNCE",
          dayLog: [],
          // Clear silence effects from previous day
          players: state.players.map((p) => ({
            ...p,
            isSilenced: false,
          })),
        })),

      endGame: (winner) =>
        set({
          phase: "GAME_OVER",
          winner,
        }),

      resetGame: () =>
        set({
          ...initialState,
          players: [], // Clear players on reset
        }),

      // ========== NIGHT ACTIONS ==========
      recordNightAction: (action) =>
        set((state) => ({
          nightActions: [...state.nightActions, action],
        })),

      clearNightActions: () => set({ nightActions: [] }),

      resolveNightActions: () => {
        const state = get();
        const { nightActions, players, metadata } = state;

        // Use the night resolution logic
        const resolution = resolveNightActions(players, nightActions, metadata);

        // Update metadata
        if (Object.keys(resolution.metadata).length > 0) {
          get().updateMetadata(resolution.metadata);
        }

        // Add logs
        resolution.logs.forEach((log) => get().addNightLog(log));

        // Apply deaths with linked player handling
        const { updatedPlayers, linkedDeaths } = applyDeaths(
          resolution.updatedPlayers,
          resolution.deaths
        );

        // Log linked deaths
        linkedDeaths.forEach((id) => {
          const player = updatedPlayers.find((p) => p.id === id);
          if (player) {
            get().addNightLog(`💔 ${player.name} died (linked player)`);
          }
        });

        // Update players
        set({ players: updatedPlayers });

        // Transition to day announcement
        set({ phase: "DAY_ANNOUNCE" });
      },

      // ========== LOGGING ==========
      addNightLog: (message) =>
        set((state) => ({
          nightLog: [...state.nightLog, message],
        })),

      addDayLog: (message) =>
        set((state) => ({
          dayLog: [...state.dayLog, message],
        })),

      clearLogs: () => set({ nightLog: [], dayLog: [] }),

      // ========== DEATH MANAGEMENT ==========
      addPendingDeath: (playerId) =>
        set((state) => ({
          pendingDeaths: [...state.pendingDeaths, playerId],
        })),

      clearPendingDeaths: () => set({ pendingDeaths: [] }),

      processPendingDeaths: () => {
        const { pendingDeaths } = get();
        pendingDeaths.forEach((playerId) => {
          get().killPlayer(playerId);
        });
        get().clearPendingDeaths();
      },

      // ========== METADATA MANAGEMENT ==========
      updateMetadata: (updates) =>
        set((state) => ({
          metadata: { ...state.metadata, ...updates },
        })),

      setActiveRole: (roleId) =>
        set((state) => ({
          metadata: { ...state.metadata, activeRoleId: roleId },
        })),
    }),
    {
      name: "wolfed-game-storage", // localStorage key
      version: 1,
    }
  )
);
