export class EventEmitter {
  events: any;
  maxListeners: number = 10;
  constructor() {
    this.events = {};
  }

  on(event: any, listener: (...args: any[]) => void) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    if (!this.events[event]) {
      this.events[event] = [];
    }
    if (this.events[event].length >= this.maxListeners) {
      console.warn(
        `Possible EventEmitter memory leak detected. ${this.events[event].length} listeners added to event ${event}. Use emitter.setMaxListeners() to increase limit.`
      );
      return;
    }
    this.events[event].push(listener);
  }

  emit(event: any, ...args: any[]) {
    if (!this.events[event]) {
      return;
    }
    const listeners = [...this.events[event]];
    listeners.forEach(async listener => {
      try {
        await listener(...args);
      } catch (error) {
        this.emit('error', error);
      }
    });
  }

  off(event: any, listener: (...args: any[]) => void) {
    if (!this.events[event]) {
      return;
    }
    if (!listener) {
      delete this.events[event];
      return;
    }
    this.events[event] = this.events[event].filter((l: any) => l !== listener);
  }

  once(event: any, listener: (arg0: any) => void) {
    const wrappedListener = (...args: any[]) => {
      //@ts-ignore
      listener(...args);
      this.off(event, wrappedListener);
    };
    this.on(event, wrappedListener);
  }

  setMaxListeners(n: number) {
    if (typeof n !== 'number' || n < 0) {
      throw new TypeError('n must be a positive number');
    }
    this.maxListeners = n;
  }

  removeAllListeners(event: string | number) {
    delete this.events[event];
  }
}
