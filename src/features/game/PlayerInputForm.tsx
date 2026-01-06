import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { X } from "lucide-react";

interface PlayerInputFormProps {
  onPlayersConfirmed: (playerNames: string[]) => void;
}

export function PlayerInputForm({ onPlayersConfirmed }: PlayerInputFormProps) {
  const [playerNames, setPlayerNames] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);

  const handleAddPlayer = () => {
    setPlayerNames([...playerNames, ""]);
    setError(null);
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 1) {
      const newNames = playerNames.filter((_, i) => i !== index);
      setPlayerNames(newNames);
      setError(null);
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
    setError(null);
  };

  const handleSubmit = () => {
    const filledNames = playerNames.filter((name) => name.trim() !== "");

    if (filledNames.length < 3) {
      setError("You need at least 3 players to start a game");
      return;
    }

    const uniqueNames = new Set(filledNames);
    if (uniqueNames.size !== filledNames.length) {
      setError("All player names must be unique");
      return;
    }

    onPlayersConfirmed(filledNames);
  };

  const filledCount = playerNames.filter((name) => name.trim() !== "").length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">Add Players</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Enter player names (minimum 3 required)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player count indicator */}
        <div className="flex items-center justify-between p-3 bg-background rounded-md border border-border">
          <span className="text-sm font-medium">Players Added:</span>
          <span className="text-lg font-bold text-primary">{filledCount}</span>
        </div>

        {/* Player input fields */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto">
          {playerNames.map((name, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={`Player ${index + 1} name`}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="w-full text-base"
                  autoFocus={index === playerNames.length - 1}
                />
              </div>
              {playerNames.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePlayer(index)}
                  className="shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={handleAddPlayer}
            variant="outline"
            className="w-full h-12 text-base"
          >
            + Add Another Player
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            className="w-full h-12 text-base font-semibold"
            disabled={filledCount < 3}
          >
            Continue to Role Assignment ({filledCount} players)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
