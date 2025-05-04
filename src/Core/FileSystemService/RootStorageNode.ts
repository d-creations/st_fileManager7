import { StorageNode2 } from "./StorageNode2.js";


export class RootStorageNode extends StorageNode2 {

    path : string;
    parent : null;

    constructor(path, storageService) {
        super(null, path, storageService);
        this.path = path;
        this.parent = null;
    }
    getUrl() {
        return this.path;
    }
    getParent() {
        return null;
    }
    async updateStorage() {
        console.log("RootStorageNode updateStorage called - implement if needed");
        return Promise.resolve();
    }
}
