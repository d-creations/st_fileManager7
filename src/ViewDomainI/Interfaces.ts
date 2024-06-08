import { Observable, ObservableI, Observer } from "../tecnicalServices/oberserver"

export interface StorageNode2_EXC_I {
    addObserver( observer : Observer)
     
    observerUpdated()

}
export interface FileNode_EXC_I {
    addObserver( observer : Observer)
     
    observerUpdated()

}


export interface DirectoryNode_EXC_I {
    addObserver( observer : Observer)
     
    observerUpdated()

}


export interface EditorControlerAdapter_EXC_I{
    getStorageUrl(fileNode: StorageNode2_EXC_I)
    getStorageName(directoryNode: StorageNode2_EXC_I): string
    saveFile(fileNode : FileNode_EXC_I,text): void 

    updateFileSystem():Promise<unknown>

    openDirectory()  :Promise<DirectoryNode_EXC_I | unknown>

    getFileTree(directory : DirectoryNode_EXC_I)

    openFile():Promise<FileNode_EXC_I | unknown>

    getFilesInDirectory(directoryNode : DirectoryNode_EXC_I)

    getFileText(fileNode : FileNode_EXC_I)
    closeApplication()
    
    createFolder(rootDirectory  : StorageNode2_EXC_I):Promise<unknown>

    createFile(rootDirectory  : StorageNode2_EXC_I):Promise<boolean | unknown>
    deleteFileOrFolder(storageNode2 : StorageNode2_EXC_I):Promise<boolean | unknown>
    
    renameFileOrFolder(storageNode2: StorageNode2_EXC_I,newName : String):Promise<boolean | unknown>


}

