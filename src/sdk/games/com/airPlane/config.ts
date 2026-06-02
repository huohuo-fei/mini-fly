import {
  MyBulletType,
  type MyBulletConfig,
  type SpriteConfig,
  type IMiniPlaneEnemy,
  MiniPlaneEnemyType,
  type IMiniPlaneEnemyBullets,
  type IMiniPlaneToolInfo,
  MiniPlaneToolType,
  type IMiniPlaneMainParams,
  type IMiniSquadronConfig,
  type IBigEnemyConfig,
} from './type';
// 三种普通敌机的配置信息
// 速度慢 体型大 生命值大 冷却时间长
// 速度快 体型小 生命值小 冷却时间短
// 速度快 体型大 生命值小 冷却时间短
export const enemyConfig1: IMiniPlaneEnemy = {
  x: 0,
  y: -25,
  w: 50,
  h: 50,
  speedY: 2,
  speedX: 0,
  health: 10,
  maxHealth: 10,
  type: MiniPlaneEnemyType.LEVEL1,
  color: 'red',
  shootCooldown: 1,
  score: 10,
  deadScore: 20,
};

export const enemyConfig2: IMiniPlaneEnemy = {
  x: 0,
  y: -15,
  w: 30,
  h: 30,
  speedY: 5,
  speedX: 0,
  health: 5,
  maxHealth: 5,
  type: MiniPlaneEnemyType.LEVEL2,
  color: 'yellow',
  shootCooldown: 2,
  score: 10,
  deadScore: 20,
};

export const enemyConfig3: IMiniPlaneEnemy = {
  x: 0,
  y: -10,
  w: 20,
  h: 20,
  speedY: 14,
  speedX: 0,
  health: 3,
  maxHealth: 3,
  type: MiniPlaneEnemyType.LEVEL3,
  color: 'pink',
  shootCooldown: 3,
  score: 10,
  deadScore: 20,
};

// 主战机配置
export const mainPlaneConfig: IMiniPlaneMainParams = {
  canvasWidth: 0,
  canvasHeight: 0,
  w: 0,
  h: 0,
  x: 0,
  y: 0,
  shootCooldown: 0,
};

// 普通敌机子弹配置
export const bulletConfig: IMiniPlaneEnemyBullets = {
  x: 0,
  y: 0,
  w: 6,
  h: 6,
  speedY: 4,
  color: '#ff8866',
};

// 普通我方子弹配置
export const myBulletConfig: MyBulletConfig = {
  type: MyBulletType.NORMAL,
  x: 0,
  y: 0,
  w: 6,
  h: 14,
  size: 3,
  color: '#ffcc44',
  speedY: 8,
  combat: 2,
};

// 爆炸动画配置
export const PlaneExplodeConfig: SpriteConfig = {
  x: 0,
  y: 0,
  w: 100,
  h: 100,
  tx: 0,
  ty: 0,
  tw: 50,
  th: 50,
  cFrame: 0,
  frames: 8,
  delayF: 5,
};

// 生命值配置
export const PlaneLifeConfig: SpriteConfig = {
  x: 0,
  y: 0,
  w: 20,
  h: 20,
  tx: 0,
  ty: 0,
  tw: 20,
  th: 20,
  cFrame: 0,
  frames: 8,
  delayF: 5,
};

// 生成的工具配置
export const planeToolConfig: IMiniPlaneToolInfo = {
  speedY: 2,
  type: MiniPlaneToolType.LIFE,
  x: 0,
  y: 0,
  w: 20,
  h: 20,
};

// 护盾闪烁帧数间隔
export const SHIELD_FRAME_NUM = 20;

// 敌机编队默认配置
export const enemySquadronConfig: IMiniSquadronConfig = {
  count: 6,
  angle: Math.PI / 6,
  enterHeight: 100,
  shootCooldown: 3000,
  speed: 1,
  unitSize: 30,
  direction: 'r',
};

// 敌机大头兵
export const bigEnemyConfig: IBigEnemyConfig = {
  x: 100,
  speed: 1,
  targetHeight: 100,
  shootCooldown: 600,
  radius: 20,
  angleSpeed: 0.01,
};
