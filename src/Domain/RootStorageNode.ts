import { IStorageService } from "../tecnicalServices/fileSystem/IStroageService.js";
import { RootStorageNode_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { StorageNode2 } from "./StorageNode2.js";

export class RootStorageNode extends StorageNode2 implements RootStorageNode_EXC_I {
    private path: string;

    // Update constructor to accept and pass FileSystemService_I
    constructor(path: string, storageService: IStorageService) {
        // Call StorageNode2 constructor: root is null/undefined for Root, name is derived/fixed, pass service
        // Using path as name for simplicity, adjust if needed.
        super(null as any, path, storageService); // Pass null/undefined for root, path as name, and service
        this.path = path;
        this.parent = null; // Explicitly set parent to null for root
    }

    // Override getUrl to return the root path
    public getUrl(): string {
        return this.path;
    }

    // Override getParent to always return null
    public getParent(): StorageNode2_EXC_I | null {
        return null;
    }

    // updateStorage might need implementation if root needs specific update logic
    async updateStorage(): Promise<void> {
        console.log("RootStorageNode updateStorage called - implement if needed");
        // Example: If root needs to list its immediate children (drives, main folders)
        // await this.updateTree(); // Assuming updateTree logic exists or is added
        return Promise.resolve();
    }
}