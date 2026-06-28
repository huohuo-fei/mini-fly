// 贯穿整个游戏的生命周期
// 依据 时间 分数 控制游戏内的各种行为

import type { MiniFly } from '../..';
import { PlaneBase } from '../../base/planeBase';
import type { PlaneWave } from '../../base/planeWave';
import { EnemyType } from '../../type';
import type { PlaneEnemy } from '../enemy/planeEnemy';
import { WAVE_1_CONFIG, WAVE_2_CONFIG } from '../wave/config';
import { WaveStep1 } from '../wave/wave';
import { WaveStep2 } from '../wave/waveStep2';

export class PlaneControl extends PlaneBase {
  initFlag: boolean = false;

  minifly: MiniFly;
  planeEnemy: PlaneEnemy;

  // 游戏时间
  startTime: number = 0;
  gamingTime: number = 0;

  // 游戏分数
  currentScore: number = 0;

  // 当前画布敌机类型 数量
  unLockedEnemy: { [EnemyType: string]: number } = {
    [EnemyType.BIG]: 0,
    [EnemyType.JOKER]: 0,
    [EnemyType.SQUADRON]: 0,
    [EnemyType.BOSS]: 0,
  };

  // 波次结构树
  waveTree: PlaneWave | null = null;

  // 当前激活的波次
  activeWave: PlaneWave | null = null;

  constructor(minifly: MiniFly, planeEnemy: PlaneEnemy) {
    super();
    this.minifly = minifly;
    this.planeEnemy = planeEnemy;

    this.init();
  }

  init() {
    this.startTime = Date.now();
    this.initWave();
  }

  // 初始化波次
  initWave() {
    const t1 = new WaveStep1(this.planeEnemy.gameParams, this, WAVE_1_CONFIG);

    const t2 = new WaveStep2(this.planeEnemy.gameParams, this, WAVE_2_CONFIG);

    t1.appendNextWave(t2);

    // todo : 后续追加波次结构
    this.waveTree = t2;
    this.activeWave = t2;
  }

  // 依据当前的波次 生成敌机
  createEnemy() {
    if (!this.activeWave) {
      return;
    }
    const enemyConfig = this.activeWave.createEnemy();
    if (enemyConfig) {
      this.planeEnemy.buildEnemyByConfig(enemyConfig);
      // console.log(enemyConfig.type,'type');
      
      const type = enemyConfig.type;
      this.unLockedEnemy[type] += 1;
    }
  }

  // 更新数量
  updateEnemyCountSub(type: EnemyType) {
    this.unLockedEnemy[type] -= 1;
  }

  updateWave() {
    if (this.activeWave) {
      const info = {
        startTime: this.startTime,
        gameTime: this.gamingTime,
        currentScore: this.currentScore,
      };
      const newWave = this.activeWave.updateWave(info);
      if (newWave) {
        this.activeWave = newWave;
      }else{
        // todo : 游戏结束
        // console.log('游戏结束');
        
      }
      this.createEnemy();
    }
  }

  render(): void {
    const now = Date.now();
    this.gamingTime = now - this.startTime;
    this.updateWave();
  }
}
