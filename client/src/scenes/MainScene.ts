import Phaser from "phaser";
import { CameraController } from "../camera/CameraController";
import { InputController } from "../input/InputController";
import { NetworkManager } from "../network/NetworkManager";
import { UnitRenderer } from "../rendering/UnitRenderer";
import { SelectionManager } from "../selection/SelectionManager";
import { HUDManager } from "../ui/HUDManager";
import { MobileControls, installMobileStyles } from "../ui/MobileControls";
import { ActionBar } from "../ui/ActionBar";

export class MainScene extends Phaser.Scene {
  private network!: NetworkManager;
  private renderer!: UnitRenderer;
  private selection!: SelectionManager;
  private inputController!: InputController;
  private hud!: HUDManager;
  private mobileControls?: MobileControls;
  private actionBar?: ActionBar;

  constructor() { super("MainScene"); }

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
        const ids = Array.from(this.selection.selectedUnitIds);
        if (!ids.length) return;
        this.network.send("move_units", { unitIds: ids, x, y });
      };
      const buildBase = () => {
        const p = this.input.activePointer;
        this.network.send("build_base", { x: p.worldX, y: p.worldY });
      };

      this.inputController = new InputController(this, this.selection, {
        moveSelected,
        spawnUnit: () => this.network.send("spawn_unit"),
      });
      this.inputController.bind();

      this.mobileControls = new MobileControls({
        spawnUnit: () => this.network.send("spawn_unit"),
        moveSelected: () => moveSelected(this.input.activePointer.worldX, this.input.activePointer.worldY),
        buildBase,
        clearSelection: () => this.selection.clear(),
      });
      this.mobileControls.setVisible(true);

      this.actionBar = new ActionBar(this, {
        spawn: () => this.network.send("spawn_unit"),
        clear: () => this.selection.clear(),
      });
      this.actionBar.create();
    } catch (err) {
      this.hud.setStatus(`Connection failed: ${err}`);
      console.error(err);
    }
  }

  shutdown() {
    this.inputController?.destroy();
    this.mobileControls?.destroy();
    this.actionBar?.destroy();
  }
}
