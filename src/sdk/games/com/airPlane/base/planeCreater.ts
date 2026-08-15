import { EnemyType } from '../units/enemy/type';
import type { WaveEnemyConfig } from '../units/wave/type';
import type { PlaneWave } from './planeWave';

// 每种敌机类型对应的生成器
export abstract class PlaneCreater {
  // 敌机类型
  type: EnemyType = EnemyType.BIG;

  // 敌机行为配置
  config: any = null;

  // 敌机外观参数
  params: any = null;

  // 提示文字
  tip: string = '';

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

  builder(): WaveEnemyConfig | null {
    return {
      type: this.type,
      config: this.config,
      params: this.params,
    };
  }

  abstract checkRule: (wave: PlaneWave) => boolean;
}
