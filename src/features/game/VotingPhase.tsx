import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import type { Player } from "../../types";
import { Vote, AlertTriangle, Skull, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface VotingPhaseProps {
  players: Player[];
  onBanish: (playerId: string) => void;
  onSkipVote: () => void;
}

interface VoteRecord {
  voterId: string;
  targetId: string;
}

export function VotingPhase({ players, onBanish, onSkipVote }: VotingPhaseProps) {
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const alivePlayers = players.filter((p) => p.isAlive);
  const hasMayor = alivePlayers.some((p) => p.attributes.includes("Mayor"));

  // Calculate vote counts
  const voteCounts = alivePlayers.reduce((acc, player) => {
    acc[player.id] = 0;
    return acc;
  }, {} as Record<string, number>);

  votes.forEach((vote) => {
    voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
  });

  // Find player(s) with most votes
  const maxVotes = Math.max(...Object.values(voteCounts));
  const playersWithMaxVotes = Object.entries(voteCounts)
    .filter(([_, count]) => count === maxVotes && count > 0)
    .map(([playerId]) => playerId);

  const isTie = playersWithMaxVotes.length > 1;

  const handleVote = (voterId: string, targetId: string) => {
    // Remove previous vote from this voter
    const newVotes = votes.filter((v) => v.voterId !== voterId);
    // Add new vote
    newVotes.push({ voterId, targetId });
    setVotes(newVotes);
  };

  const handleRemoveVote = (voterId: string) => {
    setVotes(votes.filter((v) => v.voterId !== voterId));
  };

  const handleProceedToBanish = () => {
    if (playersWithMaxVotes.length === 1) {
      setSelectedTarget(playersWithMaxVotes[0]);
      setShowConfirmation(true);
    } else if (isTie && hasMayor) {
      // Mayor breaks the tie - show selection
      setShowConfirmation(true);
    }
  };

  const handleConfirmBanish = () => {
    if (selectedTarget) {
      onBanish(selectedTarget);
    }
  };

  const canProceed = maxVotes > 0 && (playersWithMaxVotes.length === 1 || (isTie && hasMayor));

  // Confirmation Dialog
  if (showConfirmation) {
    const targetPlayer = alivePlayers.find((p) => p.id === selectedTarget);

    if (isTie && hasMayor) {
      const mayorPlayer = alivePlayers.find((p) => p.attributes.includes("Mayor"));

      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-warning" />
              Tied Vote - Mayor Decides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              There's a tie! {mayorPlayer?.name} (Mayor) must break the tie by choosing who to
              banish.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Select player to banish:</p>
              {playersWithMaxVotes.map((playerId) => {
                const player = alivePlayers.find((p) => p.id === playerId);
                if (!player) return null;

                return (
                  <button
                    key={playerId}
                    onClick={() => setSelectedTarget(playerId)}
                    className={cn(
                      "w-full p-4 rounded-md border text-left transition-all",
                      selectedTarget === playerId
                        ? "border-destructive bg-destructive/10"
                        : "border-border bg-background hover:bg-muted"
                    )}
                  >
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {voteCounts[playerId]} votes
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmBanish}
                disabled={!selectedTarget}
              >
                <Skull className="mr-2 h-4 w-4" />
                Banish Selected Player
              </Button>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Confirm Banishment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="font-medium text-lg">{targetPlayer?.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Role: {targetPlayer?.role.name} ({targetPlayer?.role.faction})
            </p>
            <p className="text-sm text-muted-foreground">Votes: {maxVotes}</p>
          </div>

          <p className="text-sm text-muted-foreground">
            This player will be banished and their role will be revealed to all players.
          </p>

          {targetPlayer?.role.id === "hunter" && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
              <p className="text-sm text-warning font-medium">
                ⚠️ Warning: Hunter will get to shoot someone before dying!
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleConfirmBanish}
            >
              <Skull className="mr-2 h-4 w-4" />
              Confirm Banishment
            </Button>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Voting Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Voting Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Votes Cast</p>
              <p className="text-2xl font-bold">
                {votes.length} / {alivePlayers.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Leading</p>
              <p className="text-2xl font-bold">{maxVotes} votes</p>
            </div>
            {isTie && (
              <div className="col-span-2 md:col-span-1">
                <p className="text-xs text-destructive">Status</p>
                <p className="text-lg font-bold text-destructive">
                  {hasMayor ? "Tied - Mayor Decides" : "Tied Vote!"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vote Candidates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vote to Banish</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select players to cast votes. Moderator tracks votes from the table.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alivePlayers.map((player) => {
              const voteCount = voteCounts[player.id] || 0;
              const hasMaxVotes = voteCount === maxVotes && maxVotes > 0;

              return (
                <div
                  key={player.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    hasMaxVotes
                      ? "border-destructive bg-destructive/10"
                      : "border-border bg-background"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium">{player.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {player.role.name}
                      </p>
                      {player.isSilenced && (
                        <p className="text-xs text-warning mt-1">🔇 Silenced</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{voteCount}</p>
                      <p className="text-xs text-muted-foreground">votes</p>
                    </div>
                  </div>

                  {/* Vote controls - for moderator to manually track */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        // Simple increment for moderator tracking
                        handleVote(`vote-${Date.now()}`, player.id);
                      }}
                    >
                      + Vote
                    </Button>
                    {voteCount > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const playerVotes = votes.filter((v) => v.targetId === player.id);
                          const lastVote = playerVotes[playerVotes.length - 1];
                          if (lastVote) handleRemoveVote(lastVote.voterId);
                        }}
                      >
                        - Remove
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant="destructive"
          size="lg"
          className="w-full"
          onClick={handleProceedToBanish}
          disabled={!canProceed}
        >
          {isTie && hasMayor ? (
            <>
              <Vote className="mr-2 h-5 w-5" />
              Mayor Breaks Tie
            </>
          ) : (
            <>
              <Skull className="mr-2 h-5 w-5" />
              Proceed to Banishment
            </>
          )}
        </Button>

        <Button variant="outline" size="lg" className="w-full" onClick={onSkipVote}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          No Banishment Today
        </Button>
      </div>

      {/* Voting Help */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Voting Rules</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• Each alive player gets one vote</p>
          <p>• Silenced players can still vote</p>
          <p>• Player with most votes is banished</p>
          {hasMayor && <p>• Mayor breaks ties by choosing who to banish</p>}
          <p>• Use +/- buttons to track votes from the table</p>
        </CardContent>
      </Card>
    </div>
  );
}
