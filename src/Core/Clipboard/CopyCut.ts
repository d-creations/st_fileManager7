import { StorageNode2_EXC_I } from "../../Contracts/Interfaces.js";
import { DirectoryNode } from "../FileSystemService/DirectoryNode.js";
import { StorageNode2 } from "../FileSystemService/StorageNode2.js";
import { IStorageService } from "../SystemStorageService/IStroageService.js";

export interface objectManipulation {
    containsNode(): boolean;
    insertStorage(rootDestination: StorageNode2_EXC_I, storageService: IStorageService): Promise<void>;
}

export class mvObject implements objectManipulation {
    constructor(private node: StorageNode2) { }

    containsNode(): boolean {
        return this.node !== null && this.node !== undefined;
    }

    async insertStorage(rootDestination: StorageNode2_EXC_I, storageService: IStorageService): Promise<void> {
        console.warn("mvObject.insertStorage might be redundant. Consider using cutObject.");
        if (!this.containsNode() || !(rootDestination instanceof DirectoryNode)) {
            throw new Error("Invalid move operation: Source node missing or destination is not a directory.");
        }

        const sourcePath = this.node.getUrl();
        const destinationDirPath = rootDestination.getUrl();
        const destinationPath = `${destinationDirPath}/${this.node.getName()}`;

        try {
            await storageService.moveFileOrFolder(sourcePath, destinationPath);
            const oldParent = this.node.getParent();
            if (oldParent) {
                oldParent.removeChild(this.node);
            }
            rootDestination.addChild(this.node);
        } catch (error) {
            console.error(`Error moving ${sourcePath} to ${destinationPath}:`, error);
            throw new Error(`Failed to move node ${this.node.getName()}: ${error.message}`);
        }
    }
}

export class cutObject implements objectManipulation {
    constructor(private node: StorageNode2) { }

    containsNode(): boolean {
        return this.node !== null && this.node !== undefined;
    }

    async insertStorage(rootDestination: StorageNode2_EXC_I, storageService: IStorageService): Promise<void> {
        if (!this.containsNode() || !(rootDestination instanceof DirectoryNode)) {
            throw new Error("Invalid cut/paste operation: Source node missing or destination is not a directory.");
        }

        const sourcePath = this.node.getUrl();
        const destinationDirPath = rootDestination.getUrl();
        const destinationPath = `${destinationDirPath}/${this.node.getName()}`;

        try {
            await storageService.moveFileOrFolder(sourcePath, destinationPath);
            const oldParent = this.node.getParent();
            if (oldParent) {
                oldParent.removeChild(this.node);
            }
            rootDestination.addChild(this.node);
        } catch (error) {
            console.error(`Error moving ${sourcePath} to ${destinationPath}:`, error);
            throw new Error(`Failed to move node ${this.node.getName()}: ${error.message}`);
        }
    }
}

export class cpObject implements objectManipulation {
    constructor(private node: StorageNode2) { }

    containsNode(): boolean {
        return this.node !== null && this.node !== undefined;
    }

    async insertStorage(rootDestination: StorageNode2_EXC_I, storageeServie: IStorageService): Promise<void> {
        if (!this.containsNode() || !(rootDestination instanceof DirectoryNode)) {
            throw new Error("Invalid copy operation: Source node missing or destination is not a directory.");
        }

        const sourcePath = this.node.getUrl();
        const destinationDirPath = rootDestination.getUrl();
        const destinationPath = `${destinationDirPath}/${this.node.getName()}`;

        try {
            if (!storageeServie.copyFolderOrFile) {
                throw new Error("FileSystemService does not support copy operation.");
            }
            await storageeServie.copyFolderOrFile(sourcePath, destinationPath);
        } catch (error) {
            console.error(`Error copying ${sourcePath} to ${destinationPath}:`, error);
            throw new Error(`Failed to copy node ${this.node.getName()}: ${error.message}`);
        }
    }
}


