// 飞机大战
import type {
  IMiniActParams,
  IMiniG,
  IMiniGam,
  IMiniGameParams,
} from '../../../type';
import { PlaneAttacker } from './units/attacker/planeAttacker';

import { PlaneBg } from './units/background/planeBg';
import { PlaneEnemy } from './units/enemy/planeEnemy';
import { PlaneEffect } from './units/effect/planeEffects';
import { EnemyType, type IMiniPlaneEffectType } from './type';
import { PlaneBar } from './units/bar/planeBar';
import { PlaneToolBox } from './units/tools/planeToolBox';

import { PlaneControl } from './units/control';
import type { PlaneUnit } from './base/planeUnit';
import { FlyState } from './state';
import type { PlaneBullet } from './base/planeBullet';
import { PlaneText } from './units/textTip/textTip';

export class MiniFly implements IMiniGam {
  planeBackground: PlaneBg;
  planeAttacker: PlaneAttacker;
  planeEnemy: PlaneEnemy;
  planeEffect: PlaneEffect;
  planeBar: PlaneBar;
  planeToolBox: PlaneToolBox;
  planeControl: PlaneControl;
  planeText:PlaneText

  flyState: FlyState;
  constructor(gameParams: IMiniGameParams) {
    // 初始化内部状态
    this.flyState = new FlyState(this);

    // 加载各个模块
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
    this.planeAttacker.render(ctx);
    this.planeEnemy.render(ctx);
    this.planeEffect.render(ctx);
    this.planeBar.render(ctx);
    this.planeToolBox.render(ctx);
    this.planeText.render(ctx);
    this.bulletHitEnemy();
    this.catchTool();
    this.updateTime();
  }

  // 渲染暂停，主要是控制内部的时间系统
  pauseRender() {
    this.flyState.pauseTemp = new Date().getTime();
  }

  // 子弹击中敌机
  bulletHitEnemy() {
    this.planeAttacker.checkHitEnemy((bullet) => {
      return this.planeEnemy.isHitEnemy(bullet);
    });
  }

  // 敌机击中战机
  enemyHitAttacker(bullet:PlaneBullet) {
    const res = this.planeAttacker.checkHitByEnemy(bullet)
    // const res2 = this.planeAttacker.planeMain.isHitUnit(bullet)
    if(res){
      return true
    }else{
      return false
    }
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
    this.flyState.score = this.flyState.score + score;
  }

  // 更新生命值
  updateLife(val: number) {
    this.flyState.life = this.flyState.life + val;
  }

  // 更新时间
  updateTime() {
    this.flyState.duration = new Date().getTime();
  }

  // 更新道具
  updateToolBox(enemy: PlaneUnit) {
    this.planeToolBox.buildTool(enemy);
    // this.planeToolBox.buildToolTest(enemy,MiniPlaneToolType.LIFE)
  }

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
