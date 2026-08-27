import Phaser from "phaser";
import { SelectionManager } from "../selection/SelectionManager";

export interface InputActions {
  moveSelected: (x: number, y: number) => void;
  spawnUnit: () => void;
}

export class InputController {
  private touchStart?: { x: number; y: number; time: number };
  private touchMoved = false;

  constructor(private scene: Phaser.Scene, private selection: SelectionManager, private actions: InputActions) {}

  bind() {
    this.scene.input.mouse?.disableContextMenu();
    this.scene.input.on("pointerdown", this.onPointerDown, this);
    this.scene.input.on("pointermove", this.onPointerMove, this);
    this.scene.input.on("pointerup", this.onPointerUp, this);
    this.scene.input.keyboard?.on("keydown-SPACE", this.actions.spawnUnit);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (pointer.rightButtonDown()) {
      this.actions.moveSelected(pointer.worldX, pointer.worldY);
      return;
    }

    if (pointer.pointerType === "touch") {
      this.touchStart = { x: pointer.x, y: pointer.y, time: performance.now() };
      this.touchMoved = false;
      this.selection.begin(pointer);
      return;
    }

    this.selection.begin(pointer);
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (pointer.pointerType === "touch" && this.touchStart) {
      const dx = pointer.x - this.touchStart.x;
      const dy = pointer.y - this.touchStart.y;
      this.touchMoved = Math.hypot(dx, dy) > 10;
    }
    this.selection.update(pointer);
  }

  private onPointerUp(pointer: Phaser.Input.Pointer) {
    if (pointer.pointerType === "touch" && this.touchStart) {
      const duration = performance.now() - this.touchStart.time;
      const moved = this.touchMoved;
      this.selection.finish(pointer);
      this.touchStart = undefined;

      // A short tap on the world acts as a move command when units are selected.
      if (!moved && duration < 450 && this.selection.selectedUnitIds.size > 0) {
        this.actions.moveSelected(pointer.worldX, pointer.worldY);
      }
      return;
    }

    this.selection.finish(pointer);
  }

  destroy() {
    this.scene.input.off("pointerdown", this.onPointerDown, this);
    this.scene.input.off("pointermove", this.onPointerMove, this);
    this.scene.input.off("pointerup", this.onPointerUp, this);
    this.scene.input.keyboard?.off("keydown-SPACE", this.actions.spawnUnit);
  }
}
