import type { PlaneEnemySquadron } from '.';
import { PlaneBody } from '../../../base/planeBody';
import type { PlaneBodyParams } from '../../../base/type';
import type { ISquadronEnemy } from '../type';

export class SquadronBody extends PlaneBody {
  squadron: PlaneEnemySquadron;

  // 编队中所有飞机的状态
  enemyList:ISquadronEnemy[] = []
  constructor(params: PlaneBodyParams, squadron: PlaneEnemySquadron) {
    super(params);
    this.squadron = squadron;
    this.buildEnemyList()

  }

  buildEnemyList(){
    const { bodyWidth } = this;
    const { count, gap, w, h,health } = this.squadron.config;
    for (let i = 0; i < count; i++) {
      const left = -bodyWidth / 2 + i * (w + gap);
      const cx = left + w / 2;
      const cy = 0;
      this.enemyList.push({ left, top: -h / 2, w, h,cx,cy,health,dead: false })
    }

  }
  render(ctx: CanvasRenderingContext2D) {
    const { bodyWidth, bodyHeight,enemyList } = this;
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.strokeRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);

    ctx.save();
    ctx.strokeStyle = 'yellow';
    // 绘制单独的飞机
    for(const enemy of enemyList){
      if(enemy.dead) continue; 
      ctx.strokeRect(enemy.left, enemy.top, enemy.w, enemy.h);
    }
    ctx.restore();
    ctx.restore();
  }

}
