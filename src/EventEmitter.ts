import { isFunction } from './extensions/functions';

type Listener = (...args: any[]) => any;

interface Event {
  namespace?: string;
  listeners: Listener[];
}

export class EventEmitter {
  private events: Record<string, Event> = {};
  private maxListeners = 10;

  public on(event: string, listener: Listener, namespace?: string): void {
    if (!isFunction(listener)) {
      throw new TypeError('listener must be a function');
    }
    const eventName = namespace ? `${namespace}:${event}` : event;
    const existingEvent = this.getEvent(eventName);
    if (existingEvent && existingEvent.listeners.length >= this.maxListeners) {
      this.warn(
        `Possible EventEmitter memory leak detected. ${existingEvent.listeners.length} listeners added to event ${eventName}. Use emitter.setMaxListeners() to increase limit.`
      );
      return;
    }
    if (!existingEvent) {
      this.events[eventName] = { listeners: [] };
    }
    this.events[eventName].listeners.push(listener);
  }

  public emit(event: string, ...args: any[]): void | any[] {
    const eventName = event.split(':')[0];
    const listeners = this.getListeners(eventName);
    const listenerResults: any[] = [];
    listeners.forEach(listener => {
      try {
        listenerResults.push(listener(...args));
      } catch (error) {
        this.emit('error', error);
      }
    });
    return listenerResults.filter(x => x) || undefined;
  }

  public off(event: string, listener?: Listener, namespace?: string): void {
    const eventName = namespace ? `${namespace}:${event}` : event;
    const existingEvent = this.getEvent(eventName);
    if (!existingEvent) {
      return;
    }
    if (!listener) {
      delete this.events[eventName];
    } else {
      existingEvent.listeners = existingEvent.listeners.filter(
        l => l !== listener
      );
    }
  }

  public once(event: string, listener: Listener, namespace?: string): void {
    const wrappedListener = (...args: any[]) => {
      listener(...args);
      this.off(event, wrappedListener, namespace);
    };
    this.on(event, wrappedListener, namespace);
  }

  public setMaxListeners(n: number): void {
    if (typeof n !== 'number' || n < 0) {
      throw new TypeError('n must be a positive number');
    }
    this.maxListeners = n;
  }

  public removeAllListeners(event: string, namespace?: string): void {
    const eventName = namespace ? `${namespace}:${event}` : event;
    delete this.events[eventName];
  }

  private warn(message: string): void {
    console.warn(message);
  }

  private getEvent(eventName: string): Event | undefined {
    return this.events[eventName];
  }

  private getListeners(eventName: string): Listener[] {
    const listeners: Listener[] = [];
    for (const key in this.events) {
      if (key === eventName || key.startsWith(eventName + ':')) {
        const event = this.getEvent(key);
        if (event) {
          listeners.push(...event.listeners);
        }
      }
    }
    return listeners;
  }
}
