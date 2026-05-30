import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../../type';
import { PlaneMain } from './planeMain';
import { buildMainPlaneConfig } from '../../utils';
import { PlaneBullelBox } from './planeBulletBox';
import { PlaneShield } from './planeToolShield';
import { PlaneBulletDouble } from './planeBulletDouble';

export class PlaneAttacker implements IMiniGam {
  // 飞机配置参数
  PLAYER_WIDTH = 30;
  PLAYER_HEIGHT = 30;
  shootCooldown = 160;

  // 位置信息
  attackerX: number = 0;
  attackerY: number = 0;
  gameParams: IMiniGameParams;
  cx: number = 0;
  cy: number = 0;

  // 飞机实例
  planeMain: PlaneMain;
  // 子弹实例
  planeBulletBox: PlaneBullelBox;

  // 护盾
  planeShield: PlaneShield ;
  // 双倍子弹
  planeBulletDouble: PlaneBulletDouble;


  // 离屏canvas todo:后续由外部统一管理
  offScreenCanvas: HTMLCanvasElement | null = null;

  constructor(params: IMiniGameParams) {
    const { PLAYER_HEIGHT, PLAYER_WIDTH, shootCooldown } = this;
    const playerX = params.canvasWidth / 2;
    const playerY = params.canvasHeight - 50;
    const mainConfig = buildMainPlaneConfig(
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      playerX,
      playerY,
      params.canvasWidth,
      params.canvasHeight,
      shootCooldown
    );
    this.planeMain = new PlaneMain(mainConfig);
    this.planeBulletBox = new PlaneBullelBox(mainConfig);
    this.planeShield = new PlaneShield(mainConfig);
    this.planeBulletDouble = new PlaneBulletDouble(mainConfig);


    this.gameParams = params;
    this.updatePos(playerX, playerY);

  }

  updatePos(x: number, y: number) {
    this.attackerX = x;
    this.attackerY = y;
    this.cy = y + this.PLAYER_HEIGHT / 2;
  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    const { PLAYER_WIDTH, attackerX, gameParams } = this;
    let targetX = x 
    targetX = Math.min(
      Math.max(targetX, 5),
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
    this.planeBulletBox.updatePos(this.attackerX,this.attackerY);

    // 这两个不需要每次都更新
    this.planeShield.updatePosX(this.attackerX)
    this.planeBulletDouble.updatePosX(this.attackerX)
  }

  render(ctx: CanvasRenderingContext2D) {
    this.planeMain.render(ctx);
    this.planeBulletBox.render(ctx);
    this.planeShield.render(ctx);
    this.planeBulletDouble.render(ctx);
  }

  // 生成光罩
  createShield() {
    this.planeShield.changeState(true);
  }

  // 生成双倍子弹
  createDoubleBullet() {
    this.planeBulletDouble.startAni(this.attackerX)
    this.planeBulletBox.addBulletSize()
  }


  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
