import { FileNode_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { StorageNode2 } from "./StorageNode2.js";

export class FileNode extends StorageNode2 implements FileNode_EXC_I {
    saveFile(text: string): Promise<void> {
        return globalThis.electron.saveFile(this.getUrl(), text).then(() => {
            this.emit('saved');
        });
    }

    getFileText(): Promise<String> {
        return globalThis.electron.getFileText(this.getUrl());
    }

    isDeleted() {
        return this.deleteState;
    }

    createNewFolder(rootDirectory: FileNode): Promise<void> {
        let url = rootDirectory.rootStorageNode.getUrl();
        return this.createFolder(url);
    }

    copyStorage(source: StorageNode2) {
        return this.rootStorageNode.copyStorage(source);
    }

    createNewFile(rootDirectory: StorageNode2): Promise<void> {
        let url = rootDirectory.rootStorageNode.getUrl();
        return this.createFile(url);
    }

    constructor(path: StorageNode2, name: string) {
        super(path, name);
    }
}