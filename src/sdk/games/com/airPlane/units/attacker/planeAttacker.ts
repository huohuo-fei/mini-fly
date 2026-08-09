import type { IMiniActParams, IMiniGameParams } from '../../../../../type';
import { PlaneMain } from './planeMain';
import type { PlaneBullet } from '../../base/planeBullet';
import { IMiniPlaneEffectType, MiniPlaneToolType } from '../../type';
import type { MiniFly } from '../..';
import type { TextUnit } from '../textTip/textUnit';
import type { PlaneUnit } from '../../base/planeUnit';
import { MiniBase } from '../../../../../miniBase/miniBase';

export class PlaneAttacker extends MiniBase {
  // 战机的配置参数
  PLAYER_WIDTH = 30;
  PLAYER_HEIGHT = 30;
  shootCooldown = 160;

  // 位置信息
  attackerX: number = 0;
  attackerY: number = 0;
  cx: number = 0;
  cy: number = 0;
  offsetY: number = 50;

  // 游戏参数，
  gameParams: IMiniGameParams;

  miniFly: MiniFly;

  // 主战机实例
  planeMain: PlaneMain;
  noHitText: TextUnit | null = null;

  constructor(params: IMiniGameParams, miniFly: MiniFly) {
    super();
    const { PLAYER_HEIGHT, PLAYER_WIDTH, shootCooldown, offsetY } = this;
    const playerX = params.canvasWidth / 2;
    const playerY = params.canvasHeight - offsetY;
    this.gameParams = params;
    this.miniFly = miniFly;
    this.planeMain = new PlaneMain(
      {
        unitWidth: PLAYER_WIDTH,
        unitHeight: PLAYER_HEIGHT,
        unitX: playerX,
        unitY: playerY,
        speedX: 0,
        speedY: 0,
        shootCooldown,
        canvasHeight: this.gameParams.canvasHeight,
        canvasWidth: this.gameParams.canvasWidth,
        health: 1,
        score: 1,
      },
      this
    );

    this.updatePos(playerX, playerY);
  }

  updatePos(x: number, y: number) {
    this.attackerX = x;
    this.attackerY = y;
  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    const { PLAYER_WIDTH, attackerX, gameParams } = this;
    let targetX = x;
    targetX = Math.min(
      Math.max(targetX, PLAYER_WIDTH + 5),
      gameParams.canvasWidth - PLAYER_WIDTH - 5
    );
    let resX = attackerX * 0.85 + targetX * 0.15;

    // 边界限制最终
    resX = Math.min(
      Math.max(resX, 5),
      gameParams.canvasWidth - PLAYER_WIDTH - 5
    );
    this.attackerX = resX;
    this.planeMain.updatePosX(this.attackerX);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.planeMain.render(ctx);
  }

  // 判断当前主战机是否被击中
  checkHitByEnemy(bullet: PlaneBullet) {
    const hitInfo = this.planeMain.isHitUnit(bullet);
    if (hitInfo) {
      return true;
    } else {
      return false;
    }
  }

  // 敌机 战机 机体相撞
  checkHitByEnemyPlane(enemyUnit:PlaneUnit) {
    this.planeMain.collidePlane(enemyUnit)
    
  }

  // 无敌提示文字
  showInvincibleText() {
    // 追加一个提示文字
    const canvasWidth = this.gameParams.canvasWidth;
    const cx = canvasWidth / 2;
    const h = 50;
    const t1 = {
      text: '✦✦ 无敌 ✦✦',
      x: cx,
      y: h,
      color: '#00ff66',
      fontSize: 14,
    };

    this.noHitText = this.miniFly.planeText.addText(t1);
  }

  closeInvincibleText() {
    if (this.noHitText) {
      this.miniFly.planeText.removeText(this.noHitText);
    }
  }

  // 生成光罩
  createShield() {
    // this.planeShield.changeState(true);
    this.planeMain.addTool(MiniPlaneToolType.SHIELD);
  }

  // 生成双倍子弹
  createDoubleBullet() {
    this.planeMain.addBullet();
  }

  requestEffect(effectType: IMiniPlaneEffectType, x: number, y: number) {
    this.miniFly.createEffect(effectType, x, y);
  }

  getPos() {
    return { x: this.planeMain.unitX, y: this.planeMain.unitY };
  }

  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
