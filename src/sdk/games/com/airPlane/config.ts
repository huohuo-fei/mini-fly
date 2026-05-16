import type { IMiniPlaneEnemy } from '../../../type';
import { MiniPlaneEnemyType } from '../../../utils/common';
// 三种普通敌机的配置信息
// 速度慢 体型大 生命值大
// 速度快 体型小 生命值小
// 速度快 体型大 生命值小
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
};
