import { StorageDiv } from "../View/StorageDiv"
import { Observable, ObservableI, Observer } from "../tecnicalServices/oberserver"

export interface StorageNode2_EXC_I {
    addObserver( observer : Observer)
     
    observerUpdated()

}
export interface FileNode_EXC_I extends StorageNode2_EXC_I{
    isDeleted(): boolean
}


export interface DirectoryNode_EXC_I extends StorageNode2_EXC_I {}


export interface EditorControlerAdapter_EXC_I{
    getSettingFileNode(): FileNode_EXC_I
    copyStorage(node: StorageNode2_EXC_I): void
    cutStorage(node: StorageNode2_EXC_I): void
    insertStorage(rootDestination : StorageNode2_EXC_I): void
    getStorageUrl(fileNode: StorageNode2_EXC_I)
    getStorageName(directoryNode: StorageNode2_EXC_I): string
    saveFile(fileNode : FileNode_EXC_I,text): void 
    openDirectory()  :Promise<DirectoryNode_EXC_I | unknown>
    openFile():Promise<FileNode_EXC_I | unknown>
    getFileTree(directory : DirectoryNode_EXC_I):{dirs:DirectoryNode_EXC_I[],files:FileNode_EXC_I[]}
    getFileText(fileNode : FileNode_EXC_I):Promise<String |unknown>
    closeApplication():void
    createFolder(rootDirectory  : StorageNode2_EXC_I):void
    createFile(rootDirectory  : StorageNode2_EXC_I):void
    deleteFileOrFolder(storageNode2 : StorageNode2_EXC_I):void
    renameFileOrFolder(storageNode2: StorageNode2_EXC_I,newName : String):void


}


export class EditorControlerAdapter_EXC_ERROR extends Error{
    constructor(msg : string){
        super(msg)
    }
}

export class EditorControlerAdapter_EXC_TYPE_ERROR extends EditorControlerAdapter_EXC_ERROR{
    constructor(msg : string){
        super(msg)
    }
}