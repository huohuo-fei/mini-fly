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
        };
        img.onerror = () => {
          reject();
        };
      }
    });
  }

  // 加载图片资源
  static loadImageList(srcs: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const promises: Promise<any>[] = [];
      for (let i = 0; i < srcs.length; i++) {
        promises.push(MiniUtils.loadImage(srcs[i]));
      }
      Promise.all(promises)
        .then((imgArr) => {
          resolve(imgArr);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // 加载图片资源
  static loadImageListProg(
    srcs: string[],
    onProgress: (n1: number, n2: number) => void
  ): Promise<any> {
    let completedCount = 0;
    const total = srcs.length;

    const totalPromise = srcs.map((src) => {
      return new Promise((resolve, reject) => {
        if (MiniUtils.imageStrMap.has(src)) {
          resolve(MiniUtils.imageStrMap.get(src));
        } else {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            completedCount++;
            if (onProgress && typeof onProgress === 'function') {
              onProgress(completedCount, total);
            }
            MiniUtils.imageStrMap.set(src, img);
            resolve(img);
          };
          img.onerror = () => {
            reject('load image error:');
          };
        }
      });
    });
    return Promise.all(totalPromise);
  }

  // 依据路劲获取图片
  static getImage(src: string): HTMLImageElement | null {
    const img = MiniUtils.imageStrMap.get(src);
    return img ? img : null;
  }

  // 时间转化
  static formatTime(ms: number): string {
    if (ms < 0) ms = 0;
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    const pad = (n:number) => String(n).padStart(2, '0');
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  static formatTimeStr(ms: number): string {
    if (ms < 0) ms = 0;
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let str_s = seconds?`${seconds}秒`:''
    let str_m = minutes?`${minutes}分`:''
    let str_h = hours?`${hours}小时`:''
  
    return str_h + str_m + str_s;
  }
}
