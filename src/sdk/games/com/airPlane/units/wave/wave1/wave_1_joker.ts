import type { PlaneWave } from '../../../base/planeWave';
import { JokerCreater } from '../../../creater/createJoker';
import { MiniPlaneEnemyType, type WaveEnemyConfig } from '../../../type';

export class Wave_1_Joker extends JokerCreater {
  gapTime = 600;
  lastTime = 0;

  // 配置的规则
  minScore = 0;
  maxScore = 800;

  checkRule(wave: PlaneWave): boolean {
    if (wave.waveScore < this.minScore || wave.waveScore > this.maxScore) {
      return false;
    }

    const nowTime = Date.now();
    if (nowTime - this.lastTime < this.gapTime) {
      return false;
    }

    this.lastTime = nowTime;
    return true;
  }

  builder(): WaveEnemyConfig | null {
    let type: any = Math.floor(Math.random() * 3);
    if (type == 0) {
      type = MiniPlaneEnemyType.LEVEL1;
    } else if (type == 1) {
      type = MiniPlaneEnemyType.LEVEL2;
    } else if (type == 2) {
      type = MiniPlaneEnemyType.LEVEL3;
    }

    this.config.type = type;
    return super.builder();
  }
}
