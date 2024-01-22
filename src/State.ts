class State {
  private static _instances: any = {};
  private _value?: any;
  private _onUpdate?: any;

  constructor(initialValue: any) {
    this.value = initialValue;
  }

  public get value() {
    return this._value;
  }

  public set value(value: any) {
    this._value = value;
    if(typeof this._onUpdate === 'function') {
      this._onUpdate(value);
    }
  }

  public set onUpdate(callback: any) {
    this._onUpdate = callback;
  }

  static instance(name: string, initialValue?: any): State {
    if (!State._instances[name]) {
      State._instances[name] = new State(initialValue);
    }
    return State._instances[name];
  }

  static destroyInstance(name: string) {
    delete State._instances[name];
  }

  static clearAllInstances() {
    Object.values(State._instances).forEach((instance: any) => instance.clear());
  }
}

export {
  State
}