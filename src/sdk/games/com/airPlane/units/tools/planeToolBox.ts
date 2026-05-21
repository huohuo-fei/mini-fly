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
import type { PlaneEnemyUnit } from '../enemy/planeEnemyUnit';
export class PlaneToolBox implements IMiniGam {
  miniFly: MiniFly;
  gameParams: IMiniGameParams;
  toolList: PlaneTool[] = [];
  loaded: boolean = false;

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
        // this.addTool(50, 20, MiniPlaneToolType.BOMB);
        // this.addTool(50, 50, MiniPlaneToolType.LIFE);
        // this.addTool(50, 90, MiniPlaneToolType.SHIELD);
        // this.addTool(50, 140, MiniPlaneToolType.DOUBLE);
        this.loaded = true;
      }
    );
  }

  buildTool(enemyUnit: PlaneEnemyUnit) {
    if (!this.loaded) return;
    // todo:抽取资源加载逻辑，或者加缓存队列
    // 生成工具，有两个前置条件：
    // 1. 当前工具数量小于5
    // 2.每个旗子死亡后 有 1/4 的概率生成工具

    if (this.toolList.length < 5 && Math.random() < 0.25) {
      const x = enemyUnit.cx;
      const y = enemyUnit.cy;
      const speedY = enemyUnit.enemyUnit.speedY;

      // 随机生成工具类型
      const typeNum = Math.floor(Math.random() * 4);
      const type = this.convertToolType(typeNum);
      this.addTool(x, y, type, speedY);
    }
  }

  // 添加一个工具
  addTool(x: number, y: number, type: MiniPlaneToolType, speedY: number = 2) {
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
    config.x = x - config.w / 2;
    config.y = y - config.h / 2;
    config.type = type;
    config.speedY = speedY;
    const tool = new PlaneTool(config, resource, this.gameParams, this);
    this.toolList.push(tool);
  }

  // 移除工具
  removeTool(tool: PlaneTool) {
    const index = this.toolList.indexOf(tool);
    if (index > -1) {
      this.toolList.splice(index, 1);
    }
  }

  catchTool(x:number,y:number,w:number,h:number) {
    for (let i = 0; i < this.toolList.length; i++) {
      const tool = this.toolList[i];
      if (tool.isHit(x,y,w,h)) {
        this.removeTool(tool);
         switch(tool.type){
          case MiniPlaneToolType.DOUBLE:
            this.miniFly.planeAttacker.doubleBullet()
            break;
          case MiniPlaneToolType.LIFE:
            break;
          case MiniPlaneToolType.SHIELD:
            break;
          case MiniPlaneToolType.BOMB:
            break;
         }
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.toolList.length; i++) {
      const tool = this.toolList[i];
      tool.render(ctx);
    }
  }

  convertToolType(type: number) {
    switch (type) {
      case 0:
        return MiniPlaneToolType.BOMB;
      case 1:
        return MiniPlaneToolType.LIFE;
      case 2:
        return MiniPlaneToolType.SHIELD;
      case 3:
        return MiniPlaneToolType.DOUBLE;
    }

    return MiniPlaneToolType.BOMB;
  }
  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
