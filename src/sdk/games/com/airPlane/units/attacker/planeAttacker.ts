import type {
  IMiniActParams,
  IMiniGameParams,
} from '../../../../../type';
import { PlaneMain } from './planeMain';
import { PlaneBase } from '../../base/planeBase';
import type { PlaneBullet } from '../../base/planeBullet';

export class PlaneAttacker extends PlaneBase {
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

  // 主战机实例
  planeMain: PlaneMain;

  constructor(params: IMiniGameParams) {
    super();
    const { PLAYER_HEIGHT, PLAYER_WIDTH, shootCooldown, offsetY } = this;
    const playerX = params.canvasWidth / 2;
    const playerY = params.canvasHeight - offsetY;
    this.gameParams = params;
    this.planeMain = new PlaneMain({
      unitWidth: PLAYER_WIDTH,
      unitHeight: PLAYER_HEIGHT,
      unitX: playerX,
      unitY: playerY,
      speedX: 0,
      speedY: 0,
      shootCooldown,
      canvasHeight: this.gameParams.canvasHeight,
      canvasWidth: this.gameParams.canvasWidth,
      health:1,
      score:1
    });

    this.updatePos(playerX, playerY) 
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
      Math.max(targetX, PLAYER_WIDTH  + 5),
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

  // 遍历主战机的子弹 判断是否击中敌机
  checkHitEnemy(cb:(bullet:PlaneBullet) => boolean) {
  this.planeMain.traverseBullet(cb)
  }

  // 生成光罩
  createShield() {
    // this.planeShield.changeState(true);
  }

  // 生成双倍子弹
  createDoubleBullet() {
    // this.planeBulletDouble.startAni(this.attackerX)
    this.planeMain.addBullet()
  }

  getPos() {
    return { x: this.planeMain.unitX, y: this.planeMain.unitY };
  }

  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
