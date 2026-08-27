import Phaser from "phaser";
import { Room, getStateCallbacks } from "@colyseus/sdk";

export class HUDManager {
  readonly text: Phaser.GameObjects.Text;
  private room?: Room;

  constructor(scene: Phaser.Scene) {
    this.text = scene.add.text(10, 10, "Connecting...", {
      fontFamily: "monospace", fontSize: "14px", color: "#ffffff", backgroundColor: "#111a14",
      padding: { x: 8, y: 6 },
    }).setScrollFactor(0).setDepth(1000);
  }

  attachRoom(room: Room) { this.room = room; }
  setStatus(status: string) { this.text.setText(status); }

  bindState(room: Room = this.room!) {
    this.room = room;
    const $ = getStateCallbacks(room);
    $(room.state).players.onAdd((player: any) => { this.update(); $(player).onChange(() => this.update()); });
    $(room.state).players.onRemove(() => this.update());
    this.update();
  }

  update() {
    if (!this.room) return;
    const count = this.room.state.players.size;
    const me: any = this.room.state.players.get(this.room.sessionId);
    this.text.setText(`Players ${count}/6  |  Gold ${Math.floor(me?.resources ?? 0)}  |  Score ${me?.score ?? 0}\nTap=select/move  •  Drag=box select  •  Buttons=actions`);
  }
}
