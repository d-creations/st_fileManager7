import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_ERROR, EditorControlerAdapter_EXC_I, EditorControlerAdapter_EXC_TYPE_ERROR, FileNode_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { DirectoryNode } from "./DirectoryNode.js";
import { FileNode } from "./FileNode.js";
import { StorageNode2 } from "./StorageNode2.js";
import { RootStorageNode } from "./RootStorageNode.js";
import { cpObject, cutObject, mvObject, objectManipulation } from "./CopyCut.js";

export class EditorControlerAdapter implements EditorControlerAdapter_EXC_I {
    clipboardStorage: objectManipulation;

    constructor() {}

    undoFileOperation(): Promise<String | unknown> {
        return globalThis.electron.undoFileOperation();
    }

    redoFileOperation(): Promise<String | unknown> {
        return globalThis.electron.redoFileOperation();
    }

    getNCToolPath(NCcode: string): Promise<String | unknown> {
        return globalThis.electron.getNCToolPath();
    }

    moveFileOrFolder(source: StorageNode2_EXC_I, rootDestination: StorageNode2_EXC_I): Promise<void> {
        if (source instanceof StorageNode2 && rootDestination instanceof StorageNode2) {
            return source.moveFileOrFolder(rootDestination);
        } else {
            throw new EditorControlerAdapter_EXC_TYPE_ERROR("Move requires StorageNode2 instances");
        }
    }

    getSettingFileNode(): FileNode_EXC_I {
        return new FileNode(new RootStorageNode("resources"), "setting.json");
    }

    copyStorage(node: StorageNode2_EXC_I): Promise<void> {
        if (node instanceof StorageNode2) {
            this.clipboardStorage = new cpObject(node);
            return Promise.resolve();
        } else {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("Copy requires a StorageNode2 instance"));
        }
    }

    cutStorage(node: StorageNode2_EXC_I): void {
        if (node instanceof StorageNode2) {
            this.clipboardStorage = new cutObject(node);
        } else {
            throw new EditorControlerAdapter_EXC_TYPE_ERROR("Cut requires a StorageNode2 instance");
        }
    }

    insertStorage(rootDestination: StorageNode2_EXC_I): Promise<void> {
        if (!(rootDestination instanceof StorageNode2)) {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("Insert destination must be a StorageNode2"));
        }
        if (!this.clipboardStorage || !this.clipboardStorage.containsNode()) {
            return Promise.reject(new Error("Clipboard is empty or invalid"));
        }
        return this.clipboardStorage.insertStorage(rootDestination);
    }

    saveFile(fileNode: FileNode_EXC_I, text): void {
        if (fileNode instanceof FileNode) {
            fileNode.saveFile(text);
        } else {
            throw new EditorControlerAdapter_EXC_TYPE_ERROR("saveFile requires a FileNode instance");
        }
    }

    getStorageUrl(node: StorageNode2_EXC_I) {
        if (node instanceof StorageNode2) return node.getUrl();
        else throw new EditorControlerAdapter_EXC_TYPE_ERROR("getStorageUrl requires a StorageNode2 instance");
    }

    getStorageName(node: StorageNode2_EXC_I): string {
        if (node instanceof StorageNode2) return node.getName();
        else throw new EditorControlerAdapter_EXC_TYPE_ERROR("getStorageName requires a StorageNode2 instance");
    }

    openDirectory(): Promise<DirectoryNode_EXC_I | unknown> {
        return new Promise((resolve, reject) => {
            globalThis.electron.openFolder()
                .then((folderPath) => {
                    if (!folderPath) {
                        reject(new Error("Folder selection cancelled"));
                        return;
                    }
                    let folderName = folderPath.split("\\").pop() || "";
                    let parentPath = folderPath.substring(0, folderPath.lastIndexOf("\\"));

                    let rootStorageNode = new RootStorageNode(parentPath);
                    let directoryNode = new DirectoryNode(rootStorageNode, folderName);

                    directoryNode.updateTree().then(() => {
                        resolve(directoryNode);
                    }).catch(reject);
                })
                .catch((err) => {
                    console.error("Error opening directory:", err);
                    reject(new EditorControlerAdapter_EXC_ERROR("Failed to open directory"));
                });
        });
    }

    openFile(): Promise<FileNode_EXC_I | unknown> {
        return new Promise((resolve, reject) => {
            console.log("openFile triggered");
            globalThis.electron.openFile().then((filepath) => {
                if (!filepath) {
                    reject(new Error("File selection cancelled"));
                    return;
                }
                this.openFileByUrl(filepath).then((fileNode) => {
                    resolve(fileNode);
                }).catch(reject);
            }).catch((err) => {
                console.error("Error opening file dialog:", err);
                reject(new EditorControlerAdapter_EXC_ERROR("Failed to open file dialog"));
            });
        });
    }

    public openFileByUrl(url: string): Promise<FileNode_EXC_I | unknown> {
        return new Promise((resolve, reject) => {
            try {
                let filename = url.split("\\").pop() || "";
                let parentPath = url.substring(0, url.lastIndexOf("\\"));
                let rootStorageNode = new RootStorageNode(parentPath);
                let fileNode = new FileNode(rootStorageNode, filename);
                resolve(fileNode);
            } catch (error) {
                console.error("Error creating FileNode from URL:", error);
                reject(new EditorControlerAdapter_EXC_ERROR("Failed to process file URL"));
            }
        });
    }

    getFileText(fileNode: FileNode_EXC_I): Promise<String> {
        if (fileNode instanceof FileNode) return fileNode.getFileText();
        else throw new EditorControlerAdapter_EXC_TYPE_ERROR("getFileText requires a FileNode instance");
    }

    closeApplication() {
        globalThis.electron.closeApplication();
    }

    createFolder(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown> {
        if (rootDirectory instanceof StorageNode2) return rootDirectory.createNewFolder(rootDirectory);
        else throw new EditorControlerAdapter_EXC_TYPE_ERROR("createFolder requires a StorageNode2 instance");
    }

    createFile(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown> {
        if (rootDirectory instanceof StorageNode2) return rootDirectory.createNewFile(rootDirectory);
        else throw new EditorControlerAdapter_EXC_TYPE_ERROR("createFile requires a StorageNode2 instance");
    }

    deleteFileOrFolder(storageNode2: StorageNode2_EXC_I): Promise<void> {
        if (storageNode2 instanceof StorageNode2) return storageNode2.delete();
        else throw new EditorControlerAdapter_EXC_TYPE_ERROR("deleteFileOrFolder requires a StorageNode2 instance");
    }

    renameFileOrFolder(storageNode2: StorageNode2_EXC_I, newName: string): Promise<boolean | unknown> {
        if (storageNode2 instanceof StorageNode2) return storageNode2.renameFileOrFolder(storageNode2, newName);
        else throw new EditorControlerAdapter_EXC_TYPE_ERROR("renameFileOrFolder requires a StorageNode2 instance");
    }
}
