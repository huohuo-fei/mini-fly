import type { EnemyBoss } from '.';
import type { IMiniGam } from '../../../../../../type';
import { Matrix3, Vector2 } from '../../../../../../utils/Matrix3';
import { bulletConfig } from '../../../config';
import type { IMiniPlaneEnemyBullets, MiniPlaneEnemyType } from '../../../type';

export class BossButtleDot implements IMiniGam {
  enemyBullet: IMiniPlaneEnemyBullets;
  lastTime: number;

  boss: EnemyBoss;
  direction: Vector2 | null = null
  theat:number = 0

  matrix: Matrix3 = new Matrix3();
  constructor(pos:Vector2,boss: EnemyBoss,direction?:Vector2) {
    this.boss = boss;
    this.lastTime = Date.now();

    // 先都是普通子弹  todo 区分
    this.enemyBullet = JSON.parse(JSON.stringify(bulletConfig));

    this.enemyBullet.x = pos.x;
    this.enemyBullet.y = pos.y;
    this.enemyBullet.speedY = 8
    this.matrix.makeTranslation(this.enemyBullet.x, this.enemyBullet.y);

    if(direction){
      this.direction = new Vector2(direction.x,direction.y).normalize()
      this.theat = Math.atan2(this.direction.y,this.direction.x)
    }
    // this.buildEnemyBullet();
  }

  buildEnemyBullet() {
    // const { speedY, h } = this.enemyBullet;
    // const { cx, cy } = this.boss;
    // // 将子弹中心和敌方飞机中心对齐
    // this.enemyBullet.x += cx;
    // this.enemyBullet.y += cy + h / 2;
    // this.enemyBullet.speedY += speedY;
  }

  updatePos() {
    const temp = Date.now();
    const diff = temp - this.lastTime;
    this.lastTime = temp;
    const dis = (this.enemyBullet.speedY * diff) / 100;
    const deltaX = Math.cos(this.theat) * dis; 
    const deltaY = Math.sin(this.theat) * dis;
    this.enemyBullet.y += deltaY
    this.enemyBullet.x += deltaX
    this.matrix.makeTranslation(this.enemyBullet.x, this.enemyBullet.y);
  }

 destroy() {
  // const x = this.matrix.elements[6]
  // const y = this.matrix.elements[7]
  // const { w } = this.enemyBullet;
  // const radius = w / 2

  // const {canvasHeight,canvasWidth} = this.boss.planeEnemy.gameParams
  // const {} = this

  // if(x < -radius || x > canvasWidth + radius || y < -radius || y > canvasHeight + radius){
  //   this.boss.removeBulletDot(this)
  // }
 }

  render(ctx: CanvasRenderingContext2D) {
    const { w, color } = this.enemyBullet;
    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, w / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    this.updatePos();
    this.destroy();
  }
  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
