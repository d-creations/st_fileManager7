import { StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { Observable, ObservableI } from "../tecnicalServices/oberserver.js";
import { FileNode } from "./FileNode.js";

export abstract class StorageNode2 extends Observable implements ObservableI, StorageNode2_EXC_I {
    name: string;
    rootStorageNode: StorageNode2 | null;
    deleteState: boolean;

    constructor(rootStorageNode: StorageNode2 | null, name: string) {
        super();
        this.rootStorageNode = rootStorageNode;
        this.name = name;
        this.deleteState = false;
    }
    async updateStorage(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    oberverUpdate() {
        throw new Error("Method not implemented.");
    }

    setRoot(rootStorageNode: StorageNode2) {
        this.rootStorageNode = rootStorageNode;
    }

    setName(name: string) {
        this.name = name;
        this.observerUpdated();
    }

    getName() {
        return this.name;
    }

    delete() {
        this.deleteState = true;
        return globalThis.electron.deleteFileOrFolder(this.getUrl())
    }

    moveFileOrFolder(rootDestination : StorageNode2):Promise<void>{
        let source = this.getUrl()
        let dest = rootDestination.getUrl() + "\\" + this.getName()
        return globalThis.electron.moveFileOrFolder(source,dest)
    }
    
    copyStorage(source: StorageNode2): Promise<void> {
        let self = this;
        return new Promise<void>((resolve, reject) => {
            console.log("copy Storage");
            globalThis.electron.copyFolderOrFile(source.getUrl(), self.getUrl()+ "\\"  + source.name).then((state) => {
                if (source instanceof FileNode && state === false) {
                    let dest: string = self.getUrl() + "\\" +"copy" + source.name ;
                    console.log("file exist or error");
                    globalThis.electron.copyFolderOrFile(source.getUrl(), dest).then(() => {
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            }).catch((error) => {
                reject(error);
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

    protected createFolder(url: string): Promise< void> {
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
                        this.rootStorageNode?.observerUpdated();
                    });
                }
            }
            return Promise.reject(new Error("No valid name found")); // Reject with an error if no valid name is found
        });
    }

    renameFileOrFolder(storageNode2: StorageNode2, newName: String): Promise<boolean | unknown> {
        return new Promise((resolve, reject) => {
            globalThis.electron.renameFileOrFolder(storageNode2.getUrl(), `${storageNode2.rootStorageNode.getUrl()}\\${newName}`)
                .then((filePath) => {
                    const filename = filePath.split("\\").at(-1);
                    storageNode2.setName(filename || "");
                    storageNode2.observerUpdated();
                    resolve(true);
                })
                .catch(() => {
                    storageNode2.observerUpdated();
                    resolve(false);
                });
        });
    }
}

function checkContains(files: any, arg1: string) {
    return files.some((file: any) => file.name === arg1);
}
