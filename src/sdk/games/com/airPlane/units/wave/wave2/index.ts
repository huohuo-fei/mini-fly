import { PlaneWave } from '../../../base/planeWave';
import { type waveInfo, EnemyType, IMiniPlaneEffectType } from '../../../type';
import { Wave_2_Big } from './wave_2_big';
import { Wave_2_Boss } from './wave_2_boss';
import { Wave_2_Squadron } from './wave_2_squadron';

// 第一阶段
export class Wave_2 extends PlaneWave {
  beforeState: 'pedding' | 'loading' | 'loaded' = 'pedding';

  loadCreater(): void {
    const boss = new Wave_2_Boss(EnemyType.BOSS);
    boss.loadParams({
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
    });

    const big = new Wave_2_Big(EnemyType.BIG);
    big.loadParams({
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
      health: 100,
    });

    big.loadConfig({
      x: 250,
      targetHeight: 300,
      speed: 0.5,
    });

    const sq = new Wave_2_Squadron(EnemyType.SQUADRON);

    sq.loadParams({
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
      speedX: 1,
    });

    sq.loadConfig({
      startY: 100,
    });
    this.children.push(boss, big, sq);
  }

  updateWave(info: waveInfo) {
    // 没有配置
    if (!this.config) return null;
    if (this.waveTrans) {
      return this.transNext();
    }

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

    const { waveTime } = this;

    const isTimeReady = this.config.durTime <= waveTime;

    // boss 关 只考虑时间
    if ( isTimeReady) {
      this.control.enable = false
      this.control.planeEnemy.bossBack()
      return null
    } else {
      return null;
    }
  }

  createEnemy() {
    if(this.beforeState === 'pedding'){
      this.beforeCreate()
    }
    if (this.beforeState !== 'loaded') return [];
    if (!this.config) return [];

    // 筛选出当前激活的敌机列表
    const activeList = this.children.filter((item) =>
      item.checkRule(this as PlaneWave)
    );

    const arr = activeList.filter((item) => item.builder() !== null);
    return arr;
  }

  beforeCreate() {
    this.beforeState = 'loading';
    // 在正式波次之前的钩子
    this.control.miniFly.createEffect(
      IMiniPlaneEffectType.TEXT,
      0,
      0,
      {
        text: 'BOSS 来袭',
        type:'dan'
      },
      () => {
        this.beforeState = 'loaded';
      }
    );
  }
}
