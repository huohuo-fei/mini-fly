import type { PlaneWave } from '../../../base/planeWave';
import { BossCreater } from '../../../creater/createBoss';
import { EnemyType } from '../../enemy/type';

export class Wave_2_Boss extends BossCreater {
  once:boolean = false;
  checkRule = (wave: PlaneWave) => {
    if(this.once) return false;
    this.once = true;
    const size = wave.control.unLockedEnemy[EnemyType.BOSS];
    if (size >= 1) {
      return false;
    }
    return true;
  };
}
