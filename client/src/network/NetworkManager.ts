import { Client, Room, getStateCallbacks } from "@colyseus/sdk";

function getServerUrl() {
  const configured = import.meta.env.VITE_SERVER_URL as string | undefined;
  if (configured) return configured;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.hostname}:2567`;
}

export class NetworkManager {
  private client = new Client(getServerUrl());
  room!: Room;

  async connect(name: string) {
    this.room = await this.client.joinOrCreate("rts_room", { name });
    return this.room;
  }

  bindState() { return getStateCallbacks(this.room); }
  send(type: string, payload?: unknown) { this.room.send(type, payload); }
  get sessionId() { return this.room.sessionId; }
}
