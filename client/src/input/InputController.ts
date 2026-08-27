import Phaser from "phaser";
import { SelectionManager } from "../selection/SelectionManager";

export interface InputActions {
  moveSelected: (x: number, y: number) => void;
  spawnUnit: () => void;
}

export class InputController {
  constructor(private scene: Phaser.Scene, private selection: SelectionManager, private actions: InputActions) {}

  bind() {
    this.scene.input.mouse?.disableContextMenu();

    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        this.actions.moveSelected(pointer.worldX, pointer.worldY);
        return;
      }
      this.selection.begin(pointer);
    });

    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => this.selection.update(pointer));
    this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => this.selection.finish(pointer));
    this.scene.input.keyboard?.on("keydown-SPACE", this.actions.spawnUnit);
  }

  destroy() {
    this.scene.input.removeAllListeners();
    this.scene.input.keyboard?.removeAllListeners("keydown-SPACE");
  }
}
