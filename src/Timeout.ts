class Timeout {
  private static _instances: any = {};
  private _value?: number;
  private _callback?: Function;
  private _timeout?: number;

  public init(_callback: Function, _timeInterval: number, ctx?: any): void {
    this._callback = _callback.bind(ctx);
    this._timeout = _timeInterval;
  }

  public start(clearQueue: boolean = true) {
    if (this._value && clearQueue) {
      clearTimeout(this._value);
      this._value = undefined;
    }

    if (this._callback && this._timeout) {
      this._value = setTimeout(this._callback, this._timeout);
    }
  }

  public stop() {
    if (this._value) {
      clearTimeout(this._value);
      this._value = undefined;
    }
  }

  public clear() {
    this.stop();
    this._callback = undefined;
    this._timeout = 0;
  }

  public get value() {
    return this._value;
  }

  static instance(name: string) {
    if (!Timeout._instances[name]) {
      Timeout._instances[name] = new Timeout();
    }
    return Timeout._instances[name];
  }

  static destroyInstance(name: string) {
    delete Timeout._instances[name];
  }

  static getAllInstance() {
    return Timeout._instances;
  }

  static stopAllInstance() {
    Object.values(Timeout._instances).forEach((instance: any) => instance.stop());
  }

  static clearAllInstances() {
    Object.values(Timeout._instances).forEach((instance: any) => instance.clear());
  }
}

export {
  Timeout
}