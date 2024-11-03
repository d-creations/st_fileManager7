import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_ERROR, EditorControlerAdapter_EXC_I, EditorControlerAdapter_EXC_TYPE_ERROR, FileNode_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { DirectoryNode } from "./DirectoryNode.js";
import { FileNode } from "./FileNode.js";
import { StorageNode2 } from "./StorageNode2.js";
import { RootStorageNode } from "./RootStorageNode.js";
import { cpObject, cutObject, mvObject, objectManipulation } from "./CopyCut.js";

export class EditorControlerAdapter implements EditorControlerAdapter_EXC_I {
    storageNode: StorageNode2;
    clipboardStorage: objectManipulation;

    constructor() {}

    updateFileTree(directoryNode: DirectoryNode_EXC_I): Promise<void> {
        if (directoryNode instanceof DirectoryNode) return directoryNode.updateTree();
    }

    getSettingFileNode(): FileNode_EXC_I {
        return new FileNode(new RootStorageNode("resources"), "setting.json");
    }

    copyStorage(node: StorageNode2_EXC_I): void {
        if (node instanceof StorageNode2) {
            this.clipboardStorage = new cpObject(node);
        }
    }

    cutStorage(node: StorageNode2_EXC_I): void {
        if (node instanceof StorageNode2) {
            this.clipboardStorage = new cutObject(node);
        }
    }

    insertStorage(rootDestination: StorageNode2_EXC_I): void {
        if (rootDestination instanceof StorageNode2) {
            if (this.clipboardStorage.containsNode()) {
                this.clipboardStorage.insertStorage(rootDestination);
            }
        }
    }

    saveFile(fileNode: FileNode_EXC_I, text): void {
        if (fileNode instanceof FileNode) fileNode.saveFile(text);
        else throw new EditorControlerAdapter_EXC_ERROR("open File Error");
    }

    getStorageUrl(fileNode: StorageNode2_EXC_I) {
        if (fileNode instanceof StorageNode2) return fileNode.getUrl();
        else throw new EditorControlerAdapter_EXC_ERROR("open File Error");
    }

    getStorageName(directoryNode: StorageNode2_EXC_I): string {
        if (directoryNode instanceof StorageNode2) return directoryNode.name;
        else throw new EditorControlerAdapter_EXC_ERROR("open File Error");
    }

    openDirectory(): Promise<DirectoryNode_EXC_I | unknown> {
        let ret = new Promise((resolve, reject) => {
            let retPromis = globalThis.electron.openFolder();
            console.log("return form " + retPromis);
            let self = this;
            retPromis
                .then(function (folderPath) {
                    let folderName = folderPath.split("\\").at(-1);

                    if (folderPath.indexOf("\\") > 0) {
                        folderPath = folderPath.substring(0, folderPath.lastIndexOf("\\"));
                    }
                    let rootStorageNode = new RootStorageNode(folderPath);
                    self.storageNode = new DirectoryNode(rootStorageNode, folderName);
                    self.storageNode.oberverUpdate();
                    resolve(self.storageNode);
                })
                .catch(() => {
                    throw new EditorControlerAdapter_EXC_ERROR("open File Error");
                });
        });
        return ret;
    }

    getFileTree(directory: DirectoryNode_EXC_I): Promise<{ dirs: DirectoryNode_EXC_I[], files: FileNode_EXC_I[] }> {
        return new Promise((resolve, reject) => {
            if (directory instanceof DirectoryNode) {
                resolve({ dirs: directory.getDirectoryes(), files: directory.getFiles() });
            } else {
                reject(new EditorControlerAdapter_EXC_TYPE_ERROR("Not a DirectoryNode_EXC_I"));
            }
        });
    }

    openFile(): Promise<FileNode_EXC_I | unknown> {
        let self = this;
        let ret = new Promise((resolve, reject) => {
            console.log("openFile");
            globalThis.electron.openFile().then(function (filePath: string) {
                let filename = filePath.split("\\").at(-1);
                if (filePath.indexOf("\\") > 0) {
                    filePath = filePath.substring(0, filePath.lastIndexOf("\\"));
                }
                let rootStorageNode = new RootStorageNode(filePath);
                let fileNode = new FileNode(rootStorageNode, filename);
                self.storageNode = fileNode;
                resolve(fileNode);
            }).catch(() => {
                throw new EditorControlerAdapter_EXC_ERROR("open File Error");
            });
        });
        return ret;
    }

    getFileText(fileNode: FileNode_EXC_I): Promise<String | unknown> {
        if (fileNode instanceof FileNode) return globalThis.electron.getFileText(fileNode.getUrl());
        else throw new Error("Root Directory type unkown");
    }

    closeApplication() {
        globalThis.electron.closeApplication();
    }

    createFolder(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown> {
        if (rootDirectory instanceof StorageNode2) return rootDirectory.createNewFolder(rootDirectory);
        else throw new Error("Root Directory type unkown");
    }

    createFile(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown> {
        if (rootDirectory instanceof StorageNode2) return rootDirectory.createNewFile(rootDirectory);
        else throw new Error("Root Directory type unkown");
    }

    deleteFileOrFolder(storageNode2: StorageNode2_EXC_I) {
        if (storageNode2 instanceof StorageNode2) storageNode2.delete();
        else throw new EditorControlerAdapter_EXC_ERROR("open File Error");
    }

    renameFileOrFolder(storageNode2: StorageNode2_EXC_I, newName: String) {
        if (storageNode2 instanceof StorageNode2) return storageNode2.renameFileOrFolder(storageNode2, newName);
        else throw new Error("Root Directory type unkown");
    }
}
