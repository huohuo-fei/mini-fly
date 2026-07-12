import type { PlaneWave } from '../../../base/planeWave';
import { BigCreater } from '../../../creater/createBig';
import { EnemyType } from '../../../type';

export class Wave_2_Big extends BigCreater {
  ind: number = 0;

  minScore = 1000;
  maxScore = 3000;
  checkRule(wave: PlaneWave): boolean {
    if (wave.waveScore < this.minScore || wave.waveScore > this.maxScore) {
      return false;
    }
    const size = wave.control.unLockedEnemy[EnemyType.BIG];
    if (size >= 1) {
      return false;
    } else {
      return true;
    }
  }

}
