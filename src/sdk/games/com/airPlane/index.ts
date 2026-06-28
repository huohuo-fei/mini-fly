// 飞机大战
import type { IMiniActParams, IMiniGam, IMiniGameParams } from '../../../type';
import { PlaneAttacker } from './units/attacker/planeAttacker';

import { PlaneBg } from './units/background/planeBg';
import { PlaneEnemy } from './units/enemy/planeEnemy';
import { PlaneEffect } from './units/effect/planeEffects';
import { EnemyType, type IMiniPlaneEffectType } from './type';
import { PlaneBar } from './units/bar/planeBar';
import { PlaneToolBox } from './units/tools/planeToolBox';

import { PlaneControl } from './units/control';

export class MiniFly implements IMiniGam {
  planeBackground: PlaneBg;
  planeAttacker: PlaneAttacker;
  planeEnemy: PlaneEnemy;

  planeEffect: PlaneEffect;
  planeBar: PlaneBar;
  planeToolBox: PlaneToolBox;
  planeControl: PlaneControl;
  constructor(gameParams: IMiniGameParams) {
    this.planeBackground = new PlaneBg();
    this.planeAttacker = new PlaneAttacker(gameParams);
    this.planeEnemy = new PlaneEnemy(gameParams, this);
    this.planeEffect = new PlaneEffect();
    this.planeBar = new PlaneBar(this);
    this.planeToolBox = new PlaneToolBox(gameParams, this);
    this.planeControl = new PlaneControl(this, this.planeEnemy);
  }

  // render 方法
  render(ctx: CanvasRenderingContext2D) {
    this.planeControl.render();
    this.planeBackground.render(ctx);
    this.planeAttacker.render(ctx);
    this.planeEnemy.render(ctx);
    this.planeEffect.render(ctx);
    this.planeBar.render(ctx);
    this.planeToolBox.render(ctx);
    this.bulletHitEnemy();
    this.catchTool();
  }

  // 子弹击中敌机
  bulletHitEnemy() {
    this.planeAttacker.checkHitEnemy((bullet) => {
      return this.planeEnemy.isHitEnemy(bullet);
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
    this.planeBar.addScore(score);
  }

  // 更新道具
  // updateToolBox(enemy: PlaneEnemyUnit) {
  // this.planeToolBox.buildTool(enemy);
  // this.planeToolBox.buildToolTest(enemy,MiniPlaneToolType.BOMB)
  // }

  removeControlEnemyByType(type: EnemyType) {
    this.planeControl.updateEnemyCountSub(type);
  }

  actionStart(action: IMiniActParams) {
    console.log('action', action);
  }

  actionEnd(p: IMiniActParams) {
    console.log('p', p);
  }
  actionDoing(p: IMiniActParams) {
    this.planeAttacker.actionDoing(p);
  }
}
