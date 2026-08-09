import type {
  IMiniGam,
  IMiniGamManager,
  IMiniScreen,
  IMiniGameParams,
  IMiniActParams,
} from '../type';
import { MiniActionType, MiniGameType } from '../utils/common';

import { MiniFly } from './com/airPlane';
export class MiniGamManager implements IMiniGamManager {
  screen: IMiniScreen;
  activeGam: IMiniGam | null = null;
  gameParams: IMiniGameParams 

  constructor(screen: IMiniScreen, params: IMiniGameParams) {
    this.screen = screen;
    this.gameParams = params;
  }

  buildGam() {
    switch (this.gameParams.type) {
      case MiniGameType.FLY:
        this.activeGam = new MiniFly(this.gameParams);
        return;
    }
  }

  getActiveGam() {
    if(!this.activeGam){
      this.buildGam()
    }
    return this.activeGam;
  }

  setActiveGam(gamParams: IMiniGameParams) {
    this.activeGam = new MiniFly(gamParams);
  }

  resetGame() :IMiniGam | null{
    this.activeGam = null;
    this.buildGam();
    return this.activeGam;
  }
  receiveTransfer(action:IMiniActParams){
    if(action.actionType === MiniActionType.POINTERDOWN){
      this.activeGam?.actionStart(action);
    }else if(action.actionType === MiniActionType.POINTERUP){
      this.activeGam?.actionEnd(action);
    }else{
      this.activeGam?.actionDoing(action);
    }
  }

  calcpos(clientX:number, clientY:number){
    const canvas = this.screen.canvas;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    let canvasX = (clientX - rect.left) * scaleX;
    canvasX = Math.min(Math.max(canvasX, 20), canvas.width-20);
    return {x:canvasX,y:clientY}
}
}
