import Phaser from "phaser";

export class CameraController {
  constructor(private scene: Phaser.Scene) {}

  setup() {
    this.scene.cameras.main.setBackgroundColor("#1b2b1b");
  }
}
