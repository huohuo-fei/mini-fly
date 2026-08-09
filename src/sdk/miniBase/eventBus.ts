import type { IEventBus } from '..';

export class EventBus implements IEventBus {
  protected events: Map<string, Set<Function>> = new Map();

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
