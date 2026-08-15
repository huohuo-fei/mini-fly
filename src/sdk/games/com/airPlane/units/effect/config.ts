import type { SpriteConfig, textColorConfig } from './type';

const colorConfigSuc: textColorConfig = {
  colorStart: '#2ecc71',
  colorMid: '#27ae60',
  colorEnd: '#1abc9c',

  shadowColor: 'rgba(10, 30, 20, 0.9)',
  shadowBlur: 14,
  shadowOffsetX: 4,
  shadowOffsetY: 6,
};

const colorConfigDan: textColorConfig = {
  colorStart: '#a02020',
  colorMid: '#d03030',
  colorEnd: '#f06030',

  shadowColor: 'rgba(0, 0, 0, 0.95)',
  shadowBlur: 12,
  shadowOffsetX: 4,
  shadowOffsetY: 6,
};

export const textColorMap = {
  suc: colorConfigSuc,
  dan: colorConfigDan,
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
