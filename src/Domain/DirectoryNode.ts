import { DirectoryNode_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces.js";
import { FileNode } from "./FileNode.js";
import { StorageNode2 } from "./StorageNode2.js";
// EventEmitter is inherited from StorageNode2

export class DirectoryNode extends StorageNode2 implements DirectoryNode_EXC_I {
    public files: FileNode[];
    public dirs: DirectoryNode[];
    private isUpdating: boolean = false;

    constructor(rootNode: StorageNode2, name: string) {
        super(rootNode, name);
        this.files = [];
        this.dirs = [];
    }

    getName(): string {
        return this.name;
    }

    createNewFolder(rootDirectory: StorageNode2): Promise<void> {
        let self = this;
        return new Promise((resolve, reject) => {
            let url = rootDirectory.getUrl();
            self.createFolder(url).then(() => {
                resolve();
            }).catch(reject);
        });
    }

    createNewFile(rootDirectory: StorageNode2): Promise<void> {
        let self = this;
        return new Promise((resolve, reject) => {
            let url = rootDirectory.getUrl();
            self.createFile(url).then(() => {
                resolve();
            }).catch(reject);
        });
    }

    getFiles(): FileNode_EXC_I[] {
        return this.files;
    }

    getDirectories(): DirectoryNode_EXC_I[] {
        return this.dirs;
    }

    updateStorage(): Promise<void> {
        return this.updateTree();
    }

    updateTree(): Promise<void> {
        if (this.isUpdating) return Promise.resolve();
        this.isUpdating = true;
        let self = this;
        console.log("update Tree " + self.name);
        return new Promise((resolve, reject) => {
            globalThis.electron.getFilesInFolder(this.getUrl()).then(function (files) {
                let objectNames: Set<string> = new Set();
                let addedFiles: FileNode[] = [];
                let addedDirs: DirectoryNode[] = [];
                let removedFiles: FileNode[] = [];
                let removedDirs: DirectoryNode[] = [];

                for (let file of files) {
                    objectNames.add(file.name);
                    if (file.type == "file") {
                        if (self.notFileExist(self, file)) {
                            let fileNode = new FileNode(self, file.name);
                            self.files.push(fileNode);
                            addedFiles.push(fileNode);
                        }
                    }
                    if (file.type == "directory") {
                        if (self.notDivExist(self, file)) {
                            let directory = new DirectoryNode(self, file.name);
                            self.dirs.push(directory);
                            addedDirs.push(directory);
                        }
                    }
                }

                self.files = self.files.filter(file => {
                    if (objectNames.has(file.name)) {
                        return true;
                    } else {
                        removedFiles.push(file);
                        return false;
                    }
                });
                self.dirs = self.dirs.filter(dir => {
                    if (objectNames.has(dir.name)) {
                        return true;
                    } else {
                        removedDirs.push(dir);
                        return false;
                    }
                });

                console.log("TreeStack Updated");
                self.emit('updated', { addedFiles, addedDirs, removedFiles, removedDirs });
                resolve();
            }).catch((error) => {
                self.isUpdating = false;
                self.emit('update-failed', error);
                reject(error);
            }).finally(() => {
                self.isUpdating = false;
            });
        });
    }

    notFileExist(self: DirectoryNode, file: any): boolean {
        for (let fileNodeI of self.files) {
            if (fileNodeI.name === file.name) return false;
        }
        return true;
    }

    notDivExist(self: DirectoryNode, file: any): boolean {
        for (let fileNodeI of self.dirs) {
            if (fileNodeI.name === file.name) return false;
        }
        return true;
    }
}

