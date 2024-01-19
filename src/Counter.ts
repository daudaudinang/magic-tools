class Counter {
  private static _instances: any = {};
  private _initialValue: number = 0;
  private _value: number = this._initialValue;

  constructor(initialValue: number) {
    this._initialValue = initialValue;
    this.value = initialValue;
  }

  public get value() {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }

  public increase() {
    this.value += 1;
  }

  public decrease() {
    this.value -= 1;
  }

  public clear() {
    this.value = this._initialValue;
  }

  static instance(name: string, initialValue: number = 0) {
    if (!Counter._instances[name]) {
      Counter._instances[name] = new Counter(initialValue);
    }
    return Counter._instances[name];
  }

  static clearAllInstances() {
    Object.values(Counter._instances).forEach((instance: any) => instance.clear());
  }
}

export {
  Counter
}