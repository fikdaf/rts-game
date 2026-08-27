import Phaser from "phaser";
import { Room } from "@colyseus/sdk";
import { UnitSprite } from "../types/GameTypes";

export class UnitRenderer {
  readonly sprites = new Map<string, UnitSprite>();

  constructor(private scene: Phaser.Scene, private room: Room) {}

  bindState() {
    const $ = requireStateCallbacks(this.room);
    $(this.room.state).units.onAdd((unit: any, id: string) => {
      const isMine = unit.ownerId === this.room.sessionId;
      const circle = this.scene.add.circle(unit.x, unit.y, 10, isMine ? 0x4caf50 : 0xe53935);
      circle.setStrokeStyle(2, 0xffffff);
      this.sprites.set(id, { sprite: circle });
      $(unit).onChange(() => circle.setPosition(unit.x, unit.y));
    });
    $(this.room.state).units.onRemove((_unit: any, id: string) => this.remove(id));
  }

  remove(id: string) {
    const entry = this.sprites.get(id);
    entry?.sprite.destroy();
    entry?.label?.destroy();
    this.sprites.delete(id);
  }
}

function requireStateCallbacks(room: Room) {
  // Kept local so rendering owns state subscription details.
  return require("@colyseus/sdk").getStateCallbacks(room);
}
