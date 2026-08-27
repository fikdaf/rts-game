import Phaser from "phaser";
import { Room } from "@colyseus/sdk";
import { UnitSprite, SelectionPoint } from "../types/GameTypes";

export class SelectionManager {
  readonly selectedUnitIds = new Set<string>();
  private selectionRect?: Phaser.GameObjects.Rectangle;
  private selectStart?: SelectionPoint;

  constructor(private scene: Phaser.Scene, private room: Room, private sprites: Map<string, UnitSprite>) {}

  begin(pointer: Phaser.Input.Pointer) {
    this.selectStart = { x: pointer.worldX, y: pointer.worldY };
    this.selectionRect?.destroy();
    this.selectionRect = this.scene.add.rectangle(pointer.worldX, pointer.worldY, 1, 1, 0x00ff00, 0.15);
    this.selectionRect.setStrokeStyle(1, 0x00ff00);
  }

  update(pointer: Phaser.Input.Pointer) {
    if (!this.selectStart || !this.selectionRect) return;
    const x = Math.min(this.selectStart.x, pointer.worldX);
    const y = Math.min(this.selectStart.y, pointer.worldY);
    const w = Math.abs(pointer.worldX - this.selectStart.x);
    const h = Math.abs(pointer.worldY - this.selectStart.y);
    this.selectionRect.setPosition(x + w / 2, y + h / 2).setSize(w, h);
  }

  finish(pointer: Phaser.Input.Pointer) {
    if (!this.selectStart) return;
    const x1 = Math.min(this.selectStart.x, pointer.worldX);
    const x2 = Math.max(this.selectStart.x, pointer.worldX);
    const y1 = Math.min(this.selectStart.y, pointer.worldY);
    const y2 = Math.max(this.selectStart.y, pointer.worldY);

    this.selectedUnitIds.clear();
    this.sprites.forEach((entry, id) => {
      const unit = this.room.state.units.get(id);
      if (!unit || unit.ownerId !== this.room.sessionId) return;
      const inBox = unit.x >= x1 && unit.x <= x2 && unit.y >= y1 && unit.y <= y2;
      entry.sprite.setStrokeStyle(2, inBox ? 0xffeb3b : 0xffffff);
      if (inBox) this.selectedUnitIds.add(id);
    });

    this.selectionRect?.destroy();
    this.selectionRect = undefined;
    this.selectStart = undefined;
  }

  unitAt(x: number, y: number, radius = 18): boolean {
    for (const [id, entry] of this.sprites) {
      const unit = this.room.state.units.get(id);
      if (!unit || unit.ownerId !== this.room.sessionId) continue;
      if (Math.hypot(unit.x - x, unit.y - y) <= radius) return true;
    }
    return false;
  }

  clear() {
    this.selectedUnitIds.forEach(id => this.sprites.get(id)?.sprite.setStrokeStyle(2, 0xffffff));
    this.selectedUnitIds.clear();
    this.selectionRect?.destroy();
    this.selectionRect = undefined;
    this.selectStart = undefined;
  }
}
