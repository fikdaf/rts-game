import Phaser from "phaser";

export class FogOfWar {
  private graphics: Phaser.GameObjects.Graphics;
  constructor(private scene: Phaser.Scene, private width: number, private height: number) {
    this.graphics = scene.add.graphics().setDepth(900).setScrollFactor(0);
  }
  render(visiblePoints: Array<{ x: number; y: number; radius: number }>) {
    const camera = this.scene.cameras.main;
    this.graphics.clear().fillStyle(0x000000, .72).fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    this.graphics.setBlendMode(Phaser.BlendModes.DESTINATION_OUT);
    for (const p of visiblePoints) this.graphics.fillCircle(p.x - camera.scrollX, p.y - camera.scrollY, p.radius);
    this.graphics.setBlendMode(Phaser.BlendModes.NORMAL);
  }
  destroy() { this.graphics.destroy(); }
}
