import type { EnemyConfig } from "./type";

export const WAVE_1_CONFIG:EnemyConfig = {
  id: '1',
  waveName: '第一波敌机来袭',
  durTime: 1 * 60 * 1000,
  maxScore: 2000,
  maxCount: 2, 
  priority: 1,
};

export const WAVE_2_CONFIG:EnemyConfig = {
  id: '2',
  waveName: 'BOSS来袭',
  durTime: 2 * 60 * 1000,
  maxScore: 9999999,
  maxCount: 1, 
  priority: 1,
};
