import { PlaneWave } from '../../../base/planeWave';
import { type waveInfo, EnemyType } from '../../../type';
import { Wave_2_Big } from './wave_2_big';
import { Wave_2_Boss } from './wave_2_boss';
import { Wave_2_Squadron } from './wave_2_squadron';

// 第一阶段
export class Wave_2 extends PlaneWave {
  gapTime = 100;
  lastTime = 0;
  ind: number = 0;

  //
  loadCreater(): void {
    const boss = new Wave_2_Boss(EnemyType.BOSS);
    boss.loadParams({
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
    });

    const big = new Wave_2_Big(EnemyType.BIG)
    big.loadParams({
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
      health: 100,
    });

    big.loadConfig({
      x:250,
      targetHeight:300,
      speed:0.5
    })

    const sq = new Wave_2_Squadron(EnemyType.SQUADRON)

    sq.loadParams({
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
      speedX:1
    });

    sq.loadConfig({
      startY:100
    })
    this.children.push(boss,big,sq);
  }

  updateWave(info: waveInfo) {
    // 没有配置
    if (!this.config) return null;

    // 初始化波次参数
    if (!this.enable) {
      this.enable = true;
      this.perScore = info.currentScore;
      this.perTime = info.gameTime;
      this.totalScore = info.currentScore;
      this.totalTime = info.gameTime;
      this.waveScore = info.currentScore;
      this.waveTime = info.gameTime;
    }

    this.totalScore = info.currentScore;
    this.totalTime = info.gameTime;
    this.waveScore = this.totalScore - this.perScore;
    this.waveTime = this.totalTime - this.perTime;

    const { config, waveScore, waveTime } = this;

    const isTimeReady = this.config.durTime <= waveTime;

    // 2. 得分判定（弹性模式）
    let isScoreReady = false;
    if (config.maxScore === 0) {
      isScoreReady = true;
    } else {
      // 弹性算法：得分越高，解锁越提前（最多提前30%的时间）
      const radio = waveScore / config.maxScore - 1;
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
    if (!this.config) return [];

    // 筛选出当前激活的敌机列表
    const activeList = this.children.filter((item) =>
      item.checkRule(this as PlaneWave)
    );

    const arr = activeList.filter((item) => item.builder() !== null);
    return arr;
  }
}
