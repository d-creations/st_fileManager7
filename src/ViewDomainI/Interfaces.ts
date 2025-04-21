import { StorageDiv } from "../View/StorageDiv"

export interface StorageNode2_EXC_I {
    updateStorage(): Promise<void>
    getUrl(): any
    getName(): string
    delete(): Promise<void>
    renameFileOrFolder(storageNode2: StorageNode2_EXC_I, newName: String): Promise<boolean | unknown>
}

export interface FileNode_EXC_I extends StorageNode2_EXC_I {
    isDeleted(): boolean
    saveFile(text: string): Promise<void>
    getFileText(): Promise<String | unknown>
}

export interface DirectoryNode_EXC_I extends StorageNode2_EXC_I {
    getFiles(): FileNode_EXC_I[]
    getDirectories(): DirectoryNode_EXC_I[]
    updateTree(): Promise<void>
}

export interface EditorControlerAdapter_EXC_I {
    openFileByUrl(url: string): Promise<FileNode_EXC_I | unknown>
    getSettingFileNode(): FileNode_EXC_I
    copyStorage(node: StorageNode2_EXC_I): Promise<void>
    cutStorage(node: StorageNode2_EXC_I)
    insertStorage(rootDestination: StorageNode2_EXC_I): Promise<void>
    getStorageUrl(fileNode: StorageNode2_EXC_I)
    getStorageName(directoryNode: StorageNode2_EXC_I): string
    saveFile(fileNode: FileNode_EXC_I, text): void
    openDirectory(): Promise<DirectoryNode_EXC_I | unknown>
    openFile(): Promise<FileNode_EXC_I | unknown>
    getFileText(fileNode: FileNode_EXC_I): Promise<String | unknown>
    closeApplication(): void
    createFolder(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown>
    createFile(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown>
    deleteFileOrFolder(storageNode2: StorageNode2_EXC_I): Promise<void>
    renameFileOrFolder(storageNode2: StorageNode2_EXC_I, newName: String): Promise<boolean | unknown>
    undoFileOperation(): Promise<String | unknown>
    redoFileOperation(): Promise<String | unknown>
    moveFileOrFolder(source: StorageNode2_EXC_I | FileNode_EXC_I | unknown, destinationRoot: StorageNode2_EXC_I): Promise<void>
    getNCToolPath(NCcode: string): Promise<String | unknown>
}

export class EditorControlerAdapter_EXC_ERROR extends Error {
    constructor(msg: string) {
        super(msg)
    }
}

export class EditorControlerAdapter_EXC_TYPE_ERROR extends EditorControlerAdapter_EXC_ERROR {
    constructor(msg: string) {
        super(msg)
    }
}