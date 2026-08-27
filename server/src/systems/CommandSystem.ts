import { MapSchema } from "@colyseus/schema";
import { Unit } from "../schema/GameState";

export class CommandSystem {
  move(units: MapSchema<Unit>, sessionId: string, unitIds: string[], x: number, y: number) {
    unitIds.forEach((id) => {
      const unit = units.get(id);
      if (!unit || unit.ownerId !== sessionId) return;
      unit.targetX = x;
      unit.targetY = y;
    });
  }
}
