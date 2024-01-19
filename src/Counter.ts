class Counter {
  private static _instances: any = {};
  private _value: number = 0;

  constructor(initialValue: number) {
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
    this.value = 0;
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