import { MapSchema } from "@colyseus/schema";
import { Unit } from "../schema/GameState";

export interface CombatTickResult {
  deadUnitIds: string[];
}

export class CombatSystem {
  tick(units: MapSchema<Unit>): CombatTickResult {
    const deadUnitIds: string[] = [];
    units.forEach((unit, id) => {
      if (unit.hp <= 0) deadUnitIds.push(id);
    });
    return { deadUnitIds };
  }
}
