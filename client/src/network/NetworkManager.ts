import { Client, Room, getStateCallbacks } from "@colyseus/sdk";

const SERVER_URL = "ws://localhost:2567";

export class NetworkManager {
  private client = new Client(SERVER_URL);
  room!: Room;

  async connect(name: string) {
    this.room = await this.client.joinOrCreate("rts_room", { name });
    return this.room;
  }

  bindState() {
    return getStateCallbacks(this.room);
  }

  send(type: string, payload?: unknown) {
    this.room.send(type, payload);
  }

  get sessionId() {
    return this.room.sessionId;
  }
}
