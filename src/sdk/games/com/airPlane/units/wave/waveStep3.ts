import { PlaneWave } from '../../base/planeWave';
import { bigEnemyConfig } from '../../config';
import { type waveInfo, EnemyType } from '../../type';

// 第一阶段
export class WaveStep3 extends PlaneWave {
  gapTime = 100;
  lastTime = 0;
  ind:number = 0

  updateWave(info: waveInfo) {
    // 没有配置 找子元素
    if (!this.config) return null;

    const { config } = this;

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
    const size = control.unLockedEnemy[EnemyType.BIG];
    if (size >= this.config?.maxCount) {
      return null;
    }

    const nowTime = Date.now();
    if (nowTime - this.lastTime < this.gapTime) {
      return null;
    }

    this.lastTime = nowTime;

    const config = JSON.parse(JSON.stringify(bigEnemyConfig));

    if(this.ind % 2 === 0){
      config.x = 60;
    }else{
      config.x = 400;
    }

    config.targetHeight = 100;
    
    const unitParams = {
      unitWidth: 0,
      unitHeight: 0,
      unitX: 0,
      unitY: 0,
      speedX: 1,
      speedY: 1,
      shootCooldown: 600,
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
      health: 10,
      score: 200,
    }
    this.ind++

    return {
      type: EnemyType.BIG,
      params: unitParams,
      config: config,
    };
  }
}
