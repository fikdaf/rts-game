export interface MobileActionBarActions {
  spawnUnit: () => void;
  clearSelection: () => void;
}

export class MobileActionBar {
  private root: HTMLDivElement;

  constructor(actions: MobileActionBarActions) {
    this.root = document.createElement("div");
    this.root.className = "mobile-action-bar";
    this.root.innerHTML = `
      <button data-action="spawn">Spawn</button>
      <button data-action="clear">Clear</button>
    `;
    document.body.appendChild(this.root);
    this.root.querySelector('[data-action="spawn"]')?.addEventListener("pointerdown", e => {
      e.preventDefault();
      actions.spawnUnit();
    });
    this.root.querySelector('[data-action="clear"]')?.addEventListener("pointerdown", e => {
      e.preventDefault();
      actions.clearSelection();
    });
  }

  destroy() { this.root.remove(); }
}
