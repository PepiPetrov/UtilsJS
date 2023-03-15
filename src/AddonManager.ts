export class AddonManager<T extends { new(...args: any[]): any }> {
  protected addons: Map<string, InstanceType<T>> = new Map();
  protected addonClasses: Map<string, T> = new Map();
  protected dependencies: Array<any> = [];

  [key: string]: any;

  public getEntries() {
    return Array.from(this.addonClasses.entries());
  }

  public addAddon(addon: any, name: string = addon.name): void {
    const instance = new addon();
    this.addInstanceProperties(instance);
    this.addons.set(name, instance);
    this.addonClasses.set(name, addon);
    this.addDependencies(instance);
  }

  public removeAddon(name: string): void {
    const instance = this.addons.get(name);
    if (!instance) return;
    this.removeInstanceProperties(instance);
    this.addons.delete(name);
    this.addonClasses.delete(name);
    this.removeDependencies(instance);
    this.addDependencies(this.dependencies);
  }

  public getAddon(name: string): any {
    return this.addonClasses.get(name);
  }

  protected addInstanceProperties(instance: any): void {
    for (const prop in instance) {
      const descriptor = Object.getOwnPropertyDescriptor(instance, prop);
      if (descriptor && typeof descriptor.value === 'function') {
        this.addProperty(prop, descriptor.value.bind(this));
      } else {
        this.addProperty(prop, instance[prop]);
      }
    }
  }

  protected removeInstanceProperties(instance: any): void {
    for (const prop in instance) {
      delete this[prop];
    }
  }

  protected addDependencies(instance: any): void {
    if (!instance.dependencies) return;
    instance.dependencies.forEach((addon: any) => {
      const instance = new addon();
      this.addInstanceProperties(instance);
      this.addons.set(addon.name, instance);
      this.addonClasses.set(addon.name, addon);
      this.addDependencies(instance);
    });
  }

  protected removeDependencies(instance: any): void {
    if (!instance.dependencies) return;
    instance.dependencies.forEach((addon: any) => {
      const instance = this.addons.get(addon.name);
      if (!instance) return;
      this.removeInstanceProperties(instance);
      this.addons.delete(addon.name);
      this.addonClasses.delete(addon.name);
      this.removeDependencies(instance);
    });
  }

  protected addProperty(name: string, value: any): void {
    Object.defineProperty(this, name, {
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
      },
      configurable: true,
      enumerable: true,
    });
  }
}
