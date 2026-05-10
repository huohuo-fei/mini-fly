// 具体的小游戏 内部逻辑类
import type{ IMiniGam, IMiniGameParams } from "../../type";
export class MiniFly implements IMiniGam{

  constructor(gameParams:IMiniGameParams){
    console.log(gameParams);
    
  }

  // render 方法
  render(ctx:CanvasRenderingContext2D){
    console.log('render game fly',ctx);
    
  }
}