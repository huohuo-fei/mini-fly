import { UPDATE_LIFE, UPDATE_SCORE, UPDATE_TIME } from './eventName';

// 全局状态信息
export class MiniFlyState {
  //--   内部属性   --//
  private static events: Map<string, Set<Function>> = new Map();
  private static _scoreVal: number = 0;
  private static _lifeVal: number = 0;
  private static _duration: number = 0;
  private static _perTime: number = 0;
  private static _pauseTemp: number = 0;

  static get score() {
    return MiniFlyState._scoreVal;
  }

  static set score(val: number) {
    MiniFlyState._scoreVal = val;
    MiniFlyState.triggerEvent(UPDATE_SCORE, val);
  }

  static get life() {
    return MiniFlyState._lifeVal;
  }
  static set life(val: number) {
    MiniFlyState._lifeVal = val;
    MiniFlyState.triggerEvent(UPDATE_LIFE, val);
  }

  static get duration() {
    return MiniFlyState._duration;
  }

  static set duration(val: number) {
    // 考虑时间暂停的情况
    if (this.pauseTemp !== 0) {
      const curTime = new Date().getTime();
      const time = curTime - MiniFlyState.pauseTemp;
      MiniFlyState._perTime = MiniFlyState._perTime + time;
      this.pauseTemp = 0;
    }
    MiniFlyState._perTime = MiniFlyState._perTime - MiniFlyState.pauseTemp;
    MiniFlyState.pauseTemp = 0;
    MiniFlyState._duration = val - MiniFlyState._perTime;
    MiniFlyState.triggerEvent(UPDATE_TIME, MiniFlyState._duration);
  }

  static get pauseTemp() {
    return MiniFlyState._pauseTemp;
  }

  static set pauseTemp(val: number) {
    MiniFlyState._pauseTemp = val;
  }

  static reset() {
    // 游戏开始 重置游戏内部状态
    MiniFlyState.score = 0;
    MiniFlyState.life = 3;
    MiniFlyState.duration = 0;
    MiniFlyState._perTime = new Date().getTime();
  }

  static addEvent(eventName: string, callback: Function) {
    let set = MiniFlyState.events.get(eventName);
    if (!set) {
      set = new Set();
      MiniFlyState.events.set(eventName, set);
    }
    set.add(callback);
  }

  static removeEvent(eventName: string, callback: Function) {
    const set = MiniFlyState.events.get(eventName);
    if (set) {
      set.delete(callback);
    }
  }

  static triggerEvent(eventName: string, ...args: any[]) {
    const set = MiniFlyState.events.get(eventName);
    if (set) {
      set.forEach((callback) => {
        callback(...args);
      });
    }
  }
}
