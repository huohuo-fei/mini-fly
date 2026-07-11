import { EnemyCreaterStatus, EnemyType, type WaveEnemyConfig } from '../type';
import type { PlaneControl } from '../units/control';
import type { PlaneWave } from './planeWave';

// 每种敌机类型对应的生成器
export class PlaneCreater {
  // 敌机类型
  type: EnemyType = EnemyType.BIG;

  // 敌机行为配置
  config: any = null;

  // 敌机外观参数
  params: any = null;

  // 状态
  status: EnemyCreaterStatus = EnemyCreaterStatus.PEDDING;

  constructor(type: EnemyType) {
    this.type = type;
    this.config = null;
    this.params = null;
  }

  // 混入外部传入的配置
  loadConfig(config: any) {
    Object.assign(this.config, config);
  }

  // 混入外部传入的参数
  loadParams(params: any) {
    Object.assign(this.params, params);
  }

  checkRule(wave:PlaneWave): boolean {
    console.log(wave,'需要上层实现');
    return true;
  }

  builder(): WaveEnemyConfig | null {
    // if (!this.checkRule(wave)) return null;
    return {
      type: this.type,
      config: this.config,
      params: this.params,
    };
  }
}
