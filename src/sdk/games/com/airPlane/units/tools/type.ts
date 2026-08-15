export type ToolShieldConfig = {
  w:number,
  h:number,
  x:number,
  y:number
}


export enum MiniPlaneToolType {
  LIFE = 'life',
  SHIELD = 'shield',
  BOMB = 'bomb',
  DOUBLE = 'double',
}

export type IMiniPlaneToolInfo = {
  speedY: number;
  type: MiniPlaneToolType;
  x: number;
  y: number;
  w: number;
  h: number;
};
