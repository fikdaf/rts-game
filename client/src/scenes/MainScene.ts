import Phaser from "phaser";
import { Client, Room } from "colyseus.js";

const SERVER_URL = "ws://localhost:2567";

interface UnitSprite {
  sprite: Phaser.GameObjects.Arc;
  label?: Phaser.GameObjects.Text;
}

export class MainScene extends Phaser.Scene {
  private client!: Client;
  private room!: Room;
  private unitSprites = new Map<string, UnitSprite>();
  private selectedUnitIds = new Set<string>();
  private selectionRect?: Phaser.GameObjects.Rectangle;
  private selectStart?: { x: number; y: number };
  private hudText!: Phaser.GameObjects.Text;

  constructor() {
    super("MainScene");
  }

  async create() {
    this.cameras.main.setBackgroundColor("#1b2b1b");
    this.hudText = this.add.text(10, 10, "Connecting...", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#ffffff",
    }).setScrollFactor(0).setDepth(1000);

    this.client = new Client(SERVER_URL);

    try {
      this.room = await this.client.joinOrCreate("rts_room", {
        name: `Player-${Math.floor(Math.random() * 1000)}`,
      });
      this.hudText.setText(`Connected. Session: ${this.room.sessionId}`);
      this.bindRoomEvents();
    } catch (err) {
      this.hudText.setText(`Connection failed: ${err}`);
      console.error(err);
      return;
    }

    this.setupInput();

    // Simple test button: press SPACE to spawn a unit
    this.input.keyboard?.on("keydown-SPACE", () => {
      this.room.send("spawn_unit");
    });
  }

  private bindRoomEvents() {
    this.room.state.units.onAdd((unit: any, id: string) => {
      const isMine = unit.ownerId === this.room.sessionId;
      const circle = this.add.circle(unit.x, unit.y, 10, isMine ? 0x4caf50 : 0xe53935);
      circle.setStrokeStyle(2, 0xffffff);
      this.unitSprites.set(id, { sprite: circle });

      unit.onChange(() => {
        circle.setPosition(unit.x, unit.y);
      });
    });

    this.room.state.units.onRemove((_unit: any, id: string) => {
      const entry = this.unitSprites.get(id);
      entry?.sprite.destroy();
      entry?.label?.destroy();
      this.unitSprites.delete(id);
      this.selectedUnitIds.delete(id);
    });

    this.room.state.players.onAdd((player: any) => {
      this.updateHud();
      player.onChange(() => this.updateHud());
    });

    this.room.state.players.onRemove(() => this.updateHud());
  }

  private updateHud() {
    const count = this.room.state.players.size;
    const me = this.room.state.players.get(this.room.sessionId);
    this.hudText.setText(
      `Players: ${count}/6 | Resources: ${me?.resources ?? "-"} | SPACE = spawn unit | Drag = select | Right-click = move`
    );
  }

  private setupInput() {
    this.input.mouse?.disableContextMenu();

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        // Move command for selected units
        if (this.selectedUnitIds.size > 0) {
          this.room.send("move_units", {
            unitIds: Array.from(this.selectedUnitIds),
            x: pointer.worldX,
            y: pointer.worldY,
          });
        }
        return;
      }
      this.selectStart = { x: pointer.worldX, y: pointer.worldY };
      this.selectionRect?.destroy();
      this.selectionRect = this.add.rectangle(pointer.worldX, pointer.worldY, 1, 1, 0x00ff00, 0.15);
      this.selectionRect.setStrokeStyle(1, 0x00ff00);
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!this.selectStart || !this.selectionRect) return;
      const x = Math.min(this.selectStart.x, pointer.worldX);
      const y = Math.min(this.selectStart.y, pointer.worldY);
      const w = Math.abs(pointer.worldX - this.selectStart.x);
      const h = Math.abs(pointer.worldY - this.selectStart.y);
      this.selectionRect.setPosition(x + w / 2, y + h / 2);
      this.selectionRect.setSize(w, h);
    });

    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!this.selectStart) return;
      const x1 = Math.min(this.selectStart.x, pointer.worldX);
      const x2 = Math.max(this.selectStart.x, pointer.worldX);
      const y1 = Math.min(this.selectStart.y, pointer.worldY);
      const y2 = Math.max(this.selectStart.y, pointer.worldY);

      this.selectedUnitIds.clear();
      this.unitSprites.forEach((entry, id) => {
        const unit = this.room.state.units.get(id);
        if (!unit || unit.ownerId !== this.room.sessionId) return;
        const inBox = unit.x >= x1 && unit.x <= x2 && unit.y >= y1 && unit.y <= y2;
        entry.sprite.setStrokeStyle(2, inBox ? 0xffeb3b : 0xffffff);
        if (inBox) this.selectedUnitIds.add(id);
      });

      this.selectionRect?.destroy();
      this.selectionRect = undefined;
      this.selectStart = undefined;
    });
  }
}
