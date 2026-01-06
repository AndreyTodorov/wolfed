import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Trophy, RotateCcw, Users } from "lucide-react";
import type { Player, Faction } from "../../types";
import { cn } from "../../lib/utils";

interface GameOverProps {
  winner: Faction;
  reason: string;
  players: Player[];
  turnNumber: number;
  onPlayAgain: () => void;
}

export function GameOver({
  winner,
  reason,
  players,
  turnNumber,
  onPlayAgain,
}: GameOverProps) {
  const factionColors = {
    Village: "from-blue-500 to-blue-700",
    Werewolves: "from-red-500 to-red-700",
    Vampires: "from-purple-500 to-purple-700",
    Neutral: "from-yellow-500 to-yellow-700",
  };

  const factionEmoji = {
    Village: "🏘️",
    Werewolves: "🐺",
    Vampires: "🧛",
    Neutral: "⚖️",
  };

  const gradient = factionColors[winner];
  const emoji = factionEmoji[winner];

  const survivors = players.filter((p) => p.isAlive);
  const casualties = players.filter((p) => !p.isAlive);

  return (
    <div className="min-h-screen min-h-dvh bg-background text-foreground p-4 md:p-8 safe-area-top safe-area-bottom">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Winner Announcement */}
        <Card className="overflow-hidden">
          <div className={cn("p-8 bg-gradient-to-br text-white", gradient)}>
            <div className="text-center">
              <div className="text-6xl mb-4">{emoji}</div>
              <Trophy className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {winner} Win!
              </h1>
              <p className="text-lg md:text-xl opacity-90">{reason}</p>
            </div>
          </div>
        </Card>

        {/* Game Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-6 w-6" />
              Game Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold">{turnNumber}</p>
                <p className="text-sm text-muted-foreground">Nights</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold">{players.length}</p>
                <p className="text-sm text-muted-foreground">Total Players</p>
              </div>
              <div className="text-center p-4 bg-success/20 rounded-lg">
                <p className="text-3xl font-bold text-success">{survivors.length}</p>
                <p className="text-sm text-muted-foreground">Survivors</p>
              </div>
              <div className="text-center p-4 bg-destructive/20 rounded-lg">
                <p className="text-3xl font-bold text-destructive">
                  {casualties.length}
                </p>
                <p className="text-sm text-muted-foreground">Casualties</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Survivors */}
        {survivors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Survivors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {survivors.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 bg-success/10 border border-success/20 rounded-lg"
                  >
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {player.role.name} ({player.role.faction})
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Players (Final Role Reveal) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Final Role Reveal</CardTitle>
            <p className="text-sm text-muted-foreground">
              All player roles are now revealed
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Village Team */}
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">
                  🏘️ Village Team
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {players
                    .filter((p) => p.role.faction === "Village")
                    .map((player) => (
                      <div
                        key={player.id}
                        className={cn(
                          "p-2 rounded border text-sm",
                          player.isAlive
                            ? "border-border bg-background"
                            : "border-muted bg-muted opacity-60"
                        )}
                      >
                        <span className={player.isAlive ? "" : "line-through"}>
                          {player.name}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          - {player.role.name}
                        </span>
                        {!player.isAlive && (
                          <span className="ml-2 text-destructive">💀</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Werewolves */}
              {players.some((p) => p.role.faction === "Werewolves") && (
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">
                    🐺 Werewolves
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {players
                      .filter((p) => p.role.faction === "Werewolves")
                      .map((player) => (
                        <div
                          key={player.id}
                          className={cn(
                            "p-2 rounded border text-sm",
                            player.isAlive
                              ? "border-border bg-background"
                              : "border-muted bg-muted opacity-60"
                          )}
                        >
                          <span className={player.isAlive ? "" : "line-through"}>
                            {player.name}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            - {player.role.name}
                          </span>
                          {!player.isAlive && (
                            <span className="ml-2 text-destructive">💀</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Vampires */}
              {players.some((p) => p.role.faction === "Vampires") && (
                <div>
                  <h3 className="font-semibold text-purple-400 mb-2">
                    🧛 Vampires
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {players
                      .filter((p) => p.role.faction === "Vampires")
                      .map((player) => (
                        <div
                          key={player.id}
                          className={cn(
                            "p-2 rounded border text-sm",
                            player.isAlive
                              ? "border-border bg-background"
                              : "border-muted bg-muted opacity-60"
                          )}
                        >
                          <span className={player.isAlive ? "" : "line-through"}>
                            {player.name}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            - {player.role.name}
                          </span>
                          {!player.isAlive && (
                            <span className="ml-2 text-destructive">💀</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Neutral */}
              {players.some((p) => p.role.faction === "Neutral") && (
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-2">
                    ⚖️ Neutral
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {players
                      .filter((p) => p.role.faction === "Neutral")
                      .map((player) => (
                        <div
                          key={player.id}
                          className={cn(
                            "p-2 rounded border text-sm",
                            player.isAlive
                              ? "border-border bg-background"
                              : "border-muted bg-muted opacity-60"
                          )}
                        >
                          <span className={player.isAlive ? "" : "line-through"}>
                            {player.name}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            - {player.role.name}
                          </span>
                          {!player.isAlive && (
                            <span className="ml-2 text-destructive">💀</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Play Again */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onPlayAgain}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Play Again
        </Button>
      </div>
    </div>
  );
}
