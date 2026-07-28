export enum TextAline {
  CENTER = 'CENTER',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}
export type textSnapshot = {
  text:string,
  color:string,
  fontSize:number,
  fontFamily?:string
  x:number,
  y:number,
  aniType?:string,  // 动画类型 闪烁变大、旋转....
  aline?:TextAline
}

