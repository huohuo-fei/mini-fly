import type { MiniFly } from '../..';
import type { IMiniGam, IMiniGameParams } from '../../../../../type';
import { type IMiniPlaneToolInfo, MiniPlaneToolType } from '../../type';
import { PlaneTool } from './planeTool';
import { planeToolConfig } from '../../config';

import boomSvg from '@/assets/game/plane/boom.svg';
import doubleSvg from '@/assets/game/plane/double.svg';
import lifeSvg from '@/assets/game/plane/life.svg';
import shieldSvg from '@/assets/game/plane/shield.svg';
import { MiniUtils } from '../../../../../utils/MiniUtils';
export class PlaneToolBox implements IMiniGam {
  miniFly: MiniFly;
  gameParams: IMiniGameParams;
  toolList: PlaneTool[] = [];

  constructor(params: IMiniGameParams, miniFly: MiniFly) {
    this.miniFly = miniFly;
    this.gameParams = params;
    this.loadResources();
  }

  loadResources() {
    MiniUtils.loadImageList([boomSvg, lifeSvg, shieldSvg, doubleSvg]).then(
      (res: any) => {
        // 加载资源完毕
        console.log('res>>>>>>', res);
        this.addTool(50,20, MiniPlaneToolType.BOMB)
        this.addTool(50,50, MiniPlaneToolType.LIFE)
        this.addTool(50,90, MiniPlaneToolType.SHIELD)
        this.addTool(50,140, MiniPlaneToolType.DOUBLE)
      }
    );
  }

  // 添加一个工具
  addTool(x: number, y: number, type: MiniPlaneToolType) {
    const config = JSON.parse(
      JSON.stringify(planeToolConfig)
    ) as IMiniPlaneToolInfo;

    let resourceUrl = '';
    switch (type) {
      case MiniPlaneToolType.BOMB:
        resourceUrl = boomSvg;
        break;
      case MiniPlaneToolType.DOUBLE:
        resourceUrl = doubleSvg;
        break;
      case MiniPlaneToolType.LIFE:
        resourceUrl = lifeSvg;
        break;
      case MiniPlaneToolType.SHIELD:
        resourceUrl = shieldSvg;
        break;
      default:
        resourceUrl = '';
    }

    const resource = MiniUtils.getImage(resourceUrl);
    config.x = x;
    config.y = y;
    config.type = type;
    const tool = new PlaneTool(config,resource, this.gameParams);
    this.toolList.push(tool);
  }

  render(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.toolList.length; i++) {
      const tool = this.toolList[i];
      tool.render(ctx);
    }
  }
  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
