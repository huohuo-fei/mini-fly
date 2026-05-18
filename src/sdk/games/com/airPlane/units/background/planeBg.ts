import type { IMiniActParams, IMiniGam } from "../../../../../type"; 
export class PlaneBg implements IMiniGam {

  render(ctx: CanvasRenderingContext2D){
    const canvas = ctx.canvas

    let grad = ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0,"#03071e");
    grad.addColorStop(1,"#000000");
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let i=0;i<200;i++){
      if(i%2===0) continue;
      ctx.fillStyle = `rgba(255,240,200,${0.3+Math.sin(Date.now()*0.002+i)*0.2})`;
      ctx.fillRect( (i*131)%canvas.width, (i*57)%canvas.height, 2,2);
  }
  };
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing =  (p: IMiniActParams) => {};

}