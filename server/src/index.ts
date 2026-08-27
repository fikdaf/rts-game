import express from "express";
import { createServer } from "http";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { RTSRoom } from "./rooms/RTSRoom.js";

const port = Number(process.env.PORT || 2567);
const host = process.env.HOST || "0.0.0.0";
const app = express();
const httpServer = createServer(app);
const gameServer = new Server({ transport: new WebSocketTransport({ server: httpServer }) });

gameServer.define("rts_room", RTSRoom);
app.get("/", (_req, res) => res.send("RTS game server is running."));

gameServer.listen(port, host).then(() => {
  console.log(`RTS server listening on ws://${host}:${port}`);
  console.log(`LAN clients: ws://<YOUR-LAN-IP>:${port}`);
});
