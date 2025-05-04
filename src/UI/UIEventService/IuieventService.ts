import { createDecorator } from "../../Utils/instantiation/ServiceCollection.js";

/**
 * Defines the contract for a UI event service.
 * Allows different parts of the application to communicate
 * by triggering and listening to named events.
 */
export const  IuiEventService  = createDecorator<IuiEventService>('IuiEventService');

/**
 * Enum defining predefined UI event names.
 */
export enum APPUIEvent {
     FileSave = 'fileSave',
    FileOpen = 'fileOpen',
    FileOpenInEditor = 'fileOpenInEditor',
    FileClose = 'fileClose',
    FileDelete = 'fileDelete',
    FolderOpen = 'folderOpen',
    FolderClose = 'folderClose',
    SetStorage = 'setStorage',
    storageChanged = 'storageChanged',
    saveAll = 'saveAll',
    openInfo = 'openInfo',
    FileOpenWithSpezApplication = 'fileOpenWithSpezApplication',
    openSetting = 'openSetting',
    CloseApplication = 'closeApplication',
    CloseOpenFiles = 'closeOpenFiles',
    // Added missing event types
    Error = 'error',
    Info = 'info',
    // Added missing Warning event type
    Warning = 'warning',

}

export interface IuiEventService {
    /**
     * Subscribes to a specific UI event.
     * @param eventName The name of the event to subscribe to (e.g., 'fileSave', 'userLogin').
     * @param callback The function to execute when the event is triggered.
     *                 It receives an optional payload associated with the event.
     * @returns A function that, when called, unsubscribes the listener from the event.
     */
    on<T = any>(eventName: string, callback: (payload?: T) => void): () => void;

    /**
     * Triggers a specific UI event, notifying all subscribed listeners.
     * @param eventName The name of the event to trigger.
     * @param payload Optional data to pass to the event listeners.
     */
    trigger<T = any>(eventName: string, payload?: T): void;

    /**
     * Unsubscribes a specific callback function from an event.
     * Note: This might be less commonly used if the 'on' method returns an unsubscribe function,
     * but can be useful in specific scenarios.
     * @param eventName The name of the event.
     * @param callback The specific callback function to remove.
     */
    off<T = any>(eventName: string, callback: (payload?: T) => void): void;
}