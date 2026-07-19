import { PlaneBase } from "./planeBase";
import type { PlaneUnit } from "./planeUnit";

export class PlaneToolBase extends PlaneBase {

  // 主机体的尺寸 位置信息
  mainUnit:PlaneUnit|null = null
  mainWidth:number = 0
  mainHeight:number = 0
  mainX:number = 0
  mainY:number = 0
  initTool(){

  }

  updatePosX(x:number){
    this.mainX = x
    this.matrix.makeTranslation(this.mainX, this.mainY);
  }

  updatePosY(y:number){
    this.mainY = y
    this.matrix.makeTranslation(this.mainX, this.mainY);
  }

  updatePos(x:number,y:number){
    this.mainX = x
    this.mainY = y
    this.matrix.makeTranslation(this.mainX, this.mainY);

  }

  destroyTool(){
    
  }

}