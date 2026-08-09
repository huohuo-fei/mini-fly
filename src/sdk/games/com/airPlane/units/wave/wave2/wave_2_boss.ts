import type { PlaneWave } from '../../../base/planeWave';
import { BossCreater } from '../../../creater/createBoss';
import { EnemyType } from '../../../type';

export class Wave_2_Boss extends BossCreater {
  checkRule = (wave: PlaneWave) => {
    const size = wave.control.unLockedEnemy[EnemyType.BOSS];
    if (size >= 1) {
      return false;
    }
    return true;
  };
}
