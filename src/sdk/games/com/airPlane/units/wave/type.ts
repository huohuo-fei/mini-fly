import type { PlaneUnitParams } from "../../base/type";
import type { EnemyType } from "../enemy/type";

export type EnemyConfig = {
  id:string,
  // 波次名称
  waveName: string,
  // 敌机类型
  // enemyType: EnemyType,
  // 持续时间
  durTime: number,
  // 当前波次的最大分数
  maxScore: number,
  // 屏幕最大存在数量
  maxCount: number,
  // 优先级
  priority: number,
  // 是否是boss
  isBoss?: boolean,
  // 是否无限生成
  isInfinite?: boolean,
  // 其他配置
  otherConfig?:any
}

// 当前波次的详细信息 用于判断是否进入下一个波次
export type waveInfo = {
  // startTime: number;
  gameTime: number;
  currentScore: number;
};

// 由波次系统生成敌机的配置
export type WaveEnemyConfig = {
  type:EnemyType,
  params:PlaneUnitParams,
  config:any
}