import type { PlaneWave } from '../../../base/planeWave';
import { SquadronCreater } from '../../../creater/createSquadron';
import { EnemyType } from '../../enemy/type';
import type { WaveEnemyConfig } from '../type';

export class Wave_2_Squadron extends SquadronCreater {
  gapTime = 600;
  lastTime = 0;

  // 配置的规则
  minScore = 4000;
  maxScore = 8000;
  num = 0;

  checkRule = (wave: PlaneWave) => {
    // 1.判断分数
    if (wave.waveScore < this.minScore || wave.waveScore > this.maxScore) {
      return false;
    }

    // 判断数量
    const size = wave.control.unLockedEnemy[EnemyType.SQUADRON];
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
    const width = this.params.canvasWidth
    // const widthGap = width * 0.2
    if (this.num === 2) {
      this.config.angle = 0;
      this.config.startX = 0;
    } else {
      this.config.angle = -Math.PI;
      const { w, count, gap } = this.config;
      const dis = w * count + gap * (count - 1);
      this.config.startX =  width  + dis;
    }

    return super.builder();
  }
}
