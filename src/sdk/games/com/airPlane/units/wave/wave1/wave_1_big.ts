import type { PlaneWave } from '../../../base/planeWave';
import { BigCreater } from '../../../creater/createBig';
import { EnemyType } from '../../enemy/type';
import type { WaveEnemyConfig } from '../type';

export class Wave_1_Big extends BigCreater {
  ind: number = 0;

  minScore = 200;
  maxScore = 1000;

  num = 0;

  checkRule = (wave: PlaneWave) => {
    if (wave.waveScore < this.minScore || wave.waveScore > this.maxScore) {
      return false;
    }
    const size = wave.control.unLockedEnemy[EnemyType.BIG];
    if (size >= 2) {
      return false;
    } else {
      // 小于 2 需要判断是否可以创建
      if (this.num === 2) {
        // 已经创建过两个 ,需要两个全都消失 才会新创建
        if (size === 0) {
          this.num = 0;
          return true;
        } else {
          return false;
        }
      } else {
        // 第一次创建
        return true;
      }
    }
  };

  builder(): WaveEnemyConfig | null {
    this.num++;
    let x = 0;
    if (this.num === 2) {
      x = 60;
    } else {
      x = 400;
    }
    this.config.x = x;
    return super.builder();
  }
}
