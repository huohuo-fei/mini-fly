import { EnemyType, type EnemyConfig } from '../../type';

export const WAVE_1_CONFIG: EnemyConfig = {
  id: '1',
  waveName: '第一波敌机来袭',
  enemyType: EnemyType.JOKER,
  durTime: 0.5 * 60 * 1000,
  maxScore: 1000,
  maxCount: 10,
  priority: 1,
};

export const WAVE_2_CONFIG:EnemyConfig = {
  id: '1',
  waveName: '第二波敌机来袭',
  enemyType: EnemyType.SQUADRON,
  durTime: 1 * 60 * 1000,
  maxScore: 2000,
  maxCount: 2, 
  priority: 1,
};

export const WAVE_3_CONFIG:EnemyConfig = {
  id: '1',
  waveName: '第三波敌机来袭',
  enemyType: EnemyType.BIG,
  durTime: 1.5 * 60 * 1000,
  maxScore: 4000,
  maxCount: 2, 
  priority: 1,
};
