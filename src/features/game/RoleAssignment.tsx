import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ALL_ROLES, ROLES } from "../../data/roles";
import type { Role } from "../../types";
import { shuffleArray } from "../../lib/utils";
import { Shuffle, UserCog } from "lucide-react";

interface RoleAssignmentProps {
  playerNames: string[];
  onRolesAssigned: (assignments: { name: string; role: Role }[]) => void;
  onBack: () => void;
}

type AssignmentMode = "manual" | "random";

export function RoleAssignment({
  playerNames,
  onRolesAssigned,
  onBack,
}: RoleAssignmentProps) {
  const [mode, setMode] = useState<AssignmentMode | null>(null);
  const [manualAssignments, setManualAssignments] = useState<
    Record<string, Role | null>
  >({});
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  // Manual Mode: Assign specific role to specific player
  const handleManualAssignment = (playerName: string, role: Role) => {
    setManualAssignments({
      ...manualAssignments,
      [playerName]: role,
    });
  };

  const handleManualSubmit = () => {
    const assignments = playerNames.map((name) => {
      const role = manualAssignments[name];
      if (!role) {
        alert(`Please assign a role to ${name}`);
        throw new Error("Incomplete assignments");
      }
      return { name, role };
    });

    onRolesAssigned(assignments);
  };

  // Random Mode: Select roles and randomize
  const toggleRoleSelection = (role: Role) => {
    setSelectedRoles((prev) => {
      const exists = prev.find((r) => r.id === role.id);
      if (exists) {
        return prev.filter((r) => r.id !== role.id);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleRandomAssignment = () => {
    if (selectedRoles.length !== playerNames.length) {
      alert(
        `Please select exactly ${playerNames.length} roles (currently ${selectedRoles.length} selected)`
      );
      return;
    }

    const shuffledRoles = shuffleArray(selectedRoles);
    const assignments = playerNames.map((name, index) => ({
      name,
      role: shuffledRoles[index],
    }));

    onRolesAssigned(assignments);
  };

  // Quick preset for testing
  const handleQuickClassic = () => {
    const classicRoles = [
      ROLES.WEREWOLF,
      ROLES.WEREWOLF,
      ROLES.SEER,
      ROLES.BODYGUARD,
      ROLES.VILLAGER,
      ROLES.VILLAGER,
    ];

    const rolesToUse = classicRoles.slice(0, playerNames.length);

    // Pad with villagers if needed
    while (rolesToUse.length < playerNames.length) {
      rolesToUse.push(ROLES.VILLAGER);
    }

    const shuffledRoles = shuffleArray(rolesToUse);
    const assignments = playerNames.map((name, index) => ({
      name,
      role: shuffledRoles[index],
    }));

    onRolesAssigned(assignments);
  };

  // Mode selection screen
  if (!mode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">
            Role Assignment
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Choose how to assign roles to {playerNames.length} players
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-16 flex flex-col gap-1"
            onClick={() => setMode("manual")}
          >
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              <span className="font-semibold">Manual Assignment</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Assign specific roles to specific players
            </span>
          </Button>

          <Button
            variant="outline"
            className="w-full h-16 flex flex-col gap-1"
            onClick={() => setMode("random")}
          >
            <div className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              <span className="font-semibold">Random Assignment</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Select roles and randomize distribution
            </span>
          </Button>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 text-center">
              Quick Start
            </p>
            <Button
              variant="primary"
              className="w-full h-12"
              onClick={handleQuickClassic}
            >
              Start Classic Game (2 Wolves, Seer, Bodyguard + Villagers)
            </Button>
          </div>

          <Button variant="ghost" className="w-full" onClick={onBack}>
            ← Back to Players
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Manual assignment mode
  if (mode === "manual") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Manual Assignment</CardTitle>
          <p className="text-sm text-muted-foreground">
            Assign a role to each player
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {playerNames.map((name) => (
              <div key={name} className="space-y-2">
                <label className="text-sm font-medium">{name}</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-base"
                  value={manualAssignments[name]?.id || ""}
                  onChange={(e) => {
                    const role = ALL_ROLES.find((r) => r.id === e.target.value);
                    if (role) handleManualAssignment(name, role);
                  }}
                >
                  <option value="">Select a role...</option>
                  {ALL_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} ({role.faction})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="primary"
              className="w-full h-12 text-base font-semibold"
              onClick={handleManualSubmit}
              disabled={
                Object.keys(manualAssignments).length !== playerNames.length
              }
            >
              Confirm Assignments
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setMode(null)}
            >
              ← Back to Mode Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Random assignment mode
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Random Assignment</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select {playerNames.length} roles to distribute randomly
        </p>
        <div className="flex items-center justify-between p-2 bg-background rounded-md border border-border mt-2">
          <span className="text-sm">Selected:</span>
          <span className="font-bold text-primary">
            {selectedRoles.length} / {playerNames.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
          {ALL_ROLES.map((role) => {
            const isSelected = selectedRoles.some((r) => r.id === role.id);
            const count = selectedRoles.filter((r) => r.id === role.id).length;

            return (
              <button
                key={role.id}
                onClick={() => toggleRoleSelection(role)}
                className={`p-3 rounded-md border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <p className="text-sm font-medium truncate">{role.name}</p>
                <p className="text-xs text-muted-foreground">{role.faction}</p>
                {count > 0 && (
                  <span className="text-xs font-bold text-primary">
                    ×{count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            className="w-full h-12 text-base font-semibold"
            onClick={handleRandomAssignment}
            disabled={selectedRoles.length !== playerNames.length}
          >
            Randomize & Start Game
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setMode(null)}>
            ← Back to Mode Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
