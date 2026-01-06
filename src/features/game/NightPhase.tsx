import { useState, useEffect, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import type { Player, NightActionRecord } from "../../types";
import { Moon, ArrowRight, CheckCircle, SkipForward } from "lucide-react";
import { cn } from "../../lib/utils";

export function NightPhase() {
  const {
    players,
    nightActions,
    recordNightAction,
    addNightLog,
    setActiveRole,
    updateMetadata,
  } = useGameStore();

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [selectedTargets, setSelectedTargets] = useState<{
    primary: string | null;
    secondary: string | null;
  }>({ primary: null, secondary: null });

  // Get all active roles sorted by wake order
  // Group pack roles (werewolves, vampires) together
  const activeRoles = useMemo(() => {
    const alivePlayers = players.filter((p) => p.isAlive);
    const rolesWithPlayers = alivePlayers.map((p) => ({
      player: p,
      role: p.role,
    }));

    // Filter out roles that don't wake up (wakeOrder === null)
    const wakingRoles = rolesWithPlayers.filter(
      (rp) => rp.role.wakeOrder !== null
    );

    // Group pack roles together
    const packRoles = ["werewolf", "white_wolf_werewolf", "vampire", "vampire_master"];
    const grouped: Array<{ player: Player; role: Player["role"]; packMembers?: Player[] }> = [];
    const processed = new Set<string>();

    wakingRoles.forEach((rp) => {
      if (processed.has(rp.player.id)) return;

      // Check if this is a pack role
      if (packRoles.includes(rp.role.id)) {
        // Find all players with the same faction (Werewolves or Vampires)
        const packMembers = alivePlayers.filter(
          (p) =>
            p.role.faction === rp.role.faction &&
            packRoles.includes(p.role.id) &&
            p.role.wakeOrder === rp.role.wakeOrder
        );

        // Mark all pack members as processed
        packMembers.forEach((pm) => processed.add(pm.id));

        // Add one entry for the whole pack
        grouped.push({
          player: rp.player,
          role: rp.role,
          packMembers: packMembers,
        });
      } else {
        // Regular role - add normally
        processed.add(rp.player.id);
        grouped.push(rp);
      }
    });

    // Sort by wake order
    const sorted = grouped.sort(
      (a, b) => (a.role.wakeOrder || 999) - (b.role.wakeOrder || 999)
    );

    return sorted;
  }, [players]);

  const currentRole = activeRoles[currentRoleIndex];
  const isLastRole = currentRoleIndex >= activeRoles.length - 1;

  // Update active role in metadata
  useEffect(() => {
    if (currentRole) {
      setActiveRole(currentRole.role.id);
      updateMetadata({ currentNightRoleIndex: currentRoleIndex });
    } else {
      // No current role means night is complete
      setActiveRole(null);
    }
  }, [currentRole, currentRoleIndex, setActiveRole, updateMetadata]);

  const handleSkipRole = () => {
    const displayName = currentRole.packMembers && currentRole.packMembers.length > 1
      ? `${currentRole.role.faction} Pack`
      : `${currentRole.role.name} (${currentRole.player.name})`;
    addNightLog(`${displayName} - Skipped`);
    moveToNextRole();
  };

  const handleConfirmAction = () => {
    if (!currentRole) return;

    // Check if player/pack is ability blocked (Hag effect)
    const isBlocked = currentRole.packMembers
      ? currentRole.packMembers.every((p) => p.isAbilityBlocked) // All pack members must be blocked
      : currentRole.player.isAbilityBlocked;

    if (isBlocked) {
      const displayName = currentRole.packMembers
        ? `${currentRole.role.faction} Pack`
        : `${currentRole.role.name} (${currentRole.player.name})`;
      addNightLog(`${displayName} - BLOCKED by Hag`);
      moveToNextRole();
      return;
    }

    // Record the action
    const action: NightActionRecord = {
      roleId: currentRole.role.id,
      playerId: currentRole.player.id,
      targetId: selectedTargets.primary,
      secondTargetId: selectedTargets.secondary,
      actionType: currentRole.role.nightAction,
      timestamp: Date.now(),
    };

    recordNightAction(action);

    // Log the action
    const targetPlayer = players.find((p) => p.id === selectedTargets.primary);
    const displayName = currentRole.packMembers && currentRole.packMembers.length > 1
      ? `${currentRole.role.faction} Pack`
      : `${currentRole.role.name} (${currentRole.player.name})`;

    const logMessage = targetPlayer
      ? `${displayName} → ${targetPlayer.name}`
      : `${displayName} - Action confirmed`;

    addNightLog(logMessage);

    moveToNextRole();
  };

  const moveToNextRole = () => {
    setSelectedTargets({ primary: null, secondary: null });

    if (isLastRole) {
      // Night is complete - will transition to day in parent component
      setActiveRole(null);
    } else {
      setCurrentRoleIndex(currentRoleIndex + 1);
    }
  };

  const handleTargetSelect = (targetId: string, isSecondary = false) => {
    if (isSecondary) {
      setSelectedTargets({ ...selectedTargets, secondary: targetId });
    } else {
      setSelectedTargets({ ...selectedTargets, primary: targetId });
    }
  };

  // Get valid targets for current role
  const getValidTargets = (): Player[] => {
    if (!currentRole) return [];

    const alivePlayers = players.filter((p) => p.isAlive);

    // Most roles can't target themselves
    const canTargetSelf = ["hero", "butcher", "undertaker"].includes(
      currentRole.role.id
    );

    if (canTargetSelf) {
      return alivePlayers;
    }

    return alivePlayers.filter((p) => p.id !== currentRole.player.id);
  };

  const validTargets = getValidTargets();

  // Check if action can be confirmed
  const canConfirm = () => {
    if (currentRole.role.nightAction === "none") {
      return true; // Roles with no action can be confirmed immediately
    }

    // Roles that need dual targets
    const needsDualTarget = ["gypsy", "cupid", "wagon_driver", "doctor"].includes(
      currentRole.role.id
    );

    if (needsDualTarget) {
      return selectedTargets.primary && selectedTargets.secondary;
    }

    // Most roles need at least one target
    return selectedTargets.primary !== null;
  };

  if (!currentRole) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
          <h3 className="text-xl font-semibold mb-2">Night Phase Complete</h3>
          <p className="text-muted-foreground">
            All roles have taken their actions. Ready to process results.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">
              {currentRoleIndex + 1} / {activeRoles.length}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentRoleIndex + 1) / activeRoles.length) * 100}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Role Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Moon className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <CardTitle className="text-2xl">
                {currentRole.packMembers && currentRole.packMembers.length > 1
                  ? `${currentRole.role.faction} Pack`
                  : currentRole.role.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {currentRole.packMembers && currentRole.packMembers.length > 1 ? (
                  <>
                    Pack Members: {currentRole.packMembers.map((p) => p.name).join(", ")}
                  </>
                ) : (
                  <>Player: {currentRole.player.name}</>
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Role Description */}
          <div className="p-3 bg-muted rounded-md">
            {currentRole.packMembers && currentRole.packMembers.length > 1 ? (
              <p className="text-sm">
                The {currentRole.role.faction} wake up together and choose ONE victim collectively.
              </p>
            ) : (
              <p className="text-sm">{currentRole.role.description}</p>
            )}
          </div>

          {/* Ability Blocked Warning - check if any pack member is blocked */}
          {currentRole.packMembers ? (
            (() => {
              const blockedCount = currentRole.packMembers.filter((p) => p.isAbilityBlocked).length;
              const allBlocked = blockedCount === currentRole.packMembers.length;

              if (blockedCount === 0) return null;

              return (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive font-medium">
                    {allBlocked ? (
                      <>⚠️ ALL pack members are BLOCKED by the Hag! The pack cannot act.</>
                    ) : (
                      <>⚠️ {blockedCount} pack member(s) are BLOCKED by the Hag, but the pack can still act.</>
                    )}
                  </p>
                </div>
              );
            })()
          ) : (
            currentRole.player.isAbilityBlocked && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ This player's ability is BLOCKED by the Hag!
                </p>
              </div>
            )
          )}

          {/* Action Type Indicator */}
          {currentRole.role.nightAction !== "none" && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Action:</span>
              <span className="font-medium capitalize">
                {currentRole.role.nightAction}
              </span>
            </div>
          )}

          {/* Target Selection */}
          {currentRole.role.nightAction !== "none" &&
            !(currentRole.packMembers
              ? currentRole.packMembers.every((p) => p.isAbilityBlocked)
              : currentRole.player.isAbilityBlocked) && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Select Target:</h4>
                <div className="grid grid-cols-1 gap-2 max-h-[40vh] overflow-y-auto">
                  {validTargets.map((target) => (
                    <button
                      key={target.id}
                      onClick={() => handleTargetSelect(target.id)}
                      className={cn(
                        "p-3 rounded-md border text-left transition-all",
                        selectedTargets.primary === target.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:bg-muted"
                      )}
                    >
                      <p className="font-medium">{target.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {target.role.name} ({target.role.faction})
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleConfirmAction}
              disabled={!canConfirm()}
            >
              {isLastRole ? (
                <>
                  Complete Night Phase
                  <CheckCircle className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  Confirm & Next Role
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleSkipRole}
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip This Role
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Night Log */}
      {nightActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tonight's Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
              {nightActions.map((action, idx) => {
                const role = players.find((p) => p.id === action.playerId)?.role;
                const target = players.find((p) => p.id === action.targetId);
                return (
                  <div key={idx} className="text-muted-foreground">
                    {idx + 1}. {role?.name} → {target?.name || "No target"}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
