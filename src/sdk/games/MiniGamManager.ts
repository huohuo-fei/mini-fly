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

  constructor(screen: IMiniScreen, params: IMiniGameParams) {
    this.screen = screen;
    this.buildGam(params);
  }

  buildGam(gamParams: IMiniGameParams) {
    switch (gamParams.type) {
      case MiniGameType.FLY:
        this.activeGam = new MiniFly(gamParams);
        return;
    }
  }

  getActiveGam() {
    return this.activeGam;
  }

  setActiveGam(gamParams: IMiniGameParams) {
    this.activeGam = new MiniFly(gamParams);
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
}
