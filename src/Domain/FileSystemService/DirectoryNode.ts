import { IStorageService } from "../../tecnicalServices/fileSystem/IStroageService.js";
import { DirectoryNode_EXC_I, FileNode_EXC_I, RootStorageNode_EXC_I, StorageNode2_EXC_I } from "../../ViewDomainI/Interfaces.js";
import { StorageNode2 } from "../StorageNode2.js";
import { FileNode } from "./FileNode.js";

export class DirectoryNode extends StorageNode2 implements DirectoryNode_EXC_I {
    // Explicitly type children arrays with interface types
    public files: FileNode_EXC_I[] = [];
    public dirs: DirectoryNode_EXC_I[] = [];

    constructor(root: RootStorageNode_EXC_I, name: string, storageService: IStorageService) {
        super(root, name, storageService);
        // Initialize with interface types if needed, though assignment should work
        this.files = [];
        this.dirs = [];
    }

    getName(): string {
        return this.name;
    }

    public async createNewFile(fileName: string = "newFile.txt"): Promise<void> { // Return boolean
        const parentDirPath = this.getUrl();
        const newFilePath = `${parentDirPath}/${fileName}`; // Adjust separator if needed
        try {
            const result = await this.storageService.saveFile(newFilePath,"");
            const newFileNode = new FileNode(this.root, fileName, this.storageService);
            this.addChild(newFileNode);
            return result;
        } catch (error) {
            throw new Error(`Failed to create file in directory ${this.name}: ${error.message}`);
        }
    }

    public async createNewFolder(folderName: string = "newFolder"): Promise<void> { // Return boolean
        const parentDirPath = this.getUrl();
        const newFolderPath = `${parentDirPath}/${folderName}`; // Adjust separator if needed
        try {
            const result = await this.storageService.createFolder(newFolderPath);
                const newDirNode = new DirectoryNode(this.root, folderName, this.storageService);
                this.addChild(newDirNode);
            return result;
        } catch (error) {
            throw new Error(`Failed to create folder in directory ${this.name}: ${error.message}`);
        }
    }

    // Return interface types
    getFiles(): FileNode_EXC_I[] {
        // Filter children based on type
        return this.children.filter(child => child instanceof FileNode) as FileNode_EXC_I[];
    }

    // Return interface types
    getDirectories(): DirectoryNode_EXC_I[] {
        // Filter children based on type
        return this.children.filter(child => child instanceof DirectoryNode) as DirectoryNode_EXC_I[];
    }

    updateStorage(): Promise<void> {
        return this.updateTree();
    }

    public async updateTree(): Promise<void> {
        const dirPath = this.getUrl();
        try {
            // No need to check for listDirectory existence anymore
            const entries = await this.storageService.getFilesInFolder(dirPath);
            this.children = []; // Clear existing children before repopulating
            this.files = [];
            this.dirs = [];
            for (const entry of entries) {
                let childNode: StorageNode2_EXC_I;
                if (entry.isDirectory) {
                    // Assign DirectoryNode instance to DirectoryNode_EXC_I
                    const dirNode = new DirectoryNode(this.root, entry.name, this.storageService);
                    childNode = dirNode;
                    this.dirs.push(dirNode); // Add to specific array
                } else {
                    // Assign FileNode instance to FileNode_EXC_I
                    const fileNode = new FileNode(this.root, entry.name, this.storageService);
                    childNode = fileNode;
                    this.files.push(fileNode); // Add to specific array
                }
                this.addChild(childNode); // Add to general children array (calls setParent)
            }
        } catch (error) {
            console.error(`Error updating tree for ${dirPath}:`, error);
            this.children = [];
            this.files = [];
            this.dirs = [];
            // Rethrow or handle as appropriate
            throw new Error(`Failed to update tree for directory ${this.name}: ${error.message}`);
        }
    }

    // Use getName() for comparison
    notFileExist(self: DirectoryNode, file: { name: string }): boolean {
        // Use the filtered files array and getName()
        for (let fileNodeI of self.files) {
            if (fileNodeI.getName() === file.name) return false;
        }
        return true;
    }

    // Use getName() for comparison
    notDivExist(self: DirectoryNode, file: { name: string }): boolean {
        // Use the filtered dirs array and getName()
        for (let dirNodeI of self.dirs) {
            if (dirNodeI.getName() === file.name) return false;
        }
        return true;
    }
}

