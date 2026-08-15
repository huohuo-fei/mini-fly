import type { EventBus } from '../miniBase/eventBus';
import type { Matrix3 } from '../utils/Matrix3';
import type { MiniActionType, MiniGameType } from '../utils/common';

// 事件总线
export interface IEventBus{
  on: (eventName: string, callback: Function) => void;
  emit: (eventName: string, ...args: any[]) => void;
  off: (eventName: string,callback: Function) =>void;
}

export interface IMiniGamManager {
  activeGam: IMiniGam | null;
  getActiveGam: () => IMiniGam | null;
  setActiveGam: (gamParams: IMiniGameParams) => void;
  buildGam: (gamParams: IMiniGameParams) => void;
  resetGame: () => IMiniGam | null;
  receiveTransfer: (p: IMiniActParams) => void;
}

// 所有的交互操作 后续考虑添加键盘事件
export interface IMiniAction {
  canvas: HTMLCanvasElement;
  screen: IMiniScreen;
  pointerDownFn: (e: PointerEvent) => void;
  pointerUpFn: (e: PointerEvent) => void;
  pointerMoveFn: (e: PointerEvent) => void;
  addEventListener: () => void;
  removeEventListener: () => void;
}

export interface IMiniGam extends IEventBus {
  matrix:Matrix3
  update: (deltaTime: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
  actionStart: (p: IMiniActParams) => void;
  actionEnd: (p: IMiniActParams) => void;
  actionDoing: (p: IMiniActParams) => void;
  pauseRender: () => void;
  exportGameInfo: () => IGameResult;
}

export interface IMiniScreen extends EventBus {
  gamList: Set<IMiniGam>;
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  gamManager: IMiniGamManager;
  gamAcion: IMiniAction;
  activeGam: IMiniGam | null;
  ctx: CanvasRenderingContext2D | null;

  initAni: () => void;
  pauseAni: () => void;
  setActiveGam: (gam: IMiniGam) => void;
  getGameInfo:() => IGameResult
  actionTransfer: (p: IMiniActParams) => void;
  draw: (deltaTime: number) => void;
}

// 当前游戏的基本信息
export type IMiniGameParams = {
  type: MiniGameType.FLY;
  canvasWidth: number;
  canvasHeight: number;
};

// 游戏操作信息
export type IMiniActParams = {
  id: number;
  x: number;
  y: number;
  actionType: MiniActionType;
};

export interface Point {
  x: number;
  y: number;
}

// 游戏结束后的数据类型
export type IGameResult = {
  score: number;
  time: number;
  des: string; // 游戏结束描述
  // resultId: number; // 游戏结果id
};

// 游戏状态
export enum GameStatus {
  START = 'start',
  DOING = 'doing',
  PAUSE = 'pause',
  END = 'end',
}

