import { StorageNode2_EXC_I, RootStorageNode_EXC_I } from "../../Contracts/Interfaces.js";
import { CustomEventEmitter } from "../../Utils/CustomEventEmitter.js";
import { IStorageService } from "../SystemStorageService/IStroageService.js";

// Extend CustomEventEmitter to handle event emitting
export abstract class StorageNode2 extends CustomEventEmitter implements StorageNode2_EXC_I {
    protected root: RootStorageNode_EXC_I;
    protected name: string;
    protected children: StorageNode2_EXC_I[] = [];
    protected parent: StorageNode2_EXC_I | null = null;
    protected storageService: IStorageService;

    constructor(root: RootStorageNode_EXC_I, name: string, storageService: IStorageService) {
        super(); // Call CustomEventEmitter constructor
        this.root = root;
        this.name = name;
        this.storageService = storageService;
    }

    setRoot(rootStorageNode: StorageNode2_EXC_I) {
        this.parent = rootStorageNode;
    }

    setName(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    public getUrl(): string {
        if (this.parent) {
            let parentUrl = this.parent.getUrl();
            if (parentUrl.endsWith('/') || parentUrl.endsWith('\\')) {
                return `${parentUrl}${this.name}`;
            } else {
                return `${parentUrl}/${this.name}`;
            }
        } else {
            let rootUrl = this.root.getUrl();
            if (rootUrl.endsWith('/') || rootUrl.endsWith('\\')) {
                return `${rootUrl}${this.name}`;
            } else {
                return `${rootUrl}/${this.name}`;
            }
        }
    }

    // Implement getParent
    public getParent(): StorageNode2_EXC_I | null {
        return this.parent;
    }

    // Implement addChild
    public addChild(node: StorageNode2_EXC_I): void {
        // Check if the node is already a child
        if (!this.children.includes(node)) {
            this.children.push(node);
            // Set the parent of the added node
            (node as StorageNode2).setParent(this); // Assuming a setParent method exists
        }
    }

    // Implement removeChild
    public removeChild(node: StorageNode2_EXC_I): void {
        const index = this.children.indexOf(node);
        if (index > -1) {
            this.children.splice(index, 1);
            // Clear the parent of the removed node
            (node as StorageNode2).setParent(null); // Assuming a setParent method exists
        }
    }

    // Protected method to set parent (used by addChild/removeChild)
    protected setParent(parent: StorageNode2_EXC_I | null): void {
        this.parent = parent;
    }

    public async delete(): Promise<void> {
        const currentPath = this.getUrl();
        try {
            await this.storageService.deleteFileOrFolder(currentPath);
            if (this.parent) {
                // Use the public removeChild method
                this.parent.removeChild(this);
            }
        } catch (error) {
            console.error(`Error deleting ${currentPath}:`, error);
            throw new Error(`Failed to delete node ${this.name}: ${error.message}`);
        }
    }

    // Update renameFileOrFolder signature to match interface
    public async renameFileOrFolder(newName: string): Promise<void> { // Return boolean
        const oldPath = this.getUrl();
        // Construct the new path based on the parent's URL and the new name
        const parentPath = this.parent ? this.parent.getUrl() : this.root.getUrl();
        // Ensure consistent path separators (e.g., '/')
        const newPath = (parentPath.endsWith('/') || parentPath.endsWith('\\') ? parentPath : parentPath + '/') + newName;

        try {
            const result = await this.storageService.renameFileOrFolder(oldPath, newPath);
            this.name = newName;
            return result
        } catch (error) {
            throw new Error(`Failed to rename node ${this.name}: ${error.message}`);
            // Return false or rethrow
            // throw new Error(`Failed to rename node ${this.name}: ${error.message}`);
        }
    }

    async updateStorage(): Promise<void> {
        console.warn("updateStorage() not implemented for this node type");
        return Promise.resolve();
    }

    protected createFolder(url: string): Promise<void> {
        return this.createEntity(url, "TEST2", (newFileName) =>
            this.storageService.createFolder(`${url}\\${newFileName}`)
        );
    }

    protected createFile(url: string): Promise<void> {
        return this.createEntity(url, "new File", (newFileName) =>
            this.storageService.saveFile(`${url}\\${newFileName}.txt`, "")
        );
    }

    private async createEntity(
        url: string,
        baseName: string,
        createMethod: (newFileName: string) => Promise<boolean | unknown | void>
    ): Promise<void> {
        const files = await this.storageService.getFilesInFolder(url);
        for (let i = 0; i < 10; i++) {
            const newFileName = i === 0 ? baseName : `${baseName}${i}`;
            if (!checkContains(files, newFileName)) {
                await createMethod(newFileName);
                this.emit('child-added', { name: newFileName, type: baseName === "TEST2" ? 'directory' : 'file' });
                return;
            }
        }
        throw new Error("No valid name found");
    }
}

function checkContains(files: any, arg1: string) {
    return files.some((file: any) => file.name === arg1);
}
