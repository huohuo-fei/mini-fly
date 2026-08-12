import type { EnemyBoss } from ".";
import { PlaneBody } from "../../../base/planeBody";
import type { PlaneBodyParams } from "../../../base/type";


export class BossBody extends PlaneBody{
  maxHealth:number
  boss:EnemyBoss

  constructor(params:PlaneBodyParams,boss:EnemyBoss) {
    super(params);
    console.log(boss.health);
    
    this.maxHealth = boss.health
    this.boss = boss

  }
  render(ctx: CanvasRenderingContext2D) {
    const { bodyWidth,bodyHeight } = this;
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.strokeRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);
    ctx.restore();
    this.renderHp(ctx)

  }

  renderHp(ctx: CanvasRenderingContext2D){
    // const { hp, maxHp } = this;
    const hp = this.boss.health
    const maxHp = this.maxHealth
    ctx.save()
    ctx.fillStyle = '#000'
    ctx.fillRect(-this.bodyWidth / 2, -this.bodyHeight / 2 - 10, this.bodyWidth , 5);
    ctx.restore()
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.fillRect(-this.bodyWidth / 2, -this.bodyHeight / 2 - 10, this.bodyWidth * hp / maxHp, 5);

    ctx.restore();
  }
}