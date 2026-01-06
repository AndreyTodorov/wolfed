import { useState } from "react";
import { useGameStore } from "./store/useGameStore";
import { PlayerInputForm } from "./features/game/PlayerInputForm";
import { RoleAssignment } from "./features/game/RoleAssignment";
import { PlayerGrid } from "./features/game/PlayerGrid";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import type { Role } from "./types";
import { Play, RotateCcw, Users } from "lucide-react";

type SetupStep = "players" | "roles";

function App() {
  const { phase, players, setPlayers, startGame, resetGame, turnNumber } =
    useGameStore();
  const [setupStep, setSetupStep] = useState<SetupStep>("players");
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const handlePlayersConfirmed = (names: string[]) => {
    setPlayerNames(names);
    setSetupStep("roles");
  };

  const handleRolesAssigned = (
    assignments: { name: string; role: Role }[]
  ) => {
    // Clear existing players and add new ones
    const newPlayers = assignments.map((assignment) => ({
      id: crypto.randomUUID(),
      name: assignment.name,
      role: assignment.role,
      isAlive: true,
      isSilenced: false,
      isAbilityBlocked: false,
      isProtectedPhysical: false,
      isProtectedWerewolf: false,
      linkedTo: null,
      attributes: [],
      metadata: {
        oldManLives: assignment.role.id === "old_man" ? 2 : undefined,
        heroShieldActive: assignment.role.id === "hero" ? true : undefined,
        usedAbilities: 0,
      },
    }));

    setPlayers(newPlayers);
    startGame();
  };

  const handleResetGame = () => {
    resetGame();
    setSetupStep("players");
    setPlayerNames([]);
  };

  const handleBackToPlayers = () => {
    setSetupStep("players");
  };

  // Setup Phase UI
  if (phase === "SETUP") {
    return (
      <div className="min-h-screen min-h-dvh bg-background text-foreground p-4 md:p-8 safe-area-top safe-area-bottom">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="mb-6 md:mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Wolfed Moderator
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Game Setup
            </p>
          </header>

          {/* Setup Steps */}
          {setupStep === "players" ? (
            <PlayerInputForm onPlayersConfirmed={handlePlayersConfirmed} />
          ) : (
            <RoleAssignment
              playerNames={playerNames}
              onRolesAssigned={handleRolesAssigned}
              onBack={handleBackToPlayers}
            />
          )}
        </div>
      </div>
    );
  }

  // Game Active UI
  return (
    <div className="min-h-screen min-h-dvh bg-background text-foreground safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                Wolfed Moderator
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {phase === "GAME_OVER" ? "Game Over" : `Night ${turnNumber}`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetGame}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Game Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Users className="h-5 w-5" />
              Game Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Phase</p>
                <p className="text-base md:text-lg font-semibold">{phase}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Turn</p>
                <p className="text-base md:text-lg font-semibold">
                  {turnNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Alive</p>
                <p className="text-base md:text-lg font-semibold text-success">
                  {players.filter((p) => p.isAlive).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-base md:text-lg font-semibold">
                  {players.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Will be implemented in next phase */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="primary" className="gap-2" disabled>
                <Play className="h-4 w-4" />
                Start Night Phase
              </Button>
              <Button variant="outline" disabled>
                Start Day Phase
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Night and Day phase controls will be implemented in the next
              development phase.
            </p>
          </CardContent>
        </Card>

        {/* Player Grid */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Players</h2>
          <PlayerGrid players={players} />
        </div>
      </main>
    </div>
  );
}

export default App;
