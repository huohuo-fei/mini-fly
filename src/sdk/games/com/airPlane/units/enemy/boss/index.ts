import type { IMiniGam } from '../../../../../../type';
import { Matrix3, Vector2 } from '../../../../../../utils/Matrix3';
import type { PlaneEnemy } from '../planeEnemy';
import { EasedMove } from '../../../../../../utils/Animate';
import {
  IMiniPlaneEffectType,
  type IBigEnemyConfig,
  type IBossConfig,
  type IMiniSquadronConfig,
} from '../../../type';
import type { PlaneBullet } from '../../attacker/planeBullet';
import { BossButtleDot } from './buttleDot';
import { BossRotateBullet } from './buttleRotate';
import { enemySquadronConfig } from '../../../config';
import { PlaneEnemySquadron } from '../squadron';

export class EnemyBoss implements IMiniGam {
  // boss 定义的配置参数 -- 后期考虑是否需要放到一个对象里面
  w: number = 0;
  h: number = 0;
  frame: number = 0;
  targetHeight: number = 200;
  healthArr: number[] = [];
  move: EasedMove | null = null;

  // boss 状态信息
  matrix: Matrix3 = new Matrix3();
  cx: number = 0;
  cy: number = 0;
  currentHp: number = 0;

  // 子弹定时器
  timer: number | null = null;

  planeEnemy: PlaneEnemy;

  // 子弹列表
  dotTimer: number | null = null;
  bulletDotList: BossButtleDot[] = [];

  // 螺旋子弹列表
  rotateTimer: number | null = null;
  rotateTimeout: number = 100;
  bulletRotateList: BossRotateBullet[] = [];
  angle: number = 0;
  angleSpeed: number = 0.042;
  bulletSpeed: number = 1;

  // 编队列表
  squadronList: PlaneEnemySquadron[] = [];

  // 是否已经死亡
  isDead: boolean = false;
  offScreenCanvas: HTMLCanvasElement | null = null;

  constructor(planeEnemy: PlaneEnemy, config: IBossConfig) {
    this.planeEnemy = planeEnemy;
    Object.assign(this, config);

    const canvasWidth = planeEnemy.gameParams.canvasWidth;
    const canvasHeight = planeEnemy.gameParams.canvasHeight;
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    this.cx = cx;
    this.cy = cy;

    this.currentHp = this.healthArr[this.healthArr.length - 1];
  }

  buildDotBullet() {
    if (this.bulletDotList.length > 0) return;

    const { targetHeight, h } = this;
    if (!this.dotTimer) {
      this.dotTimer = setInterval(() => {
        // 竖直方向的两列子弹
        const distance = 20;
        const posL = new Vector2(this.cx - distance / 2, targetHeight + h / 2);
        const posR = new Vector2(this.cx + distance / 2, targetHeight + h / 2);
        const b1 = new BossButtleDot(posL, this, new Vector2(0, 1));
        const b2 = new BossButtleDot(posR, this, new Vector2(0, 1));
        this.bulletDotList.push(b1, b2);

        // 斜着方向两列子弹
        const angle1 = Math.PI / 3;
        const x1 = Math.cos(angle1);
        const y1 = Math.sin(angle1);
        const v4 = new Vector2(x1, y1);

        const dis = distance / 2;
        const p1x = dis * Math.sin(Math.PI - angle1);
        const p1y = dis * Math.cos(Math.PI - angle1);

        const posL2 = new Vector2(this.cx + p1x, targetHeight + p1y);
        const posR2 = new Vector2(this.cx - 2 * p1x, targetHeight - p1y);
        const b12 = new BossButtleDot(posL2, this, v4);
        const b22 = new BossButtleDot(posR2, this, v4);
        this.bulletDotList.push(b12, b22);

        const angle2 = Math.PI - angle1;
        const x2 = Math.cos(angle2);
        const y2 = Math.sin(angle2);
        const v5 = new Vector2(x2, y2);
        const posL22 = new Vector2(this.cx + 2 * p1x, targetHeight - p1y);
        const posR22 = new Vector2(this.cx - p1x, targetHeight + p1y);
        const b122 = new BossButtleDot(posL22, this, v5);
        const b222 = new BossButtleDot(posR22, this, v5);
        this.bulletDotList.push(b122, b222);
      }, 800);
    }
  }

  buildRotateBullet() {
    if (this.bulletRotateList.length > 0 || this.rotateTimer) return;

    this.rotateTimer = setInterval(() => {
      const { targetHeight, h, cx: cox, w, bulletSpeed } = this;
      const r = Math.min(w / 2, h / 2);
      const cx = Math.cos(this.angle);
      const cy = Math.sin(this.angle);
      const vx = cx * bulletSpeed;
      const vy = cy * bulletSpeed;
      const x = cox + r * cx;
      const y = targetHeight + r * cy;
      const bullet = new BossRotateBullet(x, y, vx, vy, this);
      this.bulletRotateList.push(bullet);
    }, this.rotateTimeout);
  }

  buildSquadron() {
    // TODO: 编队
    const c1 = JSON.parse(
      JSON.stringify(enemySquadronConfig)
    ) as IMiniSquadronConfig;
    const c2 = JSON.parse(
      JSON.stringify(enemySquadronConfig)
    ) as IMiniSquadronConfig;
    const c3 = JSON.parse(
      JSON.stringify(enemySquadronConfig)
    ) as IMiniSquadronConfig;
    const c4 = JSON.parse(
      JSON.stringify(enemySquadronConfig)
    ) as IMiniSquadronConfig;
    c1.angle = Math.PI / 6;
    c1.enterHeight = 350;
    c2.angle = -Math.PI / 6;
    c2.direction = 'l';
    c2.enterHeight = 50;
    c2.enterHeight = 350;

    c3.angle = -Math.PI / 6;
    c3.enterHeight = 50;
    c4.angle = Math.PI / 6;
    c4.direction = 'l';
    c4.enterHeight = 50;
    this.squadronList.push(new PlaneEnemySquadron(c1, this.planeEnemy));
    this.squadronList.push(new PlaneEnemySquadron(c2, this.planeEnemy));
    this.squadronList.push(new PlaneEnemySquadron(c3, this.planeEnemy));
    this.squadronList.push(new PlaneEnemySquadron(c4, this.planeEnemy));
  }

  buildMissile() {
    // TODO: 导弹
  }

  removeBulletDot(bullet: BossButtleDot) {
    const ind = this.bulletDotList.indexOf(bullet);
    if (ind !== -1) {
      this.bulletDotList.splice(ind, 1);
    }
  }

  removeRotateBullet(bullet: BossRotateBullet) {
    const ind = this.bulletRotateList.indexOf(bullet);
    if (ind !== -1) {
      this.bulletRotateList.splice(ind, 1);
    }
  }

  removeMissile(missile: any) {}

  isHit(planeBullet: PlaneBullet) {
    // if(!this.bulletDotList.length)
    const { x: bx, y: by } = planeBullet.config;
    const { w, h, cx, targetHeight } = this;
    const combat = planeBullet.config.combat;

    if (Math.abs(bx - cx) < w / 2 && Math.abs(by - targetHeight) < h / 2) {
      if (this.currentHp < 500) {
        this.buildRotateBullet();
      }

      // this.currentHp -= combat;
      // this.flashHp();
      return {
        flag: true,
        isDead: this.isDead,
        x: this.cx,
        y: this.targetHeight,
        score: 500,
      };
    }

    return {
      flag: false,
      isDead: this.isDead,
      x: this.cx,
      y: this.targetHeight,
      score: 500,
    };
  }

  flashHp() {
    if (this.currentHp <= 0) {
      if (this.healthArr.length > 0) {
        // 此时还有血量
        this.currentHp = Number(this.healthArr.pop());

        if(this.healthArr.length ===2){
          this.buildSquadron(); 
        }

        // todo:需要清理上一批子弹
      } else {
        // 此时没有血量
        this.isDead = true;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // 开启入场动画
    const { cx, targetHeight, w, h, frame } = this;
    const halfW = w / 2;
    const halfH = h / 2;
    if (!this.move) {
      this.move = new EasedMove(
        { x: cx, y: 0 },
        { x: cx, y: targetHeight },
        frame
      );
    }
    const moveUpdateIng = this.move.update();

    if (!moveUpdateIng) {
      this.buildDotBullet();
    }

    this.angle += this.angleSpeed;
    this.angle = this.angle % (Math.PI * 2);

    const { x, y } = this.move.getCurrentPosition();
    this.matrix.makeTranslation(x, y);
    ctx.save();
    // this.renderBullet(ctx);
    ctx.strokeStyle = '#fff';
    ctx.transform(...this.matrix.toCanvasTransform());
    ctx.beginPath();
    ctx.strokeRect(-halfW, -halfH, w, h);

    this.drawHp(ctx);
    this.drawShield(ctx);
    ctx.restore();
  }

  renderBullet(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.bulletDotList.length; i++) {
      this.bulletDotList[i].render(ctx);
    }
    // console.log(this.bulletRotateList.length);

    for (let i = 0; i < this.bulletRotateList.length; i++) {
      this.bulletRotateList[i].render(ctx);
    }

    for (let i = 0; i < this.squadronList.length; i++) {
      this.squadronList[i].render(ctx);
    }
  }

  drawHp(ctx: CanvasRenderingContext2D) {
    const { currentHp, healthArr, w, h } = this;

    const hpH = 14;
    const hpW = w * 1.4;

    ctx.save();

    // 背景色
    ctx.fillStyle = 'yellow';
    ctx.fillRect(-hpW / 2, -h / 2 - hpH * 2, hpW, hpH);

    // 前景色
    ctx.fillStyle = 'red';

    const percent = currentHp / healthArr[healthArr.length - 1];
    ctx.fillRect(-hpW / 2, -h / 2 - hpH * 2, hpW * percent, hpH);
    ctx.restore();
  }

  drawShield(ctx: CanvasRenderingContext2D) {
    const { w } = this;
    const shieldRadius = w;
    if (!this.offScreenCanvas) {
      this.offScreenCanvas = document.createElement('canvas');
    }
    this.offScreenCanvas.width = shieldRadius * 2;
    this.offScreenCanvas.height = shieldRadius;
    const offScreenCtx = this.offScreenCanvas.getContext('2d');
    if (!offScreenCtx) return;
    offScreenCtx.clearRect(0, 0, shieldRadius * 2, shieldRadius);

    // 做一个线性渐变，从内到外，颜色从透明到不透明
    const gradient = ctx.createLinearGradient(0, 0, shieldRadius * 2, 0);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // 绘制护盾主体
    offScreenCtx.beginPath();
    offScreenCtx.fillStyle = gradient;
    offScreenCtx.fillRect(0, 0, shieldRadius * 2, shieldRadius);
    offScreenCtx.fill();

    offScreenCtx.globalCompositeOperation = 'source-in';
    offScreenCtx.beginPath();
    offScreenCtx.moveTo(shieldRadius, shieldRadius);
    offScreenCtx.arc(
      shieldRadius,
      shieldRadius,
      shieldRadius,
      Math.PI,
      2 * Math.PI
    );
    offScreenCtx.closePath();
    const outerGlowGrad = offScreenCtx.createRadialGradient(
      shieldRadius,
      shieldRadius,
      shieldRadius - 10,
      shieldRadius,
      shieldRadius,
      shieldRadius
    );
    outerGlowGrad.addColorStop(0, 'rgba(220, 20, 60, 0)');
    outerGlowGrad.addColorStop(0.8, 'rgba(200, 30, 80, 0.35)');
    outerGlowGrad.addColorStop(1, 'rgba(180, 40, 100, 0.92)');
    offScreenCtx.fillStyle = outerGlowGrad;
    offScreenCtx.fill();

    ctx.save();
    ctx.scale(1, -1);
    ctx.drawImage(this.offScreenCanvas, -shieldRadius, -shieldRadius);
    ctx.restore();
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
