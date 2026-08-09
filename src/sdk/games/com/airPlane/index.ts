// 飞机大战
import type {
  IMiniActParams,
  IMiniGameParams,
} from '../../../type';
import { PlaneAttacker } from './units/attacker/planeAttacker';

import { PlaneBg } from './units/background/planeBg';
import { PlaneEnemy } from './units/enemy/planeEnemy';
import { PlaneEffect } from './units/effect/planeEffects';
import { EnemyType, MiniPlaneToolType, type IMiniPlaneEffectType } from './type';
import { PlaneBar } from './units/bar/planeBar';
import { PlaneToolBox } from './units/tools/planeToolBox';

import { PlaneControl } from './units/control';
import type { PlaneUnit } from './base/planeUnit';
import { PlaneText } from './units/textTip/textTip';
import { MiniFlyState } from './state/flyState';
import { PlaneBullets } from './bullet';
import { MiniBase } from '../../../miniBase/miniBase';
import type { MiniScreen } from '../../..';

export class MiniFly extends MiniBase {
  events: Map<string, Set<Function>> = new Map();
  planeBackground: PlaneBg;
  planeAttacker: PlaneAttacker;
  planeEnemy: PlaneEnemy;
  planeEffect: PlaneEffect;
  planeBar: PlaneBar;
  planeToolBox: PlaneToolBox;
  planeControl: PlaneControl;
  planeText:PlaneText
  planeBullets:PlaneBullets
  screen:MiniScreen

  constructor(screen:MiniScreen,gameParams: IMiniGameParams) {
    super()
    // 初始化内部状态
    MiniFlyState.reset()

    this.screen = screen

    // 加载各个模块
    this.planeBullets = new PlaneBullets(gameParams,this)
    this.planeBackground = new PlaneBg();
    this.planeAttacker = new PlaneAttacker(gameParams,this);
    this.planeEnemy = new PlaneEnemy(gameParams, this);
    this.planeEffect = new PlaneEffect();
    this.planeBar = new PlaneBar(this);
    this.planeToolBox = new PlaneToolBox(gameParams, this);
    this.planeControl = new PlaneControl(this, this.planeEnemy);
    this.planeText = new PlaneText(gameParams,this)
  }

  // render 方法
  render(ctx: CanvasRenderingContext2D) {
    this.planeControl.updateWave();
    this.planeBackground.render(ctx);
    this.planeBullets.render(ctx);
    this.planeAttacker.render(ctx);
    this.planeEnemy.render(ctx);
    this.planeEffect.render(ctx);
    this.planeBar.render(ctx);
    this.planeToolBox.render(ctx);
    this.planeText.render(ctx);
    this.bulletHitEnemy();
    this.enemyHitAttacker()
    this.catchTool();
    this.updateTime();
  }

  // 渲染暂停，主要是控制内部的时间系统
  pauseRender() {
    MiniFlyState.pauseTemp = new Date().getTime();
    
  }

  // 子弹击中敌机
  bulletHitEnemy() {
    this.planeBullets.checkHitEnemy((bullet) => {
      return this.planeEnemy.isHitEnemy(bullet);
    });
  }

  // 敌机击中战机
  enemyHitAttacker() {
    this.planeBullets.checkHitPlayer((bullet) => {
      return this.planeAttacker.checkHitByEnemy(bullet);
    });
  }

  // 战机捕获工具
  catchTool() {
    const { attackerX, attackerY, PLAYER_WIDTH, PLAYER_HEIGHT } =
      this.planeAttacker;
    this.planeToolBox.catchTool(
      attackerX,
      attackerY,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    );
  }

  // 生成一个爆炸图
  createEffect(
    type: IMiniPlaneEffectType,
    x: number,
    y: number,
    other?: any,
    cb?: () => void
  ) {
    this.planeEffect.createEffect(type, x, y, other, cb);
  }

  // 更新局内分数
  updateScore(score: number) {
    MiniFlyState.score = MiniFlyState.score + score;
  }

  // 更新生命值
  updateLife(val: number) {
    MiniFlyState.life = MiniFlyState.life + val;
  }

  // 更新时间
  updateTime() {
    MiniFlyState.duration = new Date().getTime();
  }

  // 更新道具
  updateToolBox(enemy: PlaneUnit) {
    this.planeToolBox.buildTool(enemy);
    // this.planeToolBox.buildToolTest(enemy,MiniPlaneToolType.BOMB)
  }

  removeControlEnemyByType(type: EnemyType) {
    this.planeControl.updateEnemyCountSub(type);
  }

  actionDoing(p: IMiniActParams) {
    this.planeAttacker.actionDoing(p);
  }
}
