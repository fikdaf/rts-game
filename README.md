# RTS Multiplayer (Web)

Game strategi real-time (RTS) multiplayer 3-6 pemain, jalan di browser lokal.

- **Server**: Node.js + [Colyseus](https://colyseus.io/) — authoritative game state, sinkronisasi real-time via WebSocket.
- **Client**: [Phaser 3](https://phaser.io/) + Vite — render 2D, input select/move ala RTS.

## Menjalankan (development)

Butuh Node.js 18+ (sudah ada v22 di WSL ini).

```bash
# dari root project, install semua dependency (server + client)
npm install

# terminal 1: jalankan server
npm run dev:server

# terminal 2: jalankan client
npm run dev:client
```

Client akan jalan di `http://localhost:5173` (default Vite), server WebSocket di `ws://localhost:2567`.

Buka `http://localhost:5173` di beberapa tab browser untuk simulasi multiplayer (tiap tab = 1 pemain, sampai 6 pemain per room).

## Kontrol (versi skeleton)

- **Drag kiri**: buat kotak seleksi unit milik sendiri (hijau).
- **Klik kanan**: perintahkan unit terpilih bergerak ke titik itu.
- **SPACE**: spawn unit baru di posisi acak (uji coba, biaya 10 resource).

## Struktur project

```
rts-game/
├── server/           # Colyseus game server
│   └── src/
│       ├── index.ts       # entry point, daftar room
│       ├── rooms/          # logic per room/match
│       └── schema/         # state game yang disinkron ke client
├── client/           # Phaser 3 + Vite
│   └── src/
│       ├── main.ts
│       └── scenes/
└── package.json      # npm workspaces (server + client)
```

## Langkah selanjutnya

- Ganti unit lingkaran dengan sprite/asset asli.
- Tambah building/resource gathering.
- Tambah fog of war.
- Tambah win condition & UI lobby (buat/gabung room dengan kode).
- Deploy: server bisa dijalankan di VPS/mesin lokal yang bisa diakses via LAN untuk main bareng.
