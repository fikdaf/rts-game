import Phaser from "phaser";
import { CameraController } from "../camera/CameraController";
import { InputController } from "../input/InputController";
import { NetworkManager } from "../network/NetworkManager";
import { UnitRenderer } from "../rendering/UnitRenderer";
import { SelectionManager } from "../selection/SelectionManager";
import { HUDManager } from "../ui/HUDManager";
import { MobileControls, installMobileStyles } from "../ui/MobileControls";

export class MainScene extends Phaser.Scene {
  private network!: NetworkManager;
  private renderer!: UnitRenderer;
  private selection!: SelectionManager;
  private inputController!: InputController;
  private hud!: HUDManager;
  private mobileControls!: MobileControls;

  constructor() {
    super("MainScene");
  }

  async create() {
    new CameraController(this).setup();
    this.network = new NetworkManager();
    this.hud = new HUDManager(this);
    installMobileStyles();

    try {
      const room = await this.network.connect(`Player-${Math.floor(Math.random() * 1000)}`);
      this.hud.attachRoom(room);
      this.renderer = new UnitRenderer(this, room);
      this.selection = new SelectionManager(this, room, this.renderer.sprites);
      this.renderer.bindState();
      this.hud.bindState();

      const moveSelected = (x: number, y: number) => {
        if (this.selection.selectedUnitIds.size === 0) return;
        this.network.send("move_units", {
          unitIds: Array.from(this.selection.selectedUnitIds),
          x,
          y,
        });
      };

      this.inputController = new InputController(this, this.selection, {
        moveSelected,
        spawnUnit: () => this.network.send("spawn_unit"),
      });
      this.inputController.bind();

      this.mobileControls = new MobileControls({
        spawnUnit: () => this.network.send("spawn_unit"),
        moveSelected: () => {
          const pointer = this.input.activePointer;
          if (this.selection.selectedUnitIds.size > 0) moveSelected(pointer.worldX, pointer.worldY);
        },
        clearSelection: () => this.selection.clear(),
      });
      this.mobileControls.setVisible(true);
    } catch (err) {
      this.hud.setStatus(`Connection failed: ${err}`);
      console.error(err);
    }
  }

  shutdown() {
    this.inputController?.destroy();
    this.mobileControls?.destroy();
  }
}
