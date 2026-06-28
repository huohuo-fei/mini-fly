import { EnemyType, type EnemyConfig } from '../../type';

// export const WAVE_CONFIG: EnemyConfig[] = [
//   {
//     id: '1',
//     waveName: '第一阶段',
//     enemyType: EnemyType.JOKER,
//     unlockTime: 0, // 0秒解锁
//     unlockScore: 0, // 0分解锁
//     maxCount: 20, // 屏幕最大存在数量
//     priority: 1,
//     children: [],
//     next: null,
//     parent: null,
//   },
//   {
//     id: '2',
//     waveName: '强化敌机登场',
//     enemyType: EnemyType.BIG,
//     unlockTime: 15, // 15秒后解锁
//     unlockScore: 200, // 或200分解锁
//     maxCount: 2,
//     priority: 2,
//     children: [
//       {
//         id: '2-1',
//         waveName: '强化敌机二次登场',
//         enemyType: EnemyType.BIG,
//         unlockTime: 15, // 15秒后解锁
//         unlockScore: 200, // 或200分解锁
//         maxCount: 2,
//         priority: 2,
//         children: [],
//         next: null,
//         parent: null,
//       },
//       {
//         id: '2-2',
//         waveName: '强化敌机三次登场',
//         enemyType: EnemyType.BIG,
//         unlockTime: 15, // 15秒后解锁
//         unlockScore: 200, // 或200分解锁
//         maxCount: 2,
//         priority: 2,
//         children: [],
//         next: null,
//         parent: null,
//       },
//     ],
//     next: null,
//     parent: null,
//   },
//   {
//     id: '3',

//     waveName: '大批敌机编队来袭',
//     enemyType: EnemyType.SQUADRON,
//     unlockTime: 40,
//     unlockScore: 800,
//     maxCount: 4,
//     priority: 3,
//     children: [],
//     next: null,
//     parent: null,
//   },
//   {
//     id: '4',

//     waveName: '大Boss降临',
//     enemyType: EnemyType.BOSS,
//     unlockTime: 90,
//     unlockScore: 3000,
//     maxCount: 1,
//     priority: 4,
//     isBoss: true,
//     children: [],
//     next: null,
//     parent: null,
//   },
// ];

export const WAVE_1_CONFIG: EnemyConfig = {
  id: '1',
  waveName: '第一波敌机来袭',
  enemyType: EnemyType.JOKER,
  durTime: 0.1 * 60 * 1000,
  maxScore: 500,
  maxCount: 20,
  priority: 1,
};

export const WAVE_2_CONFIG:EnemyConfig = {
  id: '1',
  waveName: '第二波敌机来袭',
  enemyType: EnemyType.SQUADRON,
  durTime: 0.1 * 60 * 1000,
  maxScore: 1000,
  maxCount: 2, 
  priority: 1,
};
