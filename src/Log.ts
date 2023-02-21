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

const side = 'CLIENT'; // or 'SDK'

class LOG {
  static log = (type:string, event: string, ...args: any[]) => {
    if(typeof type === "string") type = type?.toUpperCase();
    if(type === "event") event = event.toUpperCase();
  
    const time = handleSystemTime();
    
    switch(type) {
      case TYPE.ERROR: {
        const style = 'color: red;';
        console.log(`[${time}]%c[${side}][${type}][${event}]:`, style, ...args);
        break;
      }
      case TYPE.WARNING: {
        const style = 'color: orange;';
        console.log(`[${time}]%c[${side}][${type}][${event}]:`, style, ...args);
        break;
      }
      case TYPE.INFO: {
        const style = 'color: green;';
        console.log(`[${time}]%c[${side}][${type}][${event}]:`, style, ...args);
        break;
      }
      case TYPE.SYSTEM: {
        const style = 'color: violet;';
        console.log(`[${time}]%c[${side}][${type}][${event}]:`, style, ...args);
        break;
      }
    }
  }
  
  static error = (event: string, ...args: any[]) => {
    return LOG.log(TYPE.ERROR, event, ...args);
  }
  
  static info = (event: string, ...args: any[]) => {
    return LOG.log(TYPE.INFO, event, ...args);
  }
  
  static warning = (event: string, ...args: any[]) => {
    return LOG.log(TYPE.WARNING, event, ...args);
  }
  
  static system = (event: string, ...args: any[]) => {
    return LOG.log(TYPE.SYSTEM, event, ...args);
  }
}

export {
  LOG
}