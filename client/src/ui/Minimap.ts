import Phaser from "phaser";
export class Minimap {
 private graphics:Phaser.GameObjects.Graphics; private size=150;
 constructor(private scene:Phaser.Scene,private worldWidth:number,private worldHeight:number,private localId:string){this.graphics=scene.add.graphics().setScrollFactor(0).setDepth(1500)}
 render(units:Iterable<any>,buildings:Iterable<any>,camera:Phaser.Cameras.Scene2D.Camera){const x=this.scene.scale.width-this.size-12,y=12,sx=this.size/this.worldWidth,sy=this.size/this.worldHeight;this.graphics.clear().fillStyle(0x101510,.85).fillRect(x,y,this.size,this.size).lineStyle(1,0xffffff,.35).strokeRect(x,y,this.size,this.size);for(const u of units)this.graphics.fillStyle(u.ownerId===this.localId?0x4caf50:0xe53935,1).fillCircle(x+u.x*sx,y+u.y*sy,2);for(const b of buildings)this.graphics.fillStyle(b.ownerId===this.localId?0x4caf50:0xe53935,.8).fillRect(x+b.x*sx-2,y+b.y*sy-2,4,4);const vw=camera.width/camera.zoom*sx,vh=camera.height/camera.zoom*sy;this.graphics.lineStyle(1,0xffff00,.8).strokeRect(x+camera.scrollX*sx,y+camera.scrollY*sy,vw,vh)}
 destroy(){this.graphics.destroy()}
}
