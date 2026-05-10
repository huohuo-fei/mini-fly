// 具体的小游戏 内部逻辑类
import type {   IMiniGam,    IMiniGamManager, IMiniScreen,IMiniGameParams } from '../type';
import { MiniGameType  } from '../utils/common';

import { MiniFly } from './com/MiniFly';
export class MiniGamManager implements IMiniGamManager {
  screen: IMiniScreen;
  activeGam: IMiniGam | null = null;

  constructor(screen: IMiniScreen, params: IMiniGameParams) {
    this.screen = screen;
    this.buildGam(params);
  }

  buildGam(gamParams: IMiniGameParams){
    switch(gamParams.type){
      case MiniGameType.FLY:
        this.activeGam = new MiniFly(gamParams);
        return
    }
  }

  getActiveGam(){
    return this.activeGam;
  };

  setActiveGam(gamParams: IMiniGameParams){
    this.activeGam = new MiniFly(gamParams);
  };

  // render 方法
  render(ctx: CanvasRenderingContext2D) {
    console.log('render game', ctx);
  }
}
