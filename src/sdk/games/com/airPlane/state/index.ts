import type { MiniFly } from '..';
import type { IMiniBus } from '../../../../type';
import { UPDATE_LIFE, UPDATE_SCORE, UPDATE_TIME } from './eventName';

export class FlyState implements IMiniBus {
  private _scoreVal: number = 0;
  private _lifeVal: number = 0;
  private _duration: number = 0;
  private _perTime: number = 0;

  events: Map<string, Set<Function>> = new Map();
  miniFly: MiniFly;

  constructor(miniFly: MiniFly) {
    this.miniFly = miniFly;
    this.reset();
  }

  get score() {
    return this._scoreVal;
  }

  set score(val: number) {
    this._scoreVal = val;
    this.emit(UPDATE_SCORE, val);
  }

  get life() {
    return this._lifeVal;
  }
  set life(val: number) {
    this._lifeVal = val;
    this.emit(UPDATE_LIFE, val);
  }

  get duration() {
    return this._duration;
  }

  set duration(val: number) {
    this._duration = val - this._perTime
    // this._perTime = val
    this.emit(UPDATE_TIME, this._duration);
  }

  reset() {
    // 游戏开始 重置游戏内部状态
    this.score = 0;
    this.life = 3;
    this.duration = 0
    this._perTime = new Date().getTime();
  }

  // 事件管理
  on(eventName: string, callback: Function) {
    const set = this.events.get(eventName) || new Set();
    set.add(callback);
    this.events.set(eventName, set);
  }

  emit(eventName: string, ...args: any[]) {
    const set = this.events.get(eventName);
    if (set) {
      set.forEach((callback) => {
        callback(...args);
      });
    }
  }

  off(eventName: string, callback: Function) {
    const set = this.events.get(eventName);
    if (set) {
      set.delete(callback);
    }
  }
}
