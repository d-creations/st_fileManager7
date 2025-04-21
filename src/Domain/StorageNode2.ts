import { StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { FileNode } from "./FileNode.js";
import { CustomEventEmitter } from '../tecnicalServices/CustomEventEmitter.js';

export abstract class StorageNode2 extends CustomEventEmitter implements StorageNode2_EXC_I {
    name: string;
    rootStorageNode: StorageNode2 | null;
    deleteState: boolean;

    constructor(rootStorageNode: StorageNode2 | null, name: string) {
        super(); // Call CustomEventEmitter constructor
        this.rootStorageNode = rootStorageNode;
        this.name = name;
        this.deleteState = false;
    }
    async updateStorage(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    setRoot(rootStorageNode: StorageNode2) {
        this.rootStorageNode = rootStorageNode;
    }

    setName(name: string) {
        const oldName = this.name;
        this.name = name;
    }

    getName() {
        return this.name;
    }

    delete(): Promise<void> {
        this.deleteState = true;
        return globalThis.electron.deleteFileOrFolder(this.getUrl()).then(() => {
            this.rootStorageNode?.emit('child-removed', this);
        });
    }

    moveFileOrFolder(rootDestination: StorageNode2): Promise<void> {
        let source = this.getUrl();
        let dest = rootDestination.getUrl() + "\\" + this.getName();
        const oldParent = this.rootStorageNode;
        return globalThis.electron.moveFileOrFolder(source, dest).then(() => {
            oldParent?.emit('child-removed', this);
            this.rootStorageNode = rootDestination;
            rootDestination.emit('child-added', this);
        });
    }

    copyStorage(source: StorageNode2): Promise<void> {
        let self = this;
        return new Promise<void>((resolve, reject) => {
            console.log("copy Storage");
            const destinationUrl = self.getUrl() + "\\" + source.name;
            globalThis.electron.copyFolderOrFile(source.getUrl(), destinationUrl).then((state) => {
                self.emit('child-added', { name: source.name });
                resolve();
            }).catch((error) => {
                if (source instanceof FileNode) {
                    let dest: string = self.getUrl() + "\\" + "copy" + source.name;
                    console.log("file exist or error, copying with new name");
                    globalThis.electron.copyFolderOrFile(source.getUrl(), dest).then(() => {
                        self.emit('child-added', { name: "copy" + source.name });
                        resolve();
                    }).catch((copyError) => {
                        reject(copyError);
                    });
                } else {
                    reject(error);
                }
            });
        });
    }

    getUrl(): any {
        return `${this.rootStorageNode.getUrl()}\\${this.name}`;
    }

    public createNewFolder(rootDirectory: StorageNode2): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public createNewFile(rootDirectory: StorageNode2): Promise<void> {
        throw new Error("Method not implemented.");
    }

    protected createFolder(url: string): Promise<void> {
        return this.createEntity(url, "TEST2", (newFileName) =>
            globalThis.electron.createFolder(`${url}\\${newFileName}`)
        );
    }

    protected createFile(url: string): Promise<void> {
        return this.createEntity(url, "new File", (newFileName) =>
            globalThis.electron.saveFile(`${url}\\${newFileName}.txt`, "")
        );
    }

    private createEntity(
        url: string,
        baseName: string,
        createMethod: (newFileName: string) => Promise<void>
    ): Promise<void> {
        return globalThis.electron.getFilesInFolder(url).then((files) => {
            for (let i = 0; i < 10; i++) {
                const newFileName = i === 0 ? baseName : `${baseName}${i}`;
                if (!checkContains(files, newFileName)) {
                    return createMethod(newFileName).then(() => {
                        this.emit('child-added', { name: newFileName, type: baseName === "TEST2" ? 'directory' : 'file' });
                    });
                }
            }
            return Promise.reject(new Error("No valid name found"));
        });
    }

    renameFileOrFolder(storageNode2: StorageNode2, newName: string): Promise<boolean | unknown> {
        return new Promise((resolve, reject) => {
            globalThis.electron.renameFileOrFolder(storageNode2.getUrl(), `${storageNode2.rootStorageNode.getUrl()}\\${newName}`)
                .then((filePath) => {
                    const filename = filePath.split("\\").at(-1);
                    const oldName = storageNode2.name;
                    storageNode2.setName(filename || "");
                    resolve(true);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }
}

function checkContains(files: any, arg1: string) {
    return files.some((file: any) => file.name === arg1);
}
