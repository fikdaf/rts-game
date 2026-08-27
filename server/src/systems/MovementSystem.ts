import { MapSchema } from "@colyseus/schema";
import { Unit } from "../schema/GameState";

export class MovementSystem {
  tick(units: MapSchema<Unit>, dt: number) {
    units.forEach((unit) => {
      const dx = unit.targetX - unit.x;
      const dy = unit.targetY - unit.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 1) return;

      const step = Math.min(unit.speed * dt, distance);
      unit.x += (dx / distance) * step;
      unit.y += (dy / distance) * step;
    });
  }
}
