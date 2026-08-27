import Phaser from "phaser";
import { Room, getStateCallbacks } from "@colyseus/sdk";
export class HUDManager {
 readonly text:Phaser.GameObjects.Text; private room?:Room;
 constructor(scene:Phaser.Scene){this.text=scene.add.text(10,10,"Connecting...",{fontFamily:"monospace",fontSize:"14px",color:"#ffffff",backgroundColor:"#111a14",padding:{x:8,y:6}}).setScrollFactor(0).setDepth(2000)}
 attachRoom(room:Room){this.room=room} setStatus(s:string){this.text.setText(s)}
 bindState(room:Room=this.room!){this.room=room;const $=getStateCallbacks(room);$(room.state).players.onAdd((p:any)=>{$(p).onChange(()=>this.update());this.update()});$(room.state).players.onRemove(()=>this.update());$(room.state).onChange(()=>this.update());this.update()}
 update(){if(!this.room)return;const me:any=this.room.state.players.get(this.room.sessionId),status=this.room.state.status,winner=this.room.state.winnerId;let match=status==="finished"?(winner===this.room.sessionId?"YOU WIN":"YOU LOSE"):status.toUpperCase();this.text.setText(`Players ${this.room.state.players.size}/6 | Gold ${Math.floor(me?.resources??0)} | Score ${me?.score??0} | ${match}\nTap select/move • Drag box select • Buttons actions`)}
}
