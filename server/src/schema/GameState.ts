import { Schema, MapSchema, type } from "@colyseus/schema";

export class Unit extends Schema {
  @type("string") id: string = "";
  @type("string") ownerId: string = "";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") targetX: number = 0;
  @type("number") targetY: number = 0;
  @type("number") hp: number = 100;
  @type("number") speed: number = 60; // units per second
}

export class Player extends Schema {
  @type("string") sessionId: string = "";
  @type("string") name: string = "";
  @type("number") resources: number = 100;
  @type("boolean") connected: boolean = true;
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Unit }) units = new MapSchema<Unit>();
  @type("number") mapWidth: number = 1600;
  @type("number") mapHeight: number = 1200;
  @type("number") matchStartedAt: number = 0;
}
