// 三种普通敌机的配置信息
// 速度慢 体型大 生命值大 冷却时间长
// 速度快 体型大 生命值小 冷却时间短

import { PlaneBulletType, type PlaneBulletParams, PlaneBulletShape } from "../../base/type";
import { MiniPlaneEnemyType, type IMiniPlaneEnemy } from "./type";

// 速度快 体型小 生命值小 冷却时间短
export const enemyConfig1: IMiniPlaneEnemy = {
  x: 0,
  y: -25,
  w: 80,
  h: 80,
  speedY: 100,
  speedX: 0,
  health: 10,
  maxHealth: 10,
  type: MiniPlaneEnemyType.LEVEL1,
  color: 'red',
  shootCooldown: 1500,
  score: 10,
  deadScore: 20,
  bulletSpeedY: 200,

};

export const enemyConfig2: IMiniPlaneEnemy = {
  x: 0,
  y: -15,
  w: 70,
  h: 70,
  speedY:160,
  speedX: 0,
  health: 8,
  maxHealth: 5,
  type: MiniPlaneEnemyType.LEVEL2,
  color: 'yellow',
  shootCooldown: 1400,
  score: 10,
  deadScore: 20,
  bulletSpeedY: 320,

};

export const enemyConfig3: IMiniPlaneEnemy = {
  x: 0,
  y: -10,
  w: 50,
  h: 50,
  speedY: 300,
  speedX: 0,
  health: 5,
  maxHealth: 3,
  type: MiniPlaneEnemyType.LEVEL3,
  color: 'pink',
  shootCooldown: 1200,
  score: 10,
  deadScore: 20,
  bulletSpeedY: 600,

};

export const planeBossDotBullet: PlaneBulletParams = {
  type: PlaneBulletType.Normal,
  shape: PlaneBulletShape.Circle,
  bulletWidth: 14,
  bulletHeight: 14,
  bulletX: 0,
  bulletY: 0,
  bodyX: 0,
  bodyY: 0,
  size: 2,
  speedX: 400,
  speedY: 400,
  combat: 2,
  shootCooldown: 200,
  direction: [0, 1],
  canvasHeight: 0,
  canvasWidth: 0,
  bulletAngle:0,
};

export const planeJokerDotBullet: PlaneBulletParams = {
  type: PlaneBulletType.Normal,
  shape: PlaneBulletShape.Circle,
  bulletWidth: 14,
  bulletHeight: 14,
  bulletX: 0,
  bulletY: 0,
  bodyX: 0,
  bodyY: 0,
  size: 2,
  speedX: 4,
  speedY: 300,
  combat: 2,
  shootCooldown: 300,
  direction: [0, 1],
  canvasHeight: 0,
  canvasWidth: 0,
  bulletAngle:0,
};

export const planeSquadronBullet: PlaneBulletParams = {
  type: PlaneBulletType.Trace,
  shape: PlaneBulletShape.Circle,
  bulletWidth: 14,
  bulletHeight: 14,
  bulletX: 0,
  bulletY: 0,
  bodyX: 0,
  bodyY: 0,
  size: 2,
  speedX: 380,
  speedY: 380,
  combat: 2,
  shootCooldown: 1200,
  direction: [0, 1],
  canvasHeight: 0,
  canvasWidth: 0,
};

export const planeBigBullet: PlaneBulletParams = {
  type: PlaneBulletType.Normal,
  shape: PlaneBulletShape.Circle,
  bulletWidth: 14,
  bulletHeight: 14,
  bulletX: 0,
  bulletY: 0,
  bodyX: 0,
  bodyY: 0,
  size: 2,
  speedX: 200,
  speedY: 200,
  combat: 2,
  shootCooldown: 100,
  direction: [0, 1],
  canvasHeight: 0,
  canvasWidth: 0,
  bulletAngle:0,
};

// 爆炸损伤的生命值
export const DamageValueNumber = 1