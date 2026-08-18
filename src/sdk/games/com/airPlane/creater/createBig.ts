import { PlaneCreater } from '../base/planeCreater';
import type { PlaneUnitParams } from '../base/type';
import type { IBigEnemyConfig } from '../units/enemy/type';

/**
 * BigCreater抽象类，实现了IPlaneCreater接口
 * 用于创建大型飞机单位
 */
export abstract class BigCreater extends PlaneCreater {
  /**
   * PlaneUnitParams类型属性，定义飞机单位的基本参数
   * 包含尺寸、位置、速度、冷却时间、画布尺寸、生命值和分数等属性
   */
  params: PlaneUnitParams = {
    unitWidth: 0,      // 单位宽度
    unitHeight: 0,
    unitX: 0,
    unitY: 0,
    speedX: 1,
    speedY: 1,
    shootCooldown: 600,
    canvasHeight: 0, // this.gameParams.canvasHeight,
    canvasWidth: 0, // this.gameParams.canvasWidth,
    health: 30,
    score: 200,
  };

  config: IBigEnemyConfig = {
    x: 100,
    speed: 1,
    targetHeight: 100, 
    shootCooldown: 300,
    radius: 50,
    angleSpeed: 0.01,
  };

  tip: string = '强化敌机来袭'

}
