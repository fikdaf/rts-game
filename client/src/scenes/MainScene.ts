import Phaser from "phaser";
import { CameraController } from "../camera/CameraController";
import { InputController } from "../input/InputController";
import { NetworkManager } from "../network/NetworkManager";
import { UnitRenderer } from "../rendering/UnitRenderer";
import { SelectionManager } from "../selection/SelectionManager";
import { HUDManager } from "../ui/HUDManager";

export class MainScene extends Phaser.Scene {
  private network!: NetworkManager;
  private renderer!: UnitRenderer;
  private selection!: SelectionManager;
  private inputController!: InputController;
  private hud!: HUDManager;

  constructor() {
    super("MainScene");
  }

  async create() {
    new CameraController(this).setup();
    this.network = new NetworkManager();
    this.hud = new HUDManager(this);

    try {
      const room = await this.network.connect(`Player-${Math.floor(Math.random() * 1000)}`);
      this.hud.attachRoom(room);
      this.renderer = new UnitRenderer(this, room);
      this.selection = new SelectionManager(this, room, this.renderer.sprites);
      this.renderer.bindState();
      this.hud.bindState();
      this.inputController = new InputController(this, this.selection, {
        moveSelected: (x, y) => {
          if (this.selection.selectedUnitIds.size === 0) return;
          this.network.send("move_units", {
            unitIds: Array.from(this.selection.selectedUnitIds),
            x,
            y,
          });
        },
        spawnUnit: () => this.network.send("spawn_unit"),
      });
      this.inputController.bind();
    } catch (err) {
      this.hud.setStatus(`Connection failed: ${err}`);
      console.error(err);
    }
  }
}
