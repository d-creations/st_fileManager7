import { DIHelper, ServiceCollection, ServiceIdentifier } from './ServiceCollection.js';

export interface ServicesAccessor {
  get<T>(id: ServiceIdentifier<T>): T;
}

export class InstantiationService {
  private readonly services: ServiceCollection;
  private _isDisposed: boolean = false; // Added dispose flag

  constructor(services: ServiceCollection) {
    this.services = services;
  }

  invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R {
    if (this._isDisposed) { // Added dispose check
      throw new Error('InstantiationService has been disposed.');
    }
    const accessor: ServicesAccessor = {
      get: <T>(id: ServiceIdentifier<T>): T => {
        if (this._isDisposed) { // Added dispose check
          throw new Error(`Cannot get service "${String(id)}" after InstantiationService has been disposed.`);
        }
        return this.services.resolve(id);
      },
    };
    return fn(accessor, ...args);
  }

  createInstance<T>(ctor: new (...args: any[]) => T, ...args: any[]): T {
    if (this._isDisposed) { // Added dispose check
      throw new Error('InstantiationService has been disposed.');
    }
    const dependencies = DIHelper.getServiceDependencies(ctor).map(dep => this.services.resolve(dep.id));
    return new ctor(...dependencies, ...args);
  }

  /**
   * Disposes of the instantiation service and its managed services.
   */
  dispose(): void { // Added dispose method
    if (!this._isDisposed) {
      this._isDisposed = true;
      
    }
  }

  /**
   * Checks if the instantiation service has been disposed.
   */
  get isDisposed(): boolean { // Added isDisposed getter
    return this._isDisposed;
  }
}