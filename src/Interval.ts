class Interval {
  private static _instances: any = {};
  private _value?: number;
  private _callback?: Function;
  private _timeInterval?: number;

  public init(_callback: Function, _timeInterval: number, ctx?: any): void {
    this._callback = _callback.bind(ctx);
    this._timeInterval = _timeInterval;
  }

  public start(clearQueue: boolean = true): void {
    if (this._value && clearQueue) {
      clearInterval(this._value);
      this._value = undefined;
    }

    if (this._callback && this._timeInterval) {
      this._value = setInterval(this._callback, this._timeInterval);
    }
  }

  public stop() {
    if (this._value) {
      clearInterval(this._value);
      this._value = undefined;
    }
  }

  public clear() {
    this.stop();
    this._callback = undefined;
    this._timeInterval = 0;
  }

  public get value() {
    return this._value;
  }

  static instance(name: string) {
    if (!Interval._instances[name]) {
      Interval._instances[name] = new Interval();
    }
    return Interval._instances[name];
  }

  static destroyInstance(name: string) {
    delete Interval._instances[name];
  }

  static getAllInstance() {
    return Interval._instances;
  }

  static stopAllInstance() {
    Object.values(Interval._instances).forEach((instance: any) => instance.stop());
  }

  static clearAllInstances() {
    Object.values(Interval._instances).forEach((instance: any) => instance.clear());
  }
}

export {
  Interval
}