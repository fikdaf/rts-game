import { Schema, MapSchema, type } from "@colyseus/schema";

export class Unit extends Schema {
  @type("string") id = ""; @type("string") ownerId = "";
  @type("number") x = 0; @type("number") y = 0; @type("number") targetX = 0; @type("number") targetY = 0;
  @type("number") hp = 100; @type("number") maxHp = 100; @type("number") speed = 60; @type("number") damage = 10; @type("number") attackRange = 45; @type("number") attackCooldown = 0;
}
export class Building extends Schema {
  @type("string") id = ""; @type("string") ownerId = ""; @type("string") kind = "base";
  @type("number") x = 0; @type("number") y = 0; @type("number") hp = 500; @type("number") maxHp = 500;
}
export class Player extends Schema {
  @type("string") sessionId = ""; @type("string") name = ""; @type("number") resources = 100;
  @type("boolean") connected = true; @type("boolean") eliminated = false; @type("number") score = 0;
}
export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Unit }) units = new MapSchema<Unit>();
  @type({ map: Building }) buildings = new MapSchema<Building>();
  @type("number") mapWidth = 1600; @type("number") mapHeight = 1200; @type("number") matchStartedAt = 0;
  @type("string") status = "waiting"; @type("string") winnerId = "";
}
