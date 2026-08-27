import Phaser from "phaser";
import { Room, getStateCallbacks } from "@colyseus/sdk";
import { UnitSprite } from "../types/GameTypes";

export class UnitRenderer {
  readonly sprites = new Map<string, UnitSprite>();
  private buildings = new Map<string, Phaser.GameObjects.Rectangle>();

  constructor(private scene: Phaser.Scene, private room: Room) {}

  bindState() {
    const $ = getStateCallbacks(this.room);
    $(this.room.state).units.onAdd((unit: any, id: string) => {
      const mine = unit.ownerId === this.room.sessionId;
      const circle = this.scene.add.circle(unit.x, unit.y, 11, mine ? 0x4caf50 : 0xe53935).setDepth(10);
      circle.setStrokeStyle(2, 0xffffff);
      this.sprites.set(id, { sprite: circle });
      $(unit).onChange(() => {
        circle.setPosition(unit.x, unit.y);
        circle.setScale(Math.max(.6, unit.hp / unit.maxHp));
      });
    });
    $(this.room.state).units.onRemove((_unit: any, id: string) => this.remove(id));
    $(this.room.state).buildings?.onAdd((building: any, id: string) => {
      const mine = building.ownerId === this.room.sessionId;
      const box = this.scene.add.rectangle(building.x, building.y, 48, 48, mine ? 0x4caf50 : 0xe53935, .55).setDepth(5);
      box.setStrokeStyle(3, 0xffffff);
      this.buildings.set(id, box);
      $(building).onChange(() => box.setPosition(building.x, building.y));
    });
    $(this.room.state).buildings?.onRemove((_building: any, id: string) => {
      this.buildings.get(id)?.destroy();
      this.buildings.delete(id);
    });
  }

  remove(id: string) {
    const entry = this.sprites.get(id);
    entry?.sprite.destroy();
    entry?.label?.destroy();
    this.sprites.delete(id);
  }
}
