import type { Player } from "../../types";
import { Card, CardContent } from "../../components/ui/card";
import { Heart, Shield, VolumeX, Skull, Crown } from "lucide-react";
import { cn } from "../../lib/utils";

interface PlayerGridProps {
  players: Player[];
}

export function PlayerGrid({ players }: PlayerGridProps) {
  const alivePlayers = players.filter((p) => p.isAlive);
  const deadPlayers = players.filter((p) => !p.isAlive);

  return (
    <div className="space-y-6">
      {/* Alive Players */}
      {alivePlayers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-success" />
            Alive ({alivePlayers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {alivePlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      )}

      {/* Dead Players */}
      {deadPlayers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
            <Skull className="h-5 w-5" />
            Dead ({deadPlayers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deadPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  const factionColors = {
    Village: "text-blue-400 border-blue-500/50",
    Werewolves: "text-red-400 border-red-500/50",
    Vampires: "text-purple-400 border-purple-500/50",
    Neutral: "text-yellow-400 border-yellow-500/50",
  };

  const factionColor = factionColors[player.role.faction];

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        !player.isAlive && "opacity-50 grayscale"
      )}
    >
      <CardContent className="p-4">
        {/* Player Name */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-base truncate pr-2">
            {player.name}
          </h4>
          {player.attributes.includes("Mayor") && (
            <Crown className="h-4 w-4 text-warning shrink-0" />
          )}
        </div>

        {/* Role */}
        <div className={cn("mb-3 pb-3 border-b border-border")}>
          <p className={cn("font-medium text-sm", factionColor)}>
            {player.role.name}
          </p>
          <p className="text-xs text-muted-foreground">{player.role.faction}</p>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2">
          {player.isProtectedPhysical && (
            <StatusBadge icon={Shield} label="Protected (Physical)" color="blue" />
          )}
          {player.isProtectedWerewolf && (
            <StatusBadge icon={Shield} label="Protected (WW)" color="green" />
          )}
          {player.isSilenced && (
            <StatusBadge icon={VolumeX} label="Silenced" color="orange" />
          )}
          {player.isAbilityBlocked && (
            <StatusBadge icon={VolumeX} label="Blocked" color="red" />
          )}
          {player.linkedTo && (
            <StatusBadge icon={Heart} label="Linked" color="pink" />
          )}
          {player.attributes.map((attr) => (
            <span
              key={attr}
              className="px-2 py-0.5 text-xs rounded-md bg-accent text-accent-foreground"
            >
              {attr}
            </span>
          ))}
        </div>

        {/* Special metadata */}
        {player.metadata?.oldManLives && player.metadata.oldManLives > 1 && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Lives remaining: {player.metadata.oldManLives}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  icon: Icon,
  label,
  color,
}: {
  icon: any;
  label: string;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    green: "bg-green-500/20 text-green-400 border-green-500/50",
    orange: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    red: "bg-red-500/20 text-red-400 border-red-500/50",
    pink: "bg-pink-500/20 text-pink-400 border-pink-500/50",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs",
        colorClasses[color as keyof typeof colorClasses]
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
}
