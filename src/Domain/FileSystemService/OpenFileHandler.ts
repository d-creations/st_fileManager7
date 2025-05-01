import { ApplciationIndex } from "../../View/TabManager/TabApplication";
import { FileNode_EXC_I } from "../../ViewDomainI/Interfaces";
import { FileNode } from "./FileNode";
import { IAppForFileService } from "./IAppForFileService";
import { IOpenFileHandler } from "./IOpenFileHander";


export const appForOpenService : IAppForFileService = null 


export class OpenFileHander implements IOpenFileHandler {
    private fileNode: FileNode_EXC_I;
    private app: ApplciationIndex;
    private isDeletedFlag: boolean = false; // Initialize the flag to false

    constructor(fileNode : FileNode_EXC_I, app: ApplciationIndex){
        this.app = app
        this.fileNode = fileNode
        // Assuming 'appOpenService' is injected via a decorator (e.g., @inject) on the property declaration
    }
    getUrl(): string {
        throw new Error("Method not implemented.");
    }
    getName(): string {
        throw new Error("Method not implemented.");
    }

    isDeleted(): boolean {
        return this.isDeletedFlag; // Return the current state of the flag
    }
    saveFile(text: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // Simulate saving the file
            resolve(); // Call resolve when done
        });
    }
    getFileText(): Promise<string> {
        return new Promise((resolve, reject) => {
            // Simulate reading the file
            resolve("File content"); // Call resolve with the file content
        });
    }
    openEditingState(): void {
        // Logic to open the editing state
    }
    closeEditingState(): void {
        // Logic to close the editing state
    }
    openFile(): void {
        appForOpenService.openFileInapp(this.fileNode, this.app); // Assuming TabCreator is a class responsible
        // Logic to open the file in the specified application
    }
    saveText(text: string): void {
        console.log(`Saving text: ${text}`);
        // Logic to save the text
    }
    // Add any other methods or properties as needed    

}