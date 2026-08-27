import { Room, Client } from "colyseus";
import { GameState, Player, Unit, Building } from "../schema/GameState.js";

const MAX_PLAYERS = 6;
const TICK_MS = 1000 / 20;
const SPAWN_COST = 10;
const BUILD_COST = 50;
let unitCounter = 0;
let buildingCounter = 0;

export class RTSRoom extends Room {
  state = new GameState();
  maxClients = MAX_PLAYERS;

  onCreate() {
    this.state.matchStartedAt = Date.now();
    this.onMessage("move_units", (client, message: { unitIds: string[]; x: number; y: number }) => {
      if (!Number.isFinite(message.x) || !Number.isFinite(message.y)) return;
      for (const id of message.unitIds ?? []) {
        const unit = this.state.units.get(id);
        if (unit?.ownerId === client.sessionId) {
          unit.targetX = Math.max(0, Math.min(this.state.mapWidth, message.x));
          unit.targetY = Math.max(0, Math.min(this.state.mapHeight, message.y));
        }
      }
    });

    this.onMessage("spawn_unit", client => {
      const player = this.state.players.get(client.sessionId);
      if (!player || player.resources < SPAWN_COST) return;
      player.resources -= SPAWN_COST;
      const unit = new Unit();
      unit.id = `u_${unitCounter++}`;
      unit.ownerId = client.sessionId;
      unit.x = 100 + Math.random() * 1400;
      unit.y = 100 + Math.random() * 1000;
      unit.targetX = unit.x;
      unit.targetY = unit.y;
      this.state.units.set(unit.id, unit);
    });

    this.onMessage("build_base", (client, message: { x: number; y: number }) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || player.resources < BUILD_COST || !Number.isFinite(message.x) || !Number.isFinite(message.y)) return;
      player.resources -= BUILD_COST;
      const building = new Building();
      building.id = `b_${buildingCounter++}`;
      building.ownerId = client.sessionId;
      building.x = Math.max(40, Math.min(this.state.mapWidth - 40, message.x));
      building.y = Math.max(40, Math.min(this.state.mapHeight - 40, message.y));
      this.state.buildings.set(building.id, building);
    });

    this.setSimulationInterval(() => this.tick(TICK_MS / 1000), TICK_MS);
  }

  tick(dt: number) {
    this.state.players.forEach(player => {
      player.resources = Math.min(500, player.resources + 0.5 * dt);
    });

    this.state.units.forEach(unit => {
      const dx = unit.targetX - unit.x;
      const dy = unit.targetY - unit.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        const moveDist = Math.min(unit.speed * dt, dist);
        unit.x += (dx / dist) * moveDist;
        unit.y += (dy / dist) * moveDist;
      }
      unit.attackCooldown = Math.max(0, unit.attackCooldown - dt);
    });

    this.state.units.forEach(attacker => {
      if (attacker.attackCooldown > 0) return;
      let target: Unit | undefined;
      let best = Infinity;
      this.state.units.forEach(candidate => {
        if (candidate.ownerId === attacker.ownerId || candidate.hp <= 0) return;
        const d = Math.hypot(candidate.x - attacker.x, candidate.y - attacker.y);
        if (d <= attacker.attackRange && d < best) { best = d; target = candidate; }
      });
      if (target) {
        target.hp -= attacker.damage;
        attacker.attackCooldown = 0.75;
        if (target.hp <= 0) {
          const victimOwner = this.state.players.get(target.ownerId);
          const attackerOwner = this.state.players.get(attacker.ownerId);
          if (attackerOwner) attackerOwner.score += 1;
          this.state.units.delete(target.id);
          if (victimOwner) victimOwner.score = Math.max(0, victimOwner.score - 1);
        }
      }
    });
  }

  onJoin(client: Client, options: { name?: string }) {
    const player = new Player();
    player.sessionId = client.sessionId;
    player.name = options?.name || `Player-${client.sessionId.slice(0, 4)}`;
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (player) player.connected = false;
    this.clock.setTimeout(() => {
      const p = this.state.players.get(client.sessionId);
      if (p && !p.connected) {
        this.state.players.delete(client.sessionId);
        this.state.units.forEach((unit, id) => { if (unit.ownerId === client.sessionId) this.state.units.delete(id); });
        this.state.buildings.forEach((building, id) => { if (building.ownerId === client.sessionId) this.state.buildings.delete(id); });
      }
    }, 15000);
  }

  onDispose() { console.log(`Room ${this.roomId} disposed`); }
}
