import type { IMiniGam } from '../../../../../../type';
import { Matrix3, Vector2 } from '../../../../../../utils/Matrix3';
import type { PlaneEnemy } from '../planeEnemy';
import { SquadronsBullet } from './bullet';
import { SquadronsUnit } from './enemy';
import { PlaneBullet } from '../../attacker/planeBullet';
import type { IMiniSquadronConfig } from '../../../type';

export class PlaneEnemySquadron implements IMiniGam {
  matrix: Matrix3 = new Matrix3();

  // 编队配置信息
  count: number = 6;
  angle: number = Math.PI / 6;
  enterHeight: number = 100;
  shootCooldown: number = 3000;
  speed: number = 1;
  unitSize: number = 30;
  direction: 'r' | 'l' = 'r';

  // 敌机列表
  enemyList: SquadronsUnit[] = [];
  // 子弹列表
  bulletList: SquadronsBullet[] = [];

  // 子弹定时器
  timer: number | null = null;

  planeEnemy: PlaneEnemy;

  constructor(config: IMiniSquadronConfig, planeEnemy: PlaneEnemy) {
    Object.assign(this, config);
    this.planeEnemy = planeEnemy;
    const { count, angle, enterHeight } = this;
    const { unitSize } = this;
    const w = count * unitSize;

    const offsetW = this.direction === 'r' ? 0 :planeEnemy.gameParams.canvasWidth ;
    this.matrix.translate(offsetW, enterHeight).rotate(-angle);

    if(this.direction === 'r'){
      this.matrix.translate(-w, 0);
    }
    this.matrix.translate(0, 0);

    this.buildEnemy();
    this.buildBullet();
  }

  buildEnemy() {
    const { count, unitSize } = this;

    // 计算每个编队中的敌机位置 主要是 X 坐标
    for (let i = 0; i < count; i++) {
      const x = i * unitSize + unitSize / 2;
      const y = 0;
      const enemy = new SquadronsUnit(x, y + unitSize / 2, unitSize, unitSize);
      this.enemyList.push(enemy);
    }
  }

  buildBullet() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        for (let i = 0; i < this.enemyList.length; i++) {
          const enemy = this.enemyList[i];
          const { x, y } = enemy.getPos();
          const targetPos = new Vector2(x, y);
          targetPos.applyMatrix3(this.matrix);

          const planePos = this.planeEnemy.getPlanePos();
          const bullet = new SquadronsBullet(
            targetPos.x,
            targetPos.y,
            planePos.x,
            planePos.y,
            this
          );
          this.bulletList.push(bullet);
        }
      }, 1000);
    }
  }

  removeBullet(bullet: SquadronsBullet) {
    const index = this.bulletList.indexOf(bullet);
    if (index > -1) {
      this.bulletList.splice(index, 1);
    }

    if (this.bulletList.length === 0) {
      this.planeEnemy.removeSquadron(this);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const { count, unitSize } = this;

    const w = count * unitSize;
    const h = unitSize;

    const flag = this.direction === 'r' ? 1 : -1;

    this.matrix.translate(flag * this.speed, 0);

    for (let i = 0; i < this.bulletList.length; i++) {
      this.bulletList[i].render(ctx);
      this.destroyBullet(this.bulletList[i]);
    }

    ctx.save();

    ctx.transform(...this.matrix.toCanvasTransform());
    for (let i = 0; i < this.enemyList.length; i++) {
      this.enemyList[i].render(ctx);
    }

    ctx.strokeStyle = 'red';
    ctx.strokeRect(0, 0, w, h);
    ctx.strokeStyle = 'yellow';

    ctx.restore();

    this.destroy();
  }

  isHit(planeBullet: PlaneBullet) {
    const { x: bx, y: by } = planeBullet.config;
    for (let i = 0; i < this.enemyList.length; i++) {
      const enemy = this.enemyList[i];
      const { x, y } = enemy.getPos();
      const { w, h } = enemy;

      // 先计算出编队战机的世界坐标系下的位置  -- 此时依然处于旋转状态
      const vec2 = new Vector2(x, y);
      vec2.applyMatrix3(this.matrix);

      // 此时，敌机和子弹都处于世界坐标系中
      // 由于敌机是旋转状态，不好判断子弹是否在敌机的内部
      // 所以，先将敌机和子弹 放到同一坐标系
      // 然后将敌机平移到坐标中心，并旋转敌机，与坐标的x y 轴平行
      // 上述的变换矩阵作用到子弹上，就可以将变换后的子弹坐标与敌机的长宽进行位置比较了。
      const localPoint = new Vector2(bx - vec2.x, by - vec2.y);
      const rotateMatrix = new Matrix3().rotate(this.angle);
      const transPoint = localPoint.applyMatrix3(rotateMatrix);

      const halfW = w / 2;
      const halfH = h / 2;

      if (Math.abs(transPoint.x) < halfW && Math.abs(transPoint.y) < halfH) {
        const isDead = enemy.updateState(planeBullet.config.combat);
        if (isDead) {
          this.enemyList.splice(i, 1);
        }
        return {
          flag: true,
          isDead: isDead,
          score: isDead ? enemy.deadScore : enemy.score,
          x: vec2.x,
          y: vec2.y,
        };
      }
    }

    return {
      flag: false,
      isDead: false,
      score: 0,
      x: 0,
      y: 0,
    };
  }

  destroy() {
    // 判断当前编队是否在屏幕内
    const { count, unitSize } = this;

    const w = count * unitSize;
    // const h = unitSize;
    const posX = this.matrix.elements[6];
    const posY = this.matrix.elements[7];
    const canvasWidth = this.planeEnemy.gameParams.canvasWidth;
    const canvasHeight = this.planeEnemy.gameParams.canvasHeight;

    if (
      posX < -w ||
      posX > canvasWidth + w ||
      posY < -w ||
      posY > canvasHeight + w
    ) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

  destroyBullet(bullet: SquadronsBullet) {
    const x = bullet.matrix.elements[6];
    const y = bullet.matrix.elements[7];
    const canvasWidth = this.planeEnemy.gameParams.canvasWidth;
    const canvasHeight = this.planeEnemy.gameParams.canvasHeight;
    const { unitSize } = this;

    if (
      x < -unitSize ||
      x > canvasWidth + unitSize ||
      y < -unitSize ||
      y > canvasHeight + unitSize
    ) {
      this.removeBullet(bullet);
    }
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
