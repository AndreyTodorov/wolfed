import { useState } from "react";
import { useGameStore } from "./store/useGameStore";
import { PlayerInputForm } from "./features/game/PlayerInputForm";
import { RoleAssignment } from "./features/game/RoleAssignment";
import { PlayerGrid } from "./features/game/PlayerGrid";
import { NightPhase } from "./features/game/NightPhase";
import { DayAnnouncement } from "./features/game/DayAnnouncement";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import type { Role } from "./types";
import { RotateCcw, Users, Moon, Sun } from "lucide-react";

type SetupStep = "players" | "roles";

function App() {
  const {
    phase,
    players,
    setPlayers,
    startGame,
    startNight,
    startDay,
    resetGame,
    turnNumber,
    nightLog,
    resolveNightActions,
    metadata,
  } = useGameStore();
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

  const handleStartNight = () => {
    startNight();
  };

  const handleNightComplete = () => {
    // Resolve night actions and transition to day announcement
    resolveNightActions();
  };

  const handleDayStart = () => {
    startDay();
  };

  // Night Phase UI
  if (phase === "NIGHT") {
    return (
      <div className="min-h-screen min-h-dvh bg-background text-foreground safe-area-top safe-area-bottom">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">Night Phase</h1>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Night {turnNumber}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetGame}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
          <NightPhase />

          {metadata.activeRoleId === null && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleNightComplete}
            >
              Process Night & Continue to Morning
              <Sun className="ml-2 h-5 w-5" />
            </Button>
          )}
        </main>
      </div>
    );
  }

  // Day Announcement UI
  if (phase === "DAY_ANNOUNCE") {
    const deadPlayers = players.filter((p) => !p.isAlive);
    const recentDeaths = deadPlayers.slice(-5); // Show recent deaths

    return (
      <div className="min-h-screen min-h-dvh bg-background text-foreground p-4 md:p-8 safe-area-top safe-area-bottom">
        <DayAnnouncement
          deaths={recentDeaths}
          nightLog={nightLog}
          onContinue={handleDayStart}
        />
      </div>
    );
  }

  // Day/Vote Phase UI
  if (phase === "DAY_VOTE") {
    return (
      <div className="min-h-screen min-h-dvh bg-background text-foreground safe-area-top safe-area-bottom">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="h-6 w-6 text-warning" />
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">Day Phase</h1>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Day {turnNumber} - Discussion & Voting
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetGame}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Day Phase (Voting Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Voting interface will be implemented in the next phase.
              </p>
              <Button variant="primary" onClick={handleStartNight}>
                <Moon className="mr-2 h-4 w-4" />
                Start Next Night
              </Button>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Players</h2>
            <PlayerGrid players={players} />
          </div>
        </main>
      </div>
    );
  }

  // Game Active UI (between setup and first night)
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
                {phase === "GAME_OVER" ? "Game Over" : `Turn ${turnNumber}`}
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="primary"
                className="gap-2"
                onClick={handleStartNight}
              >
                <Moon className="h-4 w-4" />
                Start Night Phase
              </Button>
            </div>
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
