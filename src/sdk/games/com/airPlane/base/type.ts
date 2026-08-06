
export type PlaneUnitParams = {
  canvasWidth:number;
  canvasHeight:number;
  unitWidth:number;
  unitHeight:number;
  unitX:number;
  unitY:number;
  speedX:number;
  speedY:number;
  shootCooldown:number
  health:number;
  score:number
  type?:string;
}

export type PlaneBodyParams = {
  bodyWidth:number;
  bodyHeight:number;
  bodyX:number;
  bodyY:number;
  speedX:number;
  speedY:number;
}

export enum PlaneBulletType {
  Normal = 'normal',
  Missile = 'missile',
  Spiral = 'spiral',
  Trace = 'trace',
}

export enum PlaneBulletShape{
  Rect = 'rect',
  Circle = 'circle'
}

export type PlaneBulletParams = {
  type: PlaneBulletType;
  shape:PlaneBulletShape;
  bulletWidth:number;
  bulletHeight:number;

  bulletX:number;
  bulletY:number;

  // todo:body 暂时没有使用  -- 忘了要用来做什么...
  bodyX:number;
  bodyY:number;
  size:number;
  speedX:number;
  speedY:number;
  combat:number;
  shootCooldown:number,
  direction:[number,number]

  // 螺旋子弹特有
  bulletAngle?:number
  bulletAngleSpeed?:number

  canvasWidth:number;
  canvasHeight:number;
}

export type HitInfo = {
  score:number; // 得分
  dead:boolean; // 是否死亡
  x:number;
  y:number;
}

export enum BulletCamp {
  Player = 'player',
  Enemy = 'enemy'
}
