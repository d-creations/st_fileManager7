import { IuiEventService } from "./IuieventService.js";



export class UIEventService implements IuiEventService {
    constructor() {

    }
    private _listeners: Map<string, Array<(payload?: any) => void>> = new Map();

    on<T = any>(eventName: string, callback: (payload?: T) => void): () => void {
        if (!this._listeners.has(eventName)) {
            this._listeners.set(eventName, []);
        }
        this._listeners.get(eventName)?.push(callback);

        // Return an unsubscribe function
        return () => {
            this.off(eventName, callback);
        };
    }

    trigger<T = any>(eventName: string, payload?: T): void {
        if (this._listeners.has(eventName)) {
            // Iterate over a copy of the listeners array to avoid issues if a listener unsubscribes itself
            const listeners = this._listeners.get(eventName)?.slice() || [];
            listeners.forEach(callback => {
                try {
                    callback(payload);
                } catch (error) {
                    console.error(`Error executing listener for event "${eventName}":`, error);
                }
            });
        }
    }

    off<T = any>(eventName: string, callback: (payload?: T) => void): void {
        if (this._listeners.has(eventName)) {
            const listeners = this._listeners.get(eventName);
            if (listeners) {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
                // Clean up if no listeners remain for this event
                if (listeners.length === 0) {
                    this._listeners.delete(eventName);
                }
            }
        }
    }
}