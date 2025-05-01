import { createDecorator } from "../../tecnicalServices/instantiation/ServiceCollection.js";


export const IOpenFileHandler = createDecorator<IOpenFileHandler>('IOpenFileHandler');

export interface IOpenFileHandler {
    getUrl(): string;
    getName(): string;
    isDeleted(): boolean; // Add isDeleted method signature
    saveFile(text: string): Promise<void>;
    getFileText(): Promise<string>; // Correct return type to Promise<string>
    openEditingState(): void;
    closeEditingState(): void;
    openFile(): void;
    saveText(text : string)
}
