import { IStorageService } from "../../tecnicalServices/fileSystem/IStroageService";
import { FileNode_EXC_I, RootStorageNode_EXC_I } from "../../ViewDomainI/Interfaces";
import { StorageNode2 } from "../StorageNode2.js";

export class FileNode extends StorageNode2 implements FileNode_EXC_I {

    editingState: boolean = false;
    constructor(root: RootStorageNode_EXC_I, name: string, fileSystemService: IStorageService) {
        super(root, name, fileSystemService);
    }
    openEditingState(): void {
        this.editingState = true;    
    }
    closeEditingState(): void {
        this.editingState = false;
    }
    openFile(): void {
        throw new Error("Method not implemented.");
    }
    saveText(text: string) {
        this.saveFile(text);
    }

    public async getFileText(): Promise<string> {
        const filePath = this.getUrl();
        try {
            const content = await this.storageService.getFileText(filePath);
            return content;
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            throw new Error(`Failed to get text for file ${this.name}: ${error.message}`);
        }
    }

    public async saveFile(text: string): Promise<void> {
        const filePath = this.getUrl();
        try {
            await this.storageService.saveFile(filePath, text);
        } catch (error) {
            console.error(`Error saving file ${filePath}:`, error);
            throw new Error(`Failed to save file ${this.name}: ${error.message}`);
        }
    }

    public isDeleted(): boolean {
        // Basic implementation, assuming nodes are not deleted by default
        // You might need more complex logic if you track deletion state
        return false;
    }
}