export enum MyBulletType {
  NORMAL = 'normal',
}

export enum MiniPlaneEnemyType {
  LEVEL1 = 'level1', // 速度慢 体型大 生命值大 
  LEVEL2 = 'level2', // 速度快 体型小 生命值小
  LEVEL3 = 'level3', // 速度快 体型大 生命值小
}

export enum MiniPlaneToolType {
  LIFE = 'life',
  SHIELD = 'shield',
  BOMB = 'bomb',
  DOUBLE = 'double',
}




// 我方子弹配置
export type MyBulletConfig = {
  type: MyBulletType;
  x: number;
  y: number;
  w: number;
  h: number;
  size: number; // 子弹列数
  color: string;
  speedY: number;
  combat: number; // 战斗力 扣除血条的倍数
};

// 特效类型
export enum IMiniPlaneEffectType {
  EXPLODE = 'explode',
}

// 特效中 精灵图的配置
export type SpriteConfig = {
  // 精灵图位置
  x: number;
  y: number;
  w: number;
  h: number;
  cFrame: number; // 当前帧数
  frames:number; // 精灵图帧数 
  delayF: number; // 延迟帧数
  // 精灵图在画布上的位置
  tx: number;
  ty: number;
  tw: number;
  th: number;
};
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
  // 子弹发射的冷却时间
  shootCooldown:number
  // 击中得分
  score:number
  // 击杀得分
  deadScore:number 
}

export type IMiniPlaneEnemyInfo = {
  x: number;
  y: number;
  w: number;
  h: number;
  type:MiniPlaneEnemyType;
}

export type IMiniPlaneEnemyBullets = {
  x:number;
  y:number;
  w: number;
  h: number;
  speedY: number;
  color: string;
}

export type IMiniPlaneToolInfo = {
  speedY:number
  type:MiniPlaneToolType;
  x:number;
  y:number;
  w:number;
  h:number;
}
