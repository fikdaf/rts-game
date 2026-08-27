import Phaser from "phaser";
import { Room, getStateCallbacks } from "@colyseus/sdk";

export class HUDManager {
  readonly text: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene, private room: Room) {
    this.text = scene.add.text(10, 10, "Connecting...", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#ffffff",
    }).setScrollFactor(0).setDepth(1000);
  }

  setStatus(status: string) {
    this.text.setText(status);
  }

  bindState() {
    const $ = getStateCallbacks(this.room);
    $(this.room.state).players.onAdd((player: any) => {
      this.update();
      $(player).onChange(() => this.update());
    });
    $(this.room.state).players.onRemove(() => this.update());
    this.update();
  }

  update() {
    const count = this.room.state.players.size;
    const me = this.room.state.players.get(this.room.sessionId);
    this.text.setText(
      `Players: ${count}/6 | Resources: ${me?.resources ?? "-"} | SPACE = spawn unit | Drag = select | Right-click = move`
    );
  }
}
