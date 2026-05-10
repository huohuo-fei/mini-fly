import type {  MiniGameType } from "../utils/common";

export interface IMiniGamManager{
  activeGam: IMiniGam | null;

  getActiveGam: () => IMiniGam | null;
  setActiveGam: (gamParams: IMiniGameParams) => void;

  buildGam: (gamParams: IMiniGameParams) => void;
}

export interface IMiniGam {
  // screen: IMiniScreen;
  render: (ctx: CanvasRenderingContext2D) => void;
}



export interface IMiniScreen {
  gamList: Set<IMiniGam>;
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  gamManager:IMiniGamManager
  activeGam: IMiniGam | null;
  ctx: CanvasRenderingContext2D | null;

  aniTime: number | null;
  initAni: () => void;
  pauseAni: () => void;
  draw: () => void;
  setActiveGam: (gam: IMiniGam) => void;
}

export type IMiniGameParams = {
  type: MiniGameType.FLY;
};
