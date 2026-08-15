import { PlaneWave } from '../../../base/planeWave';
import { EnemyType } from '../../enemy/type';
import type { waveInfo } from '../type';
import { Wave_1_Big } from './wave_1_big';
import { Wave_1_Joker } from './wave_1_joker';
import { Wave_1_Squadron } from './wave_1_squadron';

// 第一阶段
export class Wave_1 extends PlaneWave {
  loadCreater() {
    const c1 = new Wave_1_Joker(EnemyType.JOKER);
    c1.loadParams({
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
    });

    const c2 = new Wave_1_Big(EnemyType.BIG);
    c2.loadParams({
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
    });

    const c3 = new Wave_1_Squadron(EnemyType.SQUADRON);
    c3.loadParams({
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
      speedX:100
    });

    // this.children.push(c3);
    this.children.push(c1,c2,c3);
  }

  updateWave(info: waveInfo) {
    if(this.waveTrans){
      return this.transNext()
    }
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
      this.waveTrans = true
      return null
    } else {
      return null;
    }
  }

  transNext(){
    // 当前屏幕中没有上一个波次的敌机
    const count = this.control.planeEnemy.getEnemyCount()
    if(count === 0){
      return this.nextWave
    }else{
      return null
    }
  }

  createEnemy() {
    if (!this.config) return [];
    if(this.waveTrans) return []

    // 筛选出当前激活的敌机列表
    const activeList = this.children.filter(
      (item) => item.checkRule(this as PlaneWave)
    );

    const arr = activeList.filter((item) => item.builder() !== null)
    return arr;
  }
}
