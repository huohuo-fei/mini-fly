import type { IMiniGameParams } from '../../../../type';
import type { EnemyConfig, WaveEnemyConfig, waveInfo } from '../type';
import type { PlaneControl } from '../units/control';

// 波次系统
export class PlaneWave {
  children: PlaneWave[] = [];
  nextWave: PlaneWave | null = null;

  control: PlaneControl;
  config: EnemyConfig | null = null;
  gameParams: IMiniGameParams;

  // state:

  constructor(
    gameParams: IMiniGameParams,
    control: PlaneControl,
    config?: EnemyConfig
  ) {
    this.gameParams = gameParams;
    this.control = control;
    if (config) {
      this.config = JSON.parse(JSON.stringify(config));
    }
  }

  loadConfig(config: EnemyConfig) {
    this.config = JSON.parse(JSON.stringify(config)); 
  }

  // 校验波次
  updateWave(info: waveInfo): PlaneWave | null {
    return null;
  }

  // 创建敌人
  createEnemy(): WaveEnemyConfig | null {
    console.warn('createEnemy 需要内部自己实现');
    return null;
  }

  appendChild(child: PlaneWave) {
    this.children.push(child);
  }

  appendNextWave(nextWave: PlaneWave) {
    this.nextWave = nextWave;
  }
}
