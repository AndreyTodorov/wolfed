import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skull, Heart, Sun, ArrowRight } from "lucide-react";
import type { Player } from "../../types";

interface DayAnnouncementProps {
  deaths: Player[];
  nightLog: string[];
  onContinue: () => void;
}

export function DayAnnouncement({
  deaths,
  nightLog,
  onContinue,
}: DayAnnouncementProps) {
  const hasDeaths = deaths.length > 0;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Morning Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sun className="h-16 w-16 text-warning" />
          </div>
          <CardTitle className="text-3xl">Morning Announcement</CardTitle>
          <p className="text-muted-foreground mt-2">
            The night has passed. Here's what happened...
          </p>
        </CardHeader>
      </Card>

      {/* Deaths Announcement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            {hasDeaths ? (
              <>
                <Skull className="h-6 w-6 text-destructive" />
                Deaths Last Night ({deaths.length})
              </>
            ) : (
              <>
                <Heart className="h-6 w-6 text-success" />
                No Deaths Last Night
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasDeaths ? (
            <div className="space-y-3">
              {deaths.map((player) => (
                <div
                  key={player.id}
                  className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold">{player.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Role: {player.role.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Faction: {player.role.faction}
                      </p>
                    </div>
                    <Skull className="h-8 w-8 text-destructive shrink-0" />
                  </div>

                  {/* Special Death Effects */}
                  {player.role.id === "old_man" && (
                    <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded">
                      <p className="text-sm text-warning font-medium">
                        ⚠️ Old Man has died! All Good abilities are disabled.
                      </p>
                    </div>
                  )}

                  {player.role.id === "innkeeper" && (
                    <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded">
                      <p className="text-sm text-warning font-medium">
                        ⚠️ Innkeeper has died! Village has 3 days to win.
                      </p>
                    </div>
                  )}

                  {player.role.id === "hunter" && (
                    <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded">
                      <p className="text-sm text-warning font-medium">
                        🎯 Hunter died! They may shoot someone immediately.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto mb-3 text-success" />
              <p className="text-lg font-medium text-success">
                Everyone survived the night!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                The village is safe... for now.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Night Log (for moderator reference) */}
      {nightLog.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Moderator Notes</CardTitle>
            <p className="text-sm text-muted-foreground">
              What happened during the night
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm bg-muted p-4 rounded-md max-h-64 overflow-y-auto">
              {nightLog.map((log, idx) => (
                <div key={idx} className="text-muted-foreground font-mono">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onContinue}
      >
        Continue to Day Phase
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
