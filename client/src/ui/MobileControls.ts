export interface MobileControlActions {
  spawnUnit: () => void;
  moveSelected: () => void;
  clearSelection: () => void;
  buildBase: () => void;
}

export class MobileControls {
  private root: HTMLDivElement;
  constructor(private actions: MobileControlActions) {
    this.root = document.createElement("div");
    this.root.className = "mobile-controls";
    this.root.innerHTML = `
      <button data-action="spawn" aria-label="Train unit">＋<small>UNIT</small></button>
      <button data-action="move" aria-label="Move selected units">➤<small>MOVE</small></button>
      <button data-action="build" aria-label="Build base">⌂<small>BASE</small></button>
      <button data-action="clear" aria-label="Clear selection">×<small>CLEAR</small></button>`;
    document.body.appendChild(this.root);
    this.bind("spawn", actions.spawnUnit);
    this.bind("move", actions.moveSelected);
    this.bind("build", actions.buildBase);
    this.bind("clear", actions.clearSelection);
  }
  private bind(action: string, fn: () => void) {
    this.root.querySelector(`[data-action="${action}"]`)?.addEventListener("pointerdown", e => { e.preventDefault(); fn(); });
  }
  setVisible(visible: boolean) { this.root.classList.toggle("is-visible", visible); }
  destroy() { this.root.remove(); }
}

export function installMobileStyles() {
  if (document.getElementById("rts-mobile-styles")) return;
  const style = document.createElement("style");
  style.id = "rts-mobile-styles";
  style.textContent = `
    .mobile-controls{display:flex;position:fixed;right:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:2000;gap:8px;touch-action:none}
    .mobile-controls button{width:62px;height:62px;border:1px solid rgba(255,255,255,.25);border-radius:16px;background:rgba(20,28,24,.9);color:#fff;font:700 24px system-ui;box-shadow:0 4px 16px rgba(0,0,0,.35);touch-action:manipulation;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:22px}
    .mobile-controls small{font:700 8px system-ui;opacity:.8}.mobile-controls button:active{transform:scale(.94);background:rgba(60,80,60,.95)}
    @media (min-width:700px) and (pointer:fine){.mobile-controls{display:none!important}}
    @media (max-width:699px),(pointer:coarse){body{overscroll-behavior:none;-webkit-user-select:none;user-select:none}}
  `;
  document.head.appendChild(style);
}
