import { useGameStore } from "./store/useGameStore";
import { ROLES, ALL_ROLES } from "./data/roles";

function App() {
  const { phase, players, addPlayer } = useGameStore();

  const handleAddTestPlayer = () => {
    addPlayer("Test Player", ROLES.SEER);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Wolfed Moderator Assistant</h1>
          <p className="text-muted-foreground">
            Foundation Phase - Data Models Complete
          </p>
        </header>

        <div className="grid gap-6">
          {/* Game State */}
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Game State</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Phase:</span> {phase}
              </p>
              <p>
                <span className="font-medium">Players:</span> {players.length}
              </p>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>
            <button
              onClick={handleAddTestPlayer}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
            >
              Add Test Player (Seer)
            </button>
          </div>

          {/* Roles Registry */}
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Roles Registry ({ALL_ROLES.length} roles)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {ALL_ROLES.map((role) => (
                <div
                  key={role.id}
                  className="bg-background p-3 rounded border border-border"
                >
                  <p className="font-medium text-sm">{role.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Wake: {role.wakeOrder ?? "None"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {role.faction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Players List */}
          {players.length > 0 && (
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Players</h2>
              <div className="space-y-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-background p-3 rounded border border-border"
                  >
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {player.role.name} ({player.role.faction})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Status: {player.isAlive ? "Alive" : "Dead"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
