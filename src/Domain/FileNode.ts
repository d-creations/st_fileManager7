import { FileNode_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { StorageNode2 } from "./StorageNode2.js";


export class FileNode extends StorageNode2 implements FileNode_EXC_I{
    saveFile(text: any) {
        globalThis.electron.saveFile(this.getUrl(),text)
    }


    isDeleted(){
        return this.deleteState
    }
    createNewFolder(rootDirectory  : FileNode) :Promise<boolean | unknown>{
        let url = rootDirectory.rootStorageNode.getUrl()
        return this.createFolder(url)
    }

    copyStorage(source: StorageNode2) {
        this.rootStorageNode.copyStorage(source)
    }

    createNewFile(rootDirectory: StorageNode2) :Promise<boolean | unknown> {
        let url = rootDirectory.rootStorageNode.getUrl()
        return this.createFile(url)
    }

    constructor(path : StorageNode2, name : string){
        super(path,name)
    }
}