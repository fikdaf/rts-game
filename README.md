# RTS Multiplayer (Web)

Game strategi real-time (RTS) multiplayer 3-6 pemain yang berjalan di browser, termasuk perangkat mobile.

## Status pengembangan

Branch pengembangan aktif: `feature/rts-core-systems`.

### Sudah diimplementasikan

- **Authoritative multiplayer server** dengan Node.js + Colyseus.
- **LAN development**: server game bind ke `0.0.0.0` dan Vite dev server dapat diakses dari perangkat satu jaringan Wi-Fi/LAN.
- **LAN WebSocket discovery**: client otomatis memakai hostname/IP browser untuk koneksi ke server pada port `2567`, sehingga tidak lagi terkunci ke `localhost`.
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

## Menjalankan development di PC

Butuh Node.js 18+.

```bash
npm install
npm run dev:server
npm run dev:client
```

Server game: `ws://0.0.0.0:2567`  
Client Vite: `http://0.0.0.0:5173`

## Bermain dari HP / device lain di jaringan lokal

PC dan HP harus terhubung ke **Wi-Fi/LAN yang sama**.

1. Jalankan server dan client seperti di atas.
2. Cari IP LAN PC, misalnya `192.168.1.10`.
3. Dari HP buka:

```text
http://192.168.1.10:5173
```

4. Client otomatis membuat koneksi WebSocket ke:

```text
ws://192.168.1.10:2567
```

Tidak perlu mengubah source code untuk setiap IP karena hostname browser digunakan sebagai default server host. Jika diperlukan, server dapat dioverride dengan `VITE_SERVER_URL`.

### Jika HP tidak bisa terhubung

- Pastikan PC dan HP berada pada jaringan yang sama.
- Pastikan firewall OS mengizinkan koneksi TCP pada port **5173** dan **2567**.
- Pastikan router tidak mengaktifkan client/AP isolation.
- Gunakan IP LAN PC, bukan `localhost` atau `127.0.0.1` dari HP.

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
│   ├── vite.config.ts
│   └── src/
│       ├── scenes/MainScene.ts
│       ├── camera/
│       ├── input/
│       ├── network/
│       ├── rendering/
│       ├── selection/
│       └── ui/
│           ├── ActionBar.ts
│           ├── HUDManager.ts
│           ├── MobileControls.ts
│           ├── Minimap.ts
│           └── FogOfWar.ts
└── package.json
```

## Arsitektur gameplay

```text
Browser / Mobile
      ↓
Vite LAN :5173
      ↓ WebSocket
Colyseus :2567 (0.0.0.0)
      ↓
RTSRoom authoritative state
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
