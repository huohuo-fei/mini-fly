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
}
