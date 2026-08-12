import type { IMiniGameParams } from '../../../../type';
import type { EnemyConfig, WaveEnemyConfig, waveInfo } from '../type';
import type { PlaneControl } from '../units/control';
import type { PlaneCreater } from './planeCreater';

// 波次系统
export class PlaneWave {
  children: PlaneCreater[] = [];
  nextWave: PlaneWave | null = null;

  // 是否启用当前波次 -- 主要在最开始做条件判断
  enable: boolean = false

  control: PlaneControl;
  config: EnemyConfig | null = null;
  gameParams: IMiniGameParams;

  // 波次过渡，用于控制当前波次和下一波次之间的过渡
  waveTrans:boolean = false

  //------ 外部参数 ------//

  // 全局分数
  totalScore: number = 0;
  // 全局的游戏时间
  totalTime:number = 0
  // 当前波次获得的分数
  waveScore: number = 0;
  // 当前波次进行的时间
  waveTime: number = 0;
  perScore: number = 0;
  perTime: number = 0;
  


  constructor(
    gameParams: IMiniGameParams,
    control: PlaneControl,
    config?: EnemyConfig
  ) {
    this.gameParams = gameParams;
    this.control = control;
    if (config) {
      this.config = JSON.parse(JSON.stringify(config));
    }
    this.loadCreater()
  }

  loadCreater(){}

  loadConfig(config: EnemyConfig) {
    this.config = JSON.parse(JSON.stringify(config)); 
  }

  // 校验波次 依据条件返回最新的波次
  updateWave(info: waveInfo): PlaneWave | null {
    console.log(info);
    return null;
  }

  // 创建敌人
  createEnemy(): WaveEnemyConfig[] {
    console.warn('createEnemy 需要内部自己实现');
    return [];
  }

  appendChild(child: PlaneCreater) {
    this.children.push(child);
  }

  appendNextWave(nextWave: PlaneWave) {
    this.nextWave = nextWave;
  }

  transNext(): null | PlaneWave {
    return null
  }
}
