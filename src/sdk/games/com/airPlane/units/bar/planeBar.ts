import type { MiniFly } from '../..';
import { MiniUtils } from '../../../../..';
import { UPDATE_LIFE, UPDATE_SCORE, UPDATE_TIME } from '../../state/eventName';
import { MiniFlyState } from '../../state/flyState';
import { MiniBase } from '../../../../../miniBase/miniBase';
import { IMiniPlaneEffectType } from '../effect/type';
export class PlaneBar extends MiniBase {
  fontSize = 18;
  scoreVal: number = 0;
  lifeVal: number = 3;
  maxLife: number = 5;
  timeVal: number = 0;

  miniFly: MiniFly;
  updateScoreFn: Function = this.updateScore.bind(this);
  updateLifeFn: Function = this.updateLife.bind(this);
  updateTimeFn: Function = this.updateTime.bind(this);

  textMap:Map<string,string> = new Map<string,string>(
    [
      ['1','✦✦ 无敌 ✦✦'],
    ]
  );

  constructor(miniFly: MiniFly) {
    super()
    this.miniFly = miniFly;
    this.registerEvent();
  }

  registerEvent() {
    MiniFlyState.addEvent(UPDATE_SCORE, this.updateScoreFn);
    MiniFlyState.addEvent(UPDATE_LIFE, this.updateLifeFn);
    MiniFlyState.addEvent(UPDATE_TIME, this.updateTimeFn);
  }
  drawScoreIcon(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.font = `${this.fontSize}px Arial`;
    ctx.fillText(`❤️ ${this.lifeVal}`, 10, 10 + this.fontSize);
    ctx.fillText(`🏆 ${this.scoreVal}`, 10, 10 + this.fontSize * 2.2);
    ctx.restore();
  }

  drawTime(ctx: CanvasRenderingContext2D) {
    const canvasWidth = ctx.canvas.width;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.font = `${this.fontSize * 0.8}px Arial`;
    const timeStr = `游戏时间 ${MiniUtils.formatTime(this.timeVal)}`;
    const width = ctx.measureText(timeStr).width;
    ctx.fillText(timeStr, canvasWidth - width - 10, 10 + this.fontSize * 1.4);
    ctx.restore();
  }

  drawCenterText(ctx: CanvasRenderingContext2D){
    const text = '✦✦ 无敌状态 ✦✦' 
    const canvasWidth = ctx.canvas.width;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#00ff66';
    ctx.font = `14px Arial`;
    const width = ctx.measureText(text).width;
    ctx.fillText(text, canvasWidth / 2 - width / 2, 50);
    ctx.restore();

  }

  updateScore(val: number) {
    this.scoreVal = val;
  }

  updateLife(val: number) {
    // 更新生命值 需要判断时变大还是减小
    if (val > this.lifeVal) {
      this.addLife(val);
    } else {
      this.removeLife(val);
    }
  }

  addLife(val: number) {
    if (this.lifeVal < this.maxLife || true) {
      const x = this.miniFly.planeAttacker.attackerX;
      const y = this.miniFly.planeAttacker.attackerY;
      this.miniFly.createEffect(
        IMiniPlaneEffectType.LIFE,
        x,
        y,
        {
          posx: 10,
          posy: 10,
        },
        () => {
          this.lifeVal = val;
        }
      );
    }
  }

  removeLife(val: number) {
    if(val<0)return

    // if(val>0){

    // }else{
    //   // 游戏结束 
    // }
    this.lifeVal = val;
  }

  updateTime(val: number) {
    this.timeVal = val;
  }
  render(ctx: CanvasRenderingContext2D) {
    this.drawScoreIcon(ctx);
    this.drawTime(ctx);
    // this.drawCenterText(ctx)
  }
}
