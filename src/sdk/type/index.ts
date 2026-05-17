import type { MiniActionType, MiniGameType, MiniPlaneEnemyType } from '../utils/common';
export interface IMiniBus {
  events: Map<string, Set<Function>>;
  // 事件总线
  on: (eventName: string, callback: Function) => void;
  emit: (eventName: string, ...args: any[]) => void;
}

export interface IMiniGamManager {
  activeGam: IMiniGam | null;

  getActiveGam: () => IMiniGam | null;
  setActiveGam: (gamParams: IMiniGameParams) => void;
  buildGam: (gamParams: IMiniGameParams) => void;
  receiveTransfer: (p: IMiniActParams) => void;
}

export interface IMiniAction {
  canvas: HTMLCanvasElement;
  screen: IMiniScreen;
  pointerDownFn: (e: PointerEvent) => void;
  pointerUpFn: (e: PointerEvent) => void;
  pointerMoveFn: (e: PointerEvent) => void;
  addEventListener: () => void;
  removeEventListener: () => void;
}

export interface IMiniGam {
  render: (ctx: CanvasRenderingContext2D) => void;
  actionStart: (p: IMiniActParams) => void;
  actionEnd: (p: IMiniActParams) => void;
  actionDoing: (p: IMiniActParams) => void;
}

export interface IMiniScreen {
  gamList: Set<IMiniGam>;
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  gamManager: IMiniGamManager;
  gamAcion: IMiniAction;
  activeGam: IMiniGam | null;
  ctx: CanvasRenderingContext2D | null;

  aniTime: number | null;
  initAni: () => void;
  pauseAni: () => void;
  setActiveGam: (gam: IMiniGam) => void;
  actionTransfer:(p:IMiniActParams)=>void;
  draw: () => void;

}

export type IMiniGameParams = {
  type: MiniGameType.FLY;
  canvasWidth: number;
  canvasHeight: number;
};

export type IMiniActParams = {
  id: number;
  x: number;
  y: number;
  actionType: MiniActionType;
};

export type IMiniPlaneEnemyInfo = {
  x: number;
  y: number;
  w: number;
  h: number;
  type:MiniPlaneEnemyType;
}

export type IMiniPlaneEnemy = {
  x:number;
  y:number;
  w:number;
  h:number;
  health:number;
  maxHealth:number;
  type:MiniPlaneEnemyType;
  color:string
  speedX:number
  speedY:number
  shootCooldown:number
}

export type IMiniPlaneEnemyBullets = {
  x:number;
  y:number;
  w: number;
  h: number;
  speedY: number;
  color: string;
}
