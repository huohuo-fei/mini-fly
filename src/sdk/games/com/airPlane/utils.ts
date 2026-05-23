import type { IMiniPlaneMainParams } from './type';

export function buildMainPlaneConfig(
  w: number,
  h: number,
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number,
  shootCooldown: number
): IMiniPlaneMainParams {
  return {
    canvasHeight,
    canvasWidth,
    h,
    shootCooldown,
    w,
    x,
    y,
  };
}
