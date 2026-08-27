export interface MobileControlActions {
  spawnUnit: () => void;
  clearSelection: () => void;
}

export class MobileControlPanel {
  private root: HTMLDivElement;

  constructor(actions: MobileControlActions) {
    this.root = document.createElement("div");
    this.root.className = "mobile-control-panel";
    this.root.innerHTML = '<button data-action="spawn" aria-label="Spawn unit">＋</button><button data-action="clear" aria-label="Clear selection">×</button>';
    document.body.appendChild(this.root);
    this.root.querySelector('[data-action="spawn"]')?.addEventListener("pointerdown", e => { e.preventDefault(); actions.spawnUnit(); });
    this.root.querySelector('[data-action="clear"]')?.addEventListener("pointerdown", e => { e.preventDefault(); actions.clearSelection(); });
  }

  destroy() { this.root.remove(); }
}

export function installMobileControlStyles() {
  const style = document.createElement("style");
  style.textContent = `.mobile-control-panel{display:flex;position:fixed;right:16px;bottom:max(16px,env(safe-area-inset-bottom));z-index:2000;gap:10px;touch-action:none}.mobile-control-panel button{width:56px;height:56px;border:1px solid rgba(255,255,255,.25);border-radius:16px;background:rgba(20,28,24,.88);color:#fff;font:700 25px system-ui;box-shadow:0 4px 16px rgba(0,0,0,.35);touch-action:manipulation}.mobile-control-panel button:active{transform:scale(.94)}@media(min-width:700px) and (pointer:fine){.mobile-control-panel{display:none}}`;
  document.head.appendChild(style);
}
