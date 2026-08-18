import { PlaneBulletType, type PlaneBulletParams, PlaneBulletShape } from "../../base/type";

export const planeMainBulletConfig: PlaneBulletParams = {
  type: PlaneBulletType.Normal,
  shape: PlaneBulletShape.Rect,
  bulletWidth: 12,
  bulletHeight: 32,
  bulletX: 0,
  bulletY: 0,
  bodyX: 0,
  bodyY: 0,
  size: 1,
  speedX: 60,
  speedY: 800,
  combat: 2,
  shootCooldown: 180,
  direction: [0, -1],
  canvasHeight: 0,
  canvasWidth: 0,
};