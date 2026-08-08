import { MiniUtils } from '../../../..';
import { Vector2 } from '../../../../utils/Matrix3';
import { PlaneBase } from './planeBase';
import planeMissileSvg from '@/assets/game/plane/missile.svg';

// 导弹类
export class PlaneMissile extends PlaneBase {
  missileWidth: number = 24;
  missileHeight: number = 48;
  p1: Vector2 = new Vector2(0, 0);
  p2: Vector2 = new Vector2(0, 0);
  heightFactor: number = 100; // 高度因子，这里指的是二次贝塞尔曲线的控制点的参考高度
  step: number = 0.01; // 每次移动的步长
  currentT: number = 0; // 当前移动到贝塞尔曲线的t值
  missileImg: HTMLImageElement | null = null;
  endCallback: Function = () => {};

  // 当前曲线的最后一个点信息
  lastInfo = {
    x: 0,
    y: 0,
    angle: 0,
  };

  constructor(
    p1: Vector2,
    p2: Vector2,
    height: number,
    step: number,
    cb: Function
  ) {
    super();
    this.p1.set(p1.x, p1.y);
    this.p2.set(p2.x, p2.y);
    this.heightFactor = height;
    this.step = step;
    this.missileImg = MiniUtils.getImage(planeMissileSvg);

    this.endCallback = cb;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.missileImg) return;
    const rw = this.missileWidth;
    const rh = this.missileHeight;

    const res = this.getMissileInfo(this.p1, this.p2, this.heightFactor);

    if (res) {
      const { dotPos, rotateAngle } = res;
      this.lastInfo.x = dotPos.x;
      this.lastInfo.y = dotPos.y;
      this.lastInfo.angle = rotateAngle;
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath();
    ctx.strokeStyle = 'red';

    ctx.translate(this.lastInfo.x, this.lastInfo.y);
    ctx.rotate(this.lastInfo.angle + Math.PI / 2);

    ctx.strokeRect(-rw / 2, -rh / 2, rw, rh);
    ctx.drawImage(this.missileImg, -rw / 2, -rh / 2, rw, rh);
    ctx.restore();
  }



  getMissileInfo(p1: Vector2, p2: Vector2, height: number) {
    const dotPos = this.getPointOnParabola(p1, p2, height, this.currentT);
    const tangent = this.getTangentOnParabola(p1, p2, height, this.currentT);
    const rotateAngle = Math.atan2(tangent.y, tangent.x);

    if (this.currentT >= 1) {
      this.endCallback(dotPos);
    } else {
      this.currentT += this.step;
    }
    const flag = Boolean(this.currentT >= 1);
    return flag
      ? null
      : {
          dotPos,
          rotateAngle,
        };
  }

  // 依据两点以及高度 计算二次贝塞尔曲线参数
  getParabolaParams(p1: Vector2, p2: Vector2, height: number) {
    // 1. 计算中点
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;

    // 2. 计算垂直方向 (标准化向量)
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    // 垂直向量: (-dy, dx) 再除以长度得到单位向量
    const nx = -dy / len;
    const ny = dx / len;

    // 3. 计算顶点 (在中点基础上偏移)
    const vertexX = mx + nx * height;
    const vertexY = my + ny * height;

    return {
      p1,
      p2,
      cp: new Vector2(vertexX, vertexY),
    };
  }

  // 计算二次贝塞尔曲线上的点 t
  getPointOnParabola(p1: Vector2, p2: Vector2, height: number, t: number) {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.001) return { x: p1.x, y: p1.y };

    // y轴方向单位向量  这里是逆时针旋转90度
    const nx = -dy / len;
    const ny = dx / len;
    const vx = mx + nx * height;
    const vy = my + ny * height;

    const u = 1 - t;
    const x = u * u * p1.x + 2 * u * t * vx + t * t * p2.x;
    const y = u * u * p1.y + 2 * u * t * vy + t * t * p2.y;

    return { x, y };
  }

  // 使用微分的思想 计算出抛物线上的切线
  getTangentOnParabola(p1: Vector2, p2: Vector2, height: number, t: number) {
    const dt = 0.001;
    const t1 = Math.max(0, t - dt);
    const t2 = Math.min(1, t + dt);
    const pA = this.getPointOnParabola(p1, p2, height, t1);
    const pB = this.getPointOnParabola(p1, p2, height, t2);
    const dx = pB.x - pA.x;
    const dy = pB.y - pA.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.0001) return { x: 1, y: 0 };
    return { x: dx / len, y: dy / len };
  }
}
