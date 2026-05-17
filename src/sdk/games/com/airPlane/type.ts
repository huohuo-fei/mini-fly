// todo:将之前的战机类型 抽离出来

export enum MyBulletType {
  NORMAL = 'normal',
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
