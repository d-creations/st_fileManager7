type Listener = (...args: any[]) => void;

export class CustomEventEmitter {
    private events: { [eventName: string]: Listener[] } = {};

    on(eventName: string, listener: Listener): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    off(eventName: string, listenerToRemove: Listener): void {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName] = this.events[eventName].filter(
            listener => listener !== listenerToRemove
        );
    }

    emit(eventName: string, ...args: any[]): void {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].forEach(listener => {
            try {
                listener(...args);
            } catch (error) {
                console.error(`Error in listener for event "${eventName}":`, error);
            }
        });
    }

    removeAllListeners(eventName?: string): void {
        if (eventName) {
            delete this.events[eventName];
        } else {
            this.events = {};
        }
    }

    listenerCount(eventName: string): number {
        return this.events[eventName] ? this.events[eventName].length : 0;
    }
}
