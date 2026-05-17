// todo:将之前的战机类型 抽离出来

export enum MyBulletType {
  NORMAL = 'normal',
}

export type MyBulletConfig = {
  type: MyBulletType;
  x: number;
  y: number;
  w: number;
  h: number;
  size: number; // 子弹列数
  color: string;
  speedY: number;
};
