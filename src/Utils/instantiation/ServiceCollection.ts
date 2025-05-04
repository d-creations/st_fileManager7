/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Represents a unique identifier for a service.
 */
export interface ServiceIdentifier<T> {
	(...args: any[]): void;
	type: T;
}

/**
 * Describes how to create a service instance.
 */
class SyncDescriptor<T> {
	/**
	 * @param ctor The constructor function for the service.
	 * @param staticArguments Static arguments to pass to the constructor.
	 * @param isSingleton Whether the service should be a singleton. Defaults to false.
	 */
	constructor(
		public readonly ctor: new (...args: any[]) => T,
		public readonly staticArguments: any[] = [],
		public readonly isSingleton: boolean = false
	) { }
}

/**
 * Internal utilities for dependency injection.
 */
export namespace DIHelper {
	/** Stores registered service identifiers. */
	export const serviceIds = new Map<string, ServiceIdentifier<any>>();

	/** Symbol used to store the target constructor on which dependencies are defined. */
	export const DI_TARGET = Symbol('di$target');
	/** Symbol used to store dependency metadata on a constructor. */
	export const DI_DEPENDENCIES = Symbol('di$dependencies');

	/**
	 * Retrieves the dependency metadata for a given constructor.
	 * @param ctor The constructor function.
	 * @returns An array of dependency metadata objects.
	 */
	export function getServiceDependencies(ctor: any): { id: ServiceIdentifier<any>; index: number }[] {
		return ctor[DI_DEPENDENCIES] || [];
	}
}

/**
 * Stores dependency metadata on a target constructor.
 * @param id The service identifier of the dependency.
 * @param target The target constructor function.
 * @param index The parameter index of the dependency in the constructor.
 */
function storeServiceDependency(id: Function, target: Function, index: number): void {
	// Ensure the target has the DI_TARGET symbol, pointing to itself.
	// This helps ensure that the dependencies are stored on the correct class,
	// especially important with class inheritance.
	if (target[DIHelper.DI_TARGET] !== target) {
		target[DIHelper.DI_TARGET] = target;
		target[DIHelper.DI_DEPENDENCIES] = []; // Initialize dependencies array for the target
	}

	const dependencies = target[DIHelper.DI_DEPENDENCIES] || [];
	dependencies.push({ id, index });
	target[DIHelper.DI_DEPENDENCIES] = dependencies;
}


/**
 * Creates a service identifier and a decorator for dependency injection.
 * This is the standard way to define injectable services.
 * @param serviceId A unique string identifier for the service.
 * @returns A ServiceIdentifier instance.
 */
export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
	if (DIHelper.serviceIds.has(serviceId)) {
		return DIHelper.serviceIds.get(serviceId)!;
	}

	const id: ServiceIdentifier<T> = <any>function (target: Function, key: string | symbol | undefined, index: number): void {
		if (arguments.length !== 3) {
			throw new Error('@IServiceName-decorator can only be used to decorate a constructor parameter.');
		}
		if (key !== undefined) {
			throw new Error('@IServiceName-decorator cannot be used on properties or methods.');
		}
		storeServiceDependency(id, target, index);
	};

	id.toString = () => serviceId;

	DIHelper.serviceIds.set(serviceId, id);
	return id;
}

/**
 * Manages the collection of services and their instantiation.
 */
class ServiceCollection {
	private services: Map<ServiceIdentifier<any>, SyncDescriptor<any> | any>;

	constructor() {
		this.services = new Map();
	}

	/**
	 * Registers a service with the collection.
	 * @param id The service identifier.
	 * @param descriptorOrInstance Either a SyncDescriptor describing how to create the service, or the service instance itself.
	 */
	register<T>(id: ServiceIdentifier<T>, descriptorOrInstance: SyncDescriptor<T> | T): void {
		if (this.services.has(id)) {
			console.warn(`Service '${String(id)}' is already registered. Overwriting registration.`);
		}
		this.services.set(id, descriptorOrInstance);
	}

	/**
	 * Resolves a service instance from the collection.
	 * Handles singleton and transient service creation based on registration.
	 * @param id The service identifier.
	 * @returns The resolved service instance.
	 * @throws Error if the service is not found.
	 */
	resolve<T>(id: ServiceIdentifier<T>): T {
		const entry = this.services.get(id);
		if (!entry) {
			throw new Error(`Service '${String(id)}' not found. Ensure it is registered.`);
		}

		if (entry instanceof SyncDescriptor) {
			// Entry is a descriptor, needs instantiation
			const descriptor = entry as SyncDescriptor<T>;
			if (descriptor.isSingleton) {
				// Singleton: Create instance, replace descriptor with instance, return instance
				const instance = this.createInstance(descriptor);
				this.services.set(id, instance); // Cache the singleton instance
				return instance;
			} else {
				// Transient: Create and return a new instance each time
				return this.createInstance(descriptor);
			}
		} else {
			// Entry is already an instance
			return entry;
		}
	}

	/**
	 * Checks if a service is registered in the collection.
	 * @param id The service identifier.
	 * @returns True if the service is registered, false otherwise.
	 */
	has<T>(id: ServiceIdentifier<T>): boolean {
		return this.services.has(id);
	}

	/**
	 * Creates an instance of a service using its descriptor and resolving dependencies.
	 * @param descriptor The SyncDescriptor for the service.
	 * @returns The created service instance.
	 */
	private createInstance<T>(descriptor: SyncDescriptor<T>): T {
		const Ctor = descriptor.ctor;
		const staticArgs = descriptor.staticArguments || [];
		const serviceDependencies = DIHelper.getServiceDependencies(Ctor);

		// Sort dependencies by index to ensure correct argument order
		serviceDependencies.sort((a, b) => a.index - b.index);

		const dynamicArgs: any[] = [];
		for (const dependency of serviceDependencies) {
			// Resolve dependency using this service collection
			const serviceInstance = this.resolve(dependency.id);
			if (!serviceInstance) {
				throw new Error(`[createInstance] Failed to resolve dependency '${String(dependency.id)}' for '${Ctor.name}'.`);
			}
			// Ensure dynamic args array is long enough, filling gaps with undefined if necessary
			if (dependency.index >= dynamicArgs.length) {
				dynamicArgs.length = dependency.index + 1;
			}
			dynamicArgs[dependency.index] = serviceInstance;
		}

		// Combine static and resolved dynamic arguments
		// Assuming static arguments come first, followed by injected dependencies
		// Adjust if the convention is different (e.g., dependencies first)
		const allArgs = [...staticArgs, ...dynamicArgs];

		// Instantiate the service
		try {
			// Using 'new' with spread arguments requires careful handling if constructor expects specific types
			// or has optional parameters mixed with injected ones.
			// This assumes injected parameters are typically appended.
			return new Ctor(...allArgs);
		} catch (error) {
			console.error(`Error instantiating service '${Ctor.name}' with arguments: `, allArgs, error);
			throw new Error(`Failed to instantiate service '${Ctor.name}'. Check constructor and dependencies. Error: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
}

/**
 * Provides access to services registered in a ServiceCollection.
 * Useful for passing around service access capability without exposing registration methods.
 */
class ServiceAccessor {
	constructor(private readonly serviceCollection: ServiceCollection) { }

	/**
	 * Retrieves a service instance.
	 * @param id The service identifier.
	 * @returns The resolved service instance.
	 * @throws Error if the service is not found.
	 */
	getService<T>(id: ServiceIdentifier<T>): T {
		// No need to check 'has' again, 'resolve' already does it.
		// if (!this.serviceCollection.has(id)) {
		//   throw new Error(`Service '${String(id)}' not found in the collection accessed by ServiceAccessor.`);
		// }
		try {
			return this.serviceCollection.resolve(id);
		} catch (error) {
			// Optionally re-throw or handle the error from resolve
			console.error(`ServiceAccessor failed to get service '${String(id)}'.`, error);
			throw error; // Re-throw the original error from resolve
		}
	}
}

export { ServiceCollection, SyncDescriptor, ServiceAccessor };