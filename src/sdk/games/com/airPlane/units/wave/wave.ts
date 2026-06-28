import { PlaneWave } from '../../base/planeWave';
import { MiniPlaneEnemyType, type waveInfo, EnemyType } from '../../type';

// 第一阶段
export class WaveStep1 extends PlaneWave {
  gapTime = 600;
  lastTime = 0;

  updateWave(info: waveInfo) {
    // 没有配置 找子元素
    if (!this.config) return null;

    const { config } = this;

    // 时间判定
    // const subTime = info.gameTime - info.startTime;
    const isTimeReady = this.config.durTime <= info.gameTime;

    // 2. 得分判定（弹性模式）
    let isScoreReady = false;
    if (config.maxScore === 0) {
      isScoreReady = true;
    } else {
      // 弹性算法：得分越高，解锁越提前（最多提前30%的时间）
      const radio = info.currentScore / config.maxScore - 1;
      const progress = radio > 0 ? Math.min(radio, 1) : 0;
      const timeBonus = Math.min(progress * 0.3, 0.3);
      const adjustedTime = config.durTime * (1 - timeBonus);
      isScoreReady = info.gameTime >= adjustedTime;
    }
    // 时间 或者分数 达到解锁下一个波次
    if (isScoreReady || isTimeReady) {
      return this.nextWave;
    } else {
      return null;
    }
  }

  createEnemy() {
    if (!this.config) return null;

    // 对于普通的敌机 需要对生成的时间 以及屏幕最大敌机数量做限制
    const control = this.control;
    const size = control.unLockedEnemy[EnemyType.JOKER];
    if (size >= this.config?.maxCount) {
      return null;
    }

    const nowTime = Date.now();
    if (nowTime - this.lastTime < this.gapTime) {
      return null;
    }

    this.lastTime = nowTime;
    let type: any = Math.floor(Math.random() * 3);
    if (type == 0) {
      type = MiniPlaneEnemyType.LEVEL1;
    } else if (type == 1) {
      type = MiniPlaneEnemyType.LEVEL2;
    } else if (type == 2) {
      type = MiniPlaneEnemyType.LEVEL3;
    }

    const unitParams = {
      unitWidth: 80,
      unitHeight: 60,
      unitX: 0,
      unitY: 0,
      speedX: 0,
      speedY: 0,
      shootCooldown: 10,
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
      health: 1000,
      score: 10,
    };

    return {
      type: EnemyType.JOKER,
      params: unitParams,
      config: {
        type: type,
      },
    };
  }
}
