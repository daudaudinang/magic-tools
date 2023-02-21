import { EventEmitterClass } from "./EventEmitter";

const privateEvents = {
  "INFO": "INFO", // Thông tin liên quan đến cuộc họp
  "WARNING": "WARNING", // Cảnh báo
  "ERROR": "ERROR", // Lỗi
  "SYSTEM": "SYSTEM", // Thông báo của webapp
}

const TYPE = {
  "INFO": "INFO", // Thông tin liên quan đến cuộc họp
  "WARNING": "WARNING", // Cảnh báo
  "ERROR": "ERROR", // Lỗi
  "SYSTEM": "SYSTEM", // Thông báo của webapp
}

const handleSystemTime = () => {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  return `[${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second}]`;
}

class Logger {
  privateEventEmitter:EventEmitterClass;
  side:string = 'SDK';
  onEvent?:(data: any) => void;

  constructor(side:string = 'SDK') {
    this.privateEventEmitter = new EventEmitterClass();
    this.side = side;
    this.privateEventEmitter.subscribe('@all', (data: any) => {
      if(this.onEvent) {
        this.onEvent(data);
      }
    });
  }

  private log = (type:string, event: string, ...args: any[]) => {
    const side = this.side.toUpperCase();
    if(typeof type === "string") type = type?.toUpperCase();
    if(type === "event") event = event.toUpperCase();
  
    const time = handleSystemTime();
    
    switch(type) {
      case TYPE.ERROR: {
        const style = 'color: red;';
        console.log(`[${time}]%c[${this.side}][${type}][${event}]:`, style, ...args);
        this.privateEventEmitter.dispatch(privateEvents.INFO, {time, side, type, event});
        break;
      }
      case TYPE.WARNING: {
        const style = 'color: orange;';
        console.log(`[${time}]%c[${side}][${type}][${event}]:`, style, ...args);
        this.privateEventEmitter.dispatch(privateEvents.WARNING, {time, side, type, event});
        break;
      }
      case TYPE.INFO: {
        const style = 'color: green;';
        console.log(`[${time}]%c[${side}][${type}][${event}]:`, style, ...args);
        this.privateEventEmitter.dispatch(privateEvents.ERROR, {time, side, type, event});
        break;
      }
      case TYPE.SYSTEM: {
        const style = 'color: violet;';
        console.log(`[${time}]%c[${side}][${type}][${event}]:`, style, ...args);
        this.privateEventEmitter.dispatch(privateEvents.SYSTEM, {time, side, type, event});
        break;
      }
    }
  }

  public setSide(side: string) {
    this.side = side;
  }

  public addEventListener(eventName: string, callback: any): void {
    if(!callback) return;
    this.privateEventEmitter.subscribe(eventName, callback);
  }
  
  public error = (event: string, ...args: any[]) => {
    return this.log(TYPE.ERROR, event, ...args);
  }
  
  public info = (event: string, ...args: any[]) => {
    return this.log(TYPE.INFO, event, ...args);
  }
  
  public warning = (event: string, ...args: any[]) => {
    return this.log(TYPE.WARNING, event, ...args);
  }
  
  public system = (event: string, ...args: any[]) => {
    return this.log(TYPE.SYSTEM, event, ...args);
  }
}

const Log = new Logger('SDK');

export {
  Log,
  Logger
}