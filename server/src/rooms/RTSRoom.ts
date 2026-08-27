import { Room, Client } from "colyseus";
import { GameState, Player, Unit } from "../schema/GameState.js";

const MAX_PLAYERS = 6;
const TICK_MS = 1000 / 20; // 20 ticks per second, authoritative

let unitCounter = 0;

export class RTSRoom extends Room {
  state = new GameState();
  maxClients = MAX_PLAYERS;

  onCreate() {
    this.state.matchStartedAt = Date.now();

    // Movement command from a client
    this.onMessage("move_units", (client, message: { unitIds: string[]; x: number; y: number }) => {
      const { unitIds, x, y } = message;
      for (const id of unitIds) {
        const unit = this.state.units.get(id);
        if (unit && unit.ownerId === client.sessionId) {
          unit.targetX = x;
          unit.targetY = y;
        }
      }
    });

    // Spawn a unit for testing (in a real game this comes from a "train unit" building action)
    this.onMessage("spawn_unit", (client) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || player.resources < 10) return;

      player.resources -= 10;
      const unit = new Unit();
      unit.id = `u_${unitCounter++}`;
      unit.ownerId = client.sessionId;
      unit.x = Math.random() * this.state.mapWidth;
      unit.y = Math.random() * this.state.mapHeight;
      unit.targetX = unit.x;
      unit.targetY = unit.y;
      this.state.units.set(unit.id, unit);
    });

    // Authoritative simulation loop
    this.setSimulationInterval(() => this.tick(TICK_MS / 1000), TICK_MS);
  }

  tick(dt: number) {
    this.state.units.forEach((unit: Unit) => {
      const dx = unit.targetX - unit.x;
      const dy = unit.targetY - unit.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        const step = unit.speed * dt;
        const moveDist = Math.min(step, dist);
        unit.x += (dx / dist) * moveDist;
        unit.y += (dy / dist) * moveDist;
      }
    });
  }

  onJoin(client: Client, options: { name?: string }) {
    const player = new Player();
    player.sessionId = client.sessionId;
    player.name = options?.name || `Player-${client.sessionId.slice(0, 4)}`;
    this.state.players.set(client.sessionId, player);
    console.log(`${player.name} joined (${this.state.players.size}/${MAX_PLAYERS})`);
  }

  onLeave(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (player) player.connected = false;
    // Keep player + units around briefly in case of reconnect; remove after grace period
    this.clock.setTimeout(() => {
      const p = this.state.players.get(client.sessionId);
      if (p && !p.connected) {
        this.state.players.delete(client.sessionId);
        this.state.units.forEach((unit: Unit, id: string) => {
          if (unit.ownerId === client.sessionId) this.state.units.delete(id);
        });
      }
    }, 15000);
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposed`);
  }
}
