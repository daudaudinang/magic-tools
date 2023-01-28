import { EventEmitterClass } from "./EventEmitter";

const events = {
  "PUSH": "PUSH",
  "SHIFT": "SHIFT",
}

export interface QueueInterface {
  id?: string;
  callback: any;
  removePendingTask?: boolean;
  pendingTime?: number;
  timeout?: number;
}

interface PendingTaskInterface extends QueueInterface {
  pendingTask: any;
}

class QueueClass {
  private _queue:QueueInterface[];
  private _listPendingTask:PendingTaskInterface[];
  private _isProcessing:boolean;
  private _privateEventEmitter: EventEmitterClass;

  constructor() {
    this._queue = [];
    this._listPendingTask = [];
    this._isProcessing = false;
    this._privateEventEmitter = new EventEmitterClass();
    const self = this;

    this._privateEventEmitter.subscribe([events.PUSH, events.SHIFT], () => {
      if(!self._isProcessing && self._queue.length > 0) {
        self.dequeue();
      }
    })
  }

  public enqueue = (queueInfo: QueueInterface) => {
    const { id, callback, removePendingTask, pendingTime } = queueInfo;

    if(!callback || typeof(callback) !== 'function') return;
    const promise = new Promise((resolve, reject) => {
      // Bọc nó vào 1 function, để khi nào callback được chạy xong thì trả về data cho user
      // const callbackWrapper = (() => {
      //   if(isAsync(callback)) {
      //     const callbackWrapper_tmp = async () => {
      //       try {
      //         const resp = await callback();
      //         resolve(resp);
      //       } catch (exception) {
      //         reject(exception);
      //       }
      //     }
      //     return callbackWrapper_tmp;
      //   } else {
      //     const callbackWrapper_tmp = () => {
      //       try {
      //         const resp = callback();
      //         resolve(resp);
      //       } catch (exception) {
      //         reject(exception);
      //       }
      //     }
      //     return callbackWrapper_tmp;
      //   }
      // })();
      const callbackWrapper = (() => {
        const callbackWrapper_tmp = async () => {
          try {
            const resp = await callback();
            resolve(resp);
          } catch (exception) {
            reject(exception);
          }
        }

        return callbackWrapper_tmp;
      })();

      const data = {
        id: id || Math.random().toString(36).substring(6),
        callback: callbackWrapper,
        removePendingTask,
        pendingTime
      }

      if(removePendingTask) {
        if(id) {
          this._queue = this._queue.filter(one => one.id !== id);
  
          const listPendingTask = this._listPendingTask.filter(one => one.id === id);
          listPendingTask.forEach(one => {
            clearTimeout(one.pendingTask);
          })
          this._listPendingTask = this._listPendingTask.filter(one => one.id !== id);
        }
  
        this._queue = this._queue.filter(one => one.callback.toString() !== data.callback.toString());
  
        const listPendingTask = this._listPendingTask.filter(one => one.callback.toString() === data.callback.toString());
        listPendingTask.forEach(one => {
          clearTimeout(one.pendingTask);
        })
        this._listPendingTask = this._listPendingTask.filter(one => one.callback.toString() !== data.callback.toString());
      }

      this._queue.push(data);
      this._privateEventEmitter.dispatch(events.PUSH, data);
    });

    return promise;
  }

  private dequeue = () => {
    this._isProcessing = true;
    const data = this._queue.shift();
    const self = this;

    if(!data) {
      this._isProcessing = false;
      return;
    } else {
      const handler = async () => {
        const timeout = (() => {
          if(data.timeout) {
            return setTimeout(() => {
              self._isProcessing = false;
              this._privateEventEmitter.dispatch(events.SHIFT, undefined);
            }, data.timeout);
          } else return undefined;
        })();

        try {
          await data.callback();
          this._isProcessing = false;
          this._privateEventEmitter.dispatch(events.SHIFT, undefined);
          if(timeout) clearTimeout(timeout);
        } catch (exception) {
          this._isProcessing = false;
          this._privateEventEmitter.dispatch(events.SHIFT, undefined);
          if(timeout) clearTimeout(timeout);
        }

        // if(isAsync(data.callback)) {
        //   data.callback()
        //   .then(() => {
        //     self._isProcessing = false;
        //     this._privateEventEmitter.dispatch(events.SHIFT, undefined);
        //     if(timeout) clearTimeout(timeout);
        //   })
        //   .catch(() => {
        //     self._isProcessing = false;
        //     this._privateEventEmitter.dispatch(events.SHIFT, undefined);
        //     if(timeout) clearTimeout(timeout);
        //   })
        // } else {
        //   data.callback();
        //   self._isProcessing = false;
        //   this._privateEventEmitter.dispatch(events.SHIFT, undefined);
        //   if(timeout) clearTimeout(timeout);
        // }
      }

      if(data.pendingTime) {
        const pendingTask = setTimeout(() => {
          handler();
        }, data.pendingTime);

        this._listPendingTask.push({
          ...data,
          pendingTask
        });
      } else {
        handler();
      }
    }
  }

  public removeAll = () => {
    this._queue = [];
  }
}

const GlobalQueue = new QueueClass();

export {
  GlobalQueue,
  QueueClass
}