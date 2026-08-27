export class MobileActionOverlay {
  private root: HTMLDivElement;

  constructor(spawnUnit: () => void, clearSelection: () => void) {
    this.root = document.createElement("div");
    this.root.className = "mobile-action-overlay";
    this.root.innerHTML = '<button aria-label="Spawn unit">＋</button><button aria-label="Clear selection">×</button>';
    document.body.appendChild(this.root);
    const buttons = this.root.querySelectorAll("button");
    buttons[0]?.addEventListener("pointerdown", e => { e.preventDefault(); spawnUnit(); });
    buttons[1]?.addEventListener("pointerdown", e => { e.preventDefault(); clearSelection(); });
  }

  destroy() { this.root.remove(); }
}

export function installMobileOverlayStyles() {
  const style = document.createElement("style");
  style.textContent = `.mobile-action-overlay{display:flex;position:fixed;right:16px;bottom:max(16px,env(safe-area-inset-bottom));z-index:2000;gap:10px}.mobile-action-overlay button{width:56px;height:56px;border:1px solid rgba(255,255,255,.25);border-radius:16px;background:rgba(20,28,24,.9);color:#fff;font:700 25px system-ui;touch-action:manipulation}.mobile-action-overlay button:active{transform:scale(.94)}@media(min-width:700px) and (pointer:fine){.mobile-action-overlay{display:none}}`;
  document.head.appendChild(style);
}
