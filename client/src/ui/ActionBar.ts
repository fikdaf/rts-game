import Phaser from "phaser";

export interface ActionBarActions {
  spawn: () => void;
  clear: () => void;
}

export class ActionBar {
  private buttons: Phaser.GameObjects.Text[] = [];

  constructor(private scene: Phaser.Scene, private actions: ActionBarActions) {}

  create() {
    const camera = this.scene.cameras.main;
    const items = [
      { label: "SPAWN", action: this.actions.spawn },
      { label: "CLEAR", action: this.actions.clear },
    ];

    items.forEach((item, index) => {
      const button = this.scene.add.text(16 + index * 100, camera.height - 58, item.label, {
        fontFamily: "monospace",
        fontSize: "15px",
        backgroundColor: "#202820",
        padding: { x: 12, y: 10 },
      }).setScrollFactor(0).setDepth(1100).setInteractive({ useHandCursor: true });

      button.on("pointerdown", item.action);
      this.buttons.push(button);
    });

    this.scene.scale.on("resize", this.layout, this);
    this.layout(this.scene.scale.gameSize);
  }

  private layout(size: Phaser.Structs.Size) {
    this.buttons.forEach((button, index) => button.setPosition(16 + index * 100, size.height - 58));
  }

  destroy() {
    this.scene.scale.off("resize", this.layout, this);
    this.buttons.forEach((button) => button.destroy());
    this.buttons = [];
  }
}
