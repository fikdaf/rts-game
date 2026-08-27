import Phaser from "phaser";
import { Room, getStateCallbacks } from "@colyseus/sdk";
import { UnitSprite } from "../types/GameTypes";
export class UnitRenderer {
 readonly sprites=new Map<string,UnitSprite>(); private buildings=new Map<string,Phaser.GameObjects.Rectangle>();
 constructor(private scene:Phaser.Scene,private room:Room){}
 get state(){return this.room.state}
 bindState(){const $=getStateCallbacks(this.room);$(this.room.state).units.onAdd((u:any,id:string)=>{const circle=this.scene.add.circle(u.x,u.y,11,u.ownerId===this.room.sessionId?0x4caf50:0xe53935).setDepth(10);circle.setStrokeStyle(2,0xffffff);this.sprites.set(id,{sprite:circle});$(u).onChange(()=>{circle.setPosition(u.x,u.y);circle.setScale(Math.max(.6,u.hp/u.maxHp))})});$(this.room.state).units.onRemove((_u:any,id:string)=>this.remove(id));$(this.room.state).buildings.onAdd((b:any,id:string)=>{const box=this.scene.add.rectangle(b.x,b.y,48,48,b.ownerId===this.room.sessionId?0x4caf50:0xe53935,.55).setDepth(5);box.setStrokeStyle(3,0xffffff);this.buildings.set(id,box);$(b).onChange(()=>box.setPosition(b.x,b.y))});$(this.room.state).buildings.onRemove((_b:any,id:string)=>{this.buildings.get(id)?.destroy();this.buildings.delete(id)})}
 remove(id:string){const e=this.sprites.get(id);e?.sprite.destroy();e?.label?.destroy();this.sprites.delete(id)}
}
