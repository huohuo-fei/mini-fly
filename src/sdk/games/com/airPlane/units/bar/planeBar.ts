import type { MiniFly } from '../..';
import { MiniUtils } from '../../../../..';
import type { IMiniGam } from '../../../../../type';
import { UPDATE_LIFE, UPDATE_SCORE, UPDATE_TIME } from '../../state/eventName';
import { IMiniPlaneEffectType } from '../../type';
export class PlaneBar implements IMiniGam {
  fontSize = 18;
  scoreVal: number = 0;
  lifeVal: number = 3;
  maxLife: number = 5;
  timeVal: number = 0;

  miniFly: MiniFly;
  updateScoreFn: Function = this.updateScore.bind(this);
  updateLifeFn: Function = this.updateLife.bind(this);
  updateTimeFn: Function = this.updateTime.bind(this);

  constructor(miniFly: MiniFly) {
    this.miniFly = miniFly;
    this.registerEvent();
  }

  registerEvent() {
    this.miniFly.flyState.on(UPDATE_SCORE, this.updateScoreFn);
    this.miniFly.flyState.on(UPDATE_LIFE, this.updateLifeFn);
    this.miniFly.flyState.on(UPDATE_TIME, this.updateTimeFn);
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

  updateScore(val: number) {
    this.scoreVal = val;
  }

  updateLife(val: number) {
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

  updateTime(val: number) {
    this.timeVal = val;
  }
  render(ctx: CanvasRenderingContext2D) {
    this.drawScoreIcon(ctx);
    this.drawTime(ctx);
  }
  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
