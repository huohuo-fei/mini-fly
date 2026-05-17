export class MiniUtils {
  // 使用的图片资源列表
  static imageStrMap: Map<string, HTMLImageElement> = new Map();

  // 加载图片资源
  static loadImage(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (MiniUtils.imageStrMap.has(src)) {
        resolve(MiniUtils.imageStrMap.get(src));
      } else {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          MiniUtils.imageStrMap.set(src, img);
          resolve(img);
        }
        img.onerror = () =>{
          reject();
        }
      }
    });
  }

  // 依据路劲获取图片
  static getImage(src: string): HTMLImageElement | null {
    const img = MiniUtils.imageStrMap.get(src);
    return img?img:null;
  }
}
