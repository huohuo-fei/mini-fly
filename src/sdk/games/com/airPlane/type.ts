import type { PlaneUnitParams } from "./base/type";

export enum MyBulletType {
  NORMAL = 'normal',
}

export enum EnemyType {
  BIG = 'big',
  JOKER = 'joker',
  SQUADRON = 'squadron',
  BOSS = 'boss',
}

export enum AttackerType {
  MAIN = 'main'
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
  LIFE = 'life',
  DAMAGE = 'damage',
  TEXT='text'
}

// 特效中 精灵图的配置
export type SpriteConfig = {
  // 当前帧的位置
  x: number;
  y: number;
  w: number;
  h: number;
  cFrame: number; // 当前帧数
  frames: number; // 精灵图帧数
  delayF: number; // 延迟帧数

  // 精灵图在画布上的位置
  tx: number;
  ty: number;
  tw: number;
  th: number;
};
export type IMiniPlaneEnemy = {
  x: number;
  y: number;
  w: number;
  h: number;
  health: number;
  maxHealth: number;
  type: MiniPlaneEnemyType;
  color: string;
  speedX: number;
  speedY: number;
  // 子弹发射的冷却时间
  shootCooldown: number;
  // 击中得分
  score: number;
  // 击杀得分
  deadScore: number;
};

export type IMiniPlaneEnemyInfo = {
  x: number;
  y: number;
  w: number;
  h: number;
  type: MiniPlaneEnemyType;
};

export type IMiniPlaneEnemyBullets = {
  x: number;
  y: number;
  w: number;
  h: number;
  speedY: number;
  color: string;
};

export type IMiniPlaneToolInfo = {
  speedY: number;
  type: MiniPlaneToolType;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type IMiniPlaneMainParams = {
  canvasWidth: number;
  canvasHeight: number;
  w: number;
  h: number;
  shootCooldown: number;
  x: number;
  y: number;
};

// 敌机编队配置
export type IMiniSquadronConfig = {
  count: number;
  angle: number;
  enterHeight: number;
  shootCooldown: number;
  speed: number;
  unitSize: number;
  direction: 'r' | 'l';
};

// bigEnemy 配置
export type IBigEnemyConfig = {
  x: number;
  speed: number;
  targetHeight: number;
  shootCooldown: number;
  radius: number;
  angleSpeed: number;
};

// boss 配置
export type IBossConfig = {
  frame: number;
  w: number;
  h: number;
  targetHeight: number;
};

// 编队配置
export type ISquadronConfig = {
  w: number;
  h: number;
  count: number;
  angle: number;
  startX: number;
  startY: number;
  gap: number;
  health: number;
};

export type ISquadronEnemy = {
  left: number;
  top: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  health: number;
  dead: boolean;
};

export type EnemyConfig = {
  id:string,
  // 波次名称
  waveName: string,
  // 敌机类型
  enemyType: EnemyType,
  // 持续时间
  durTime: number,
  // 当前波次的最大分数
  maxScore: number,
  // 屏幕最大存在数量
  maxCount: number,
  // 优先级
  priority: number,
  // 是否是boss
  isBoss?: boolean,
  // 是否无限生成
  isInfinite?: boolean,
  // 其他配置
  otherConfig?:any
}

export type unLockedEnemy = {
  type: EnemyType,
  size:number
}

// 当前波次的详细信息 用于判断是否进入下一个波次
export type waveInfo = {
  // startTime: number;
  gameTime: number;
  currentScore: number;
};

export type WaveEnemyConfig = {
  type:EnemyType,
  params:PlaneUnitParams,
  config:any
}

// 敌机构造器的状态
export enum EnemyCreaterStatus {
  PEDDING = 'pedding',
  ACTIVE = 'ACTIVE',
  END = 'end'
}
