export interface EventEmitterInterface {
  _events: any;
  dispatch: (eventName: string, data: any) => void;
  subscribe: (eventName: string, callback: any, times?: number) => string | undefined;
  unsubscribe: (eventName: string, callback?: any, id?: string) => void | undefined;
}

export interface Event {
  id: string;
  times?: number;
  callback: (arg0: any) => any;
}

class EventEmitter {
  private static _instances: any = {};
  private _events: any;

  constructor() {
    this._events = {};
  }
  
  dispatch(eventName: string, data: any) {
    if (!eventName) return;
    if (this._events[eventName]) {
      this._events[eventName].forEach((one: Event) => {
        if (one.times || one.times === 0) {
          if (one.times > 0) {
            one.times = one.times - 1;
            one.callback(data);
          } else {
            this.unsubscribe(eventName, null, one.id);
          }
        } else {
          one.callback(data);
        }
      });
    }
    if (eventName !== '@all') {
      this.dispatch('@all', { event: eventName, data });
    }
  }
  
  subscribe(eventName: string | string[], callback: any, times?: number): string {
    if (typeof eventName === 'string') {
      if (!eventName || !callback) return '';
      if (!this._events[eventName]) this._events[eventName] = [];

      const data = {
        id: Math.random().toString(36).substring(6),
        callback,
        times: times
      };

      this._events[eventName].push(data);

      return data.id;
    } else if (Array.isArray(eventName) && eventName?.length > 0) {
      if (!callback) return '';

      const data = {
        id: Math.random().toString(36).substring(6),
        callback,
        times: times
      };

      eventName.forEach((oneEventName) => {
        if (!this._events[oneEventName]) this._events[oneEventName] = [];
        this._events[oneEventName].push(data);
      });
      
      return data.id;
    }

    return '';
  }

  unsubscribe(eventName:string, callback: any, id: string): boolean {
    if (!eventName || !this._events[eventName]) return false;
    if (callback || id) {
      this._events[eventName] = this._events[eventName].filter((one: Event) => !(one.id === id || one.callback?.toString() === callback?.toString()));
    } else {
      delete this._events[eventName];
    }

    return true;
  }

  clear() {
    this._events = {};
  }

  static instance(name: string) {
    if (!EventEmitter._instances[name]) {
      EventEmitter._instances[name] = new EventEmitter();
    }
    return EventEmitter._instances[name];
  }

  static destroyInstance(name: string) {
    delete EventEmitter._instances[name];
  }
  
  static clearAllInstances() {
    Object.values(EventEmitter._instances).forEach((instance: any) => instance.clear());
  }
}

export { 
  EventEmitter 
};
