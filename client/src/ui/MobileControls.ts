import Phaser from "phaser";

export interface MobileControlActions {
  spawnUnit: () => void;
  moveSelected: () => void;
  clearSelection: () => void;
}

export class MobileControls {
  private root: HTMLDivElement;
  private actions: MobileControlActions;

  constructor(actions: MobileControlActions) {
    this.actions = actions;
    this.root = document.createElement("div");
    this.root.className = "mobile-controls";
    this.root.innerHTML = `
      <button data-action="spawn" aria-label="Spawn unit">＋</button>
      <button data-action="move" aria-label="Move selected units">➤</button>
      <button data-action="clear" aria-label="Clear selection">×</button>
    `;
    document.body.appendChild(this.root);
    this.root.querySelector('[data-action="spawn"]')?.addEventListener("pointerdown", e => {
      e.preventDefault();
      this.actions.spawnUnit();
    });
    this.root.querySelector('[data-action="move"]')?.addEventListener("pointerdown", e => {
      e.preventDefault();
      this.actions.moveSelected();
    });
    this.root.querySelector('[data-action="clear"]')?.addEventListener("pointerdown", e => {
      e.preventDefault();
      this.actions.clearSelection();
    });
  }

  setVisible(visible: boolean) {
    this.root.classList.toggle("is-visible", visible);
  }

  destroy() {
    this.root.remove();
  }
}

export function installMobileStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .mobile-controls { display:none; position:fixed; right:16px; bottom:max(16px, env(safe-area-inset-bottom)); z-index:2000; gap:10px; touch-action:none; }
    .mobile-controls.is-visible { display:flex; }
    .mobile-controls button { width:56px; height:56px; border:1px solid rgba(255,255,255,.25); border-radius:16px; background:rgba(20,28,24,.88); color:#fff; font:700 25px system-ui; box-shadow:0 4px 16px rgba(0,0,0,.35); touch-action:manipulation; }
    .mobile-controls button:active { transform:scale(.94); background:rgba(60,80,60,.95); }
    @media (min-width: 700px) and (pointer:fine) { .mobile-controls { display:none !important; } }
    @media (max-width: 699px), (pointer:coarse) {
      .mobile-controls { display:flex; }
      body { overscroll-behavior:none; -webkit-user-select:none; user-select:none; }
    }
  `;
  document.head.appendChild(style);
}
