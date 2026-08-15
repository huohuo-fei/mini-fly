// 特效类型
export enum IMiniPlaneEffectType {
  EXPLODE = 'explode',
  LIFE = 'life',
  DAMAGE = 'damage',
  TEXT='text'
}

export type textColorConfig = {
  colorStart: string;
  colorMid: string;
  colorEnd: string;

  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
};

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
