export enum EnemyType {
  BIG = 'big',
  JOKER = 'joker',
  SQUADRON = 'squadron',
  BOSS = 'boss',
}

export enum MiniPlaneEnemyType {
  LEVEL1 = 'level1', // 速度慢 体型大 生命值大
  LEVEL2 = 'level2', // 速度快 体型小 生命值小
  LEVEL3 = 'level3', // 速度快 体型大 生命值小
}

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