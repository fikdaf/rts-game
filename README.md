# RTS Multiplayer (Web)

Game strategi real-time (RTS) multiplayer 3-6 pemain yang berjalan di browser, termasuk perangkat mobile.

## Status pengembangan

Branch pengembangan aktif: `feature/rts-core-systems`.

### Sudah diimplementasikan

- **Authoritative multiplayer server** dengan Node.js + Colyseus.
- **Player lifecycle**: join, leave/reconnect grace period, elimination, dan match state.
- **Economy**: resource awal, biaya spawn/build, regeneration dan batas resource.
- **Unit system**: spawn, selection, movement, HP, damage, attack range dan cooldown.
- **Combat**: unit mencari target musuh terdekat dalam attack range dan memberi damage secara authoritative.
- **Building system**: pembangunan base dengan biaya resource dan HP building.
- **Pathfinding**: modul grid A* reusable di `server/src/systems/PathfindingSystem.ts`.
- **Mobile UI**: tombol Unit / Move / Base / Clear dengan pointer/touch events dan safe-area support.
- **Desktop controls** tetap didukung melalui input RTS klasik.
- **HUD**: player count, resource, score dan status match/winner.
- **Minimap**: unit, building dan viewport kamera.
- **Fog of War**: visibility overlay berbasis unit milik player.
- **Rendering separation**: unit/building rendering dipisahkan dari scene utama.
- **MainScene separation**: camera, input, network, selection, rendering dan UI menggunakan modul terpisah.

## Kontrol

### Desktop

- **Drag kiri**: box-select unit milik sendiri.
- **Klik kanan**: move selected units.
- **SPACE / action bar**: spawn unit.
- **Action bar**: clear selection dan aksi gameplay.

### Mobile / HP

- **Tap**: selection / interaksi.
- **Drag**: box selection jika didukung pointer input.
- **UNIT**: spawn unit.
- **MOVE**: kirim unit terpilih ke posisi pointer terakhir.
- **BASE**: bangun base di posisi pointer.
- **CLEAR**: hapus selection.

## Struktur project

```text
rts-game/
├── server/
│   └── src/
│       ├── index.ts
│       ├── rooms/
│       │   └── RTSRoom.ts
│       ├── schema/
│       │   └── GameState.ts
│       └── systems/
│           └── PathfindingSystem.ts
├── client/
│   └── src/
│       ├── scenes/
│       │   └── MainScene.ts
│       ├── camera/
│       ├── input/
│       ├── network/
│       ├── rendering/
│       ├── selection/
│       ├── types/
│       └── ui/
│           ├── ActionBar.ts
│           ├── HUDManager.ts
│           ├── MobileControls.ts
│           ├── Minimap.ts
│           └── FogOfWar.ts
└── package.json
```

## Menjalankan development

Butuh Node.js 18+.

```bash
npm install
npm run dev:server
npm run dev:client
```

Client default: `http://localhost:5173`  
Server WebSocket default: `ws://localhost:2567`

Buka client di beberapa tab/browser untuk menguji multiplayer.

## Arsitektur gameplay

```text
Client input
    ↓
Network command
    ↓
RTSRoom (authoritative)
    ↓
Economy / Movement / Combat / Building
    ↓
Colyseus state sync
    ↓
Renderer + HUD + Minimap + Fog of War
```

Client tidak menentukan HP, resource, damage, kemenangan, atau hasil command secara authoritative; server tetap menjadi sumber kebenaran.

## Roadmap berikutnya

- Integrasikan A* ke movement simulation agar unit benar-benar menghindari obstacle.
- Map collision dan obstacle editor/data.
- Manual attack command dan target selection.
- Building destruction serta spawn point/base protection.
- Resource nodes dan worker/resource gathering.
- Fog of War server-side visibility validation.
- Lobby/create/join room dengan room code.
- Reconnect state restoration yang lebih lengkap.
- Automated server/client tests dan CI build verification.
- Asset/sprite pipeline dan polish UI mobile.
- Deployment multiplayer publik.
