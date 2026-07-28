import { PlaneBody } from '../../base/planeBody';
import type { PlaneBodyParams } from '../../base/type';
import type { PlaneMain } from './planeMain';
export class PlaneMainBody extends PlaneBody {

  FRAME_NUM=10

  // 护盾开始的时间
  curTime: number = 0;
  // 护盾开始闪烁的时间
  blinkTime: number = 16000;
  // 护盾闪烁的帧数
  blinkFrame: number = this.FRAME_NUM;
  // 护盾闪烁的帧数计数
  blinkFrameCount: number = 0;

  attacker:PlaneMain

  constructor(params: PlaneBodyParams, attacker: PlaneMain){
    super(params)
    this.attacker = attacker
  }
  render(ctx: CanvasRenderingContext2D) {
    if(this.attacker.noHit){
      // 如果开启了不能被击中状态，要有闪烁效果
      if(this.aniBlink()) return;
    }
    const { bodyWidth, bodyHeight } = this;
    ctx.save();
    // 先绘制飞机的外形框
    ctx.strokeStyle = 'red';
    ctx.strokeRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#0af';
    ctx.fillStyle = '#7df9ff';
    ctx.beginPath();

    // 绘制一个梭形
    const offsetX = 3;
    const offsetY = 6;
    ctx.moveTo(-bodyWidth / 2 + offsetX, offsetY);
    ctx.lineTo(0, -bodyHeight / 2);
    ctx.lineTo(bodyWidth / 2 - offsetX, offsetY);
    ctx.lineTo(0, bodyHeight / 2);
    ctx.fill();
    ctx.fillStyle = '#ffd966';
    ctx.beginPath();
    ctx.rect(-5, -5, 10, 10);
    ctx.fill();
    ctx.restore();
  }

  // 闪烁控制
  aniBlink(): boolean {
    const { blinkFrame, blinkFrameCount, curTime, blinkTime } = this;
    // 是否开启闪烁
    if (Date.now() - curTime < blinkTime) return false;

    // 闪烁记时
    if (blinkFrameCount >= blinkFrame) {
      // 临时隐藏护盾
      if (blinkFrame > 0) {
        this.blinkFrame--;
        return true;
      }

      // 护盾闪烁结束，恢复显示
      this.blinkFrame = this.FRAME_NUM;
      this.blinkFrameCount = 0;
      return true;
    }
    this.blinkFrameCount += 1;
    return false;
  }
}
