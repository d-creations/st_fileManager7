import { createDecorator } from "../tecnicalServices/instantiation/ServiceCollection.js";
import { CustomEventEmitter } from "../tecnicalServices/CustomEventEmitter.js"; // Changed from CustomEventEmitter_I
import { ApplciationIndex } from "../View/TabManager/TabApplication.js";

export interface StorageNode2_EXC_I extends CustomEventEmitter {
    updateStorage(): Promise<void>;
    getUrl(): any;
    getName(): string;
    delete(): Promise<void>;

    /**
     * Renames the file or folder in the filesystem and updates the node's name.
     * @param newName The new name for the node (not the full path).
     * @returns Promise resolving to boolean success or unknown based on the underlying service.
     */
    renameFileOrFolder(newName: string): Promise<boolean | unknown>;

    /**
     * Adds a child node to this node's children array.
     * @param node The child node to add.
     */
    addChild(node: StorageNode2_EXC_I): void;

    /**
     * Removes a child node from this node's children array.
     * @param node The child node to remove.
     */
    removeChild(node: StorageNode2_EXC_I): void;

    /**
     * Gets the parent node of this node.
     * @returns The parent node or null if it's a root node.
     */
    getParent(): StorageNode2_EXC_I | null;
}

export interface FileNode_EXC_I extends StorageNode2_EXC_I {
    isDeleted(): boolean; // Add isDeleted method signature
    saveFile(text: string): Promise<void>;
    getFileText(): Promise<string>; // Correct return type to Promise<string>
    getUrl(): string;
    getName(): string;
    openEditingState(): void;
    closeEditingState(): void;
    openFile(): void;
    saveText(text : string)
}

export interface DirectoryNode_EXC_I extends StorageNode2_EXC_I {
    getFiles(): FileNode_EXC_I[];
    getDirectories(): DirectoryNode_EXC_I[];
    updateTree(): Promise<void>;
}

export interface RootStorageNode_EXC_I extends StorageNode2_EXC_I {
    /**
     * Emits an event with the specified name and arguments.
     * @param event The name of the event to emit.
     * @param args The arguments to pass with the event.
     */
    emit(event: string, ...args: any[]): void;
}

export const IFileSystemService = createDecorator<IFileSystemService>('IFileSystemService');

export interface IFileSystemService {
    openFilewithApp(fileNode: FileNode_EXC_I): unknown;
    openFileByUrl(url: string): Promise<FileNode_EXC_I | unknown>;
    getSettingFileNode(): FileNode_EXC_I;
    copyStorage(node: StorageNode2_EXC_I): Promise<void>;
    cutStorage(node: StorageNode2_EXC_I);
    insertStorage(rootDestination: StorageNode2_EXC_I): Promise<void>;
    getStorageUrl(fileNode: StorageNode2_EXC_I);
    getStorageName(directoryNode: StorageNode2_EXC_I): string;
    saveFile(fileNode: FileNode_EXC_I, text): void;
    openDirectory(): Promise<DirectoryNode_EXC_I | unknown>;
    openFile(): Promise<FileNode_EXC_I | unknown>;
    openFileInApp(fileNode: FileNode_EXC_I): void;

    /**
     * Gets the text content of a specified file node.
     * @param fileNode The file node to read.
     * @returns A promise resolving to the file content as a string.
     */
    getFileText(fileNode: FileNode_EXC_I): Promise<string>; // Changed String to string

    closeApplication(): void;
    createFolder(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown>;
    createFile(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown>;
    deleteFileOrFolder(storageNode2: StorageNode2_EXC_I): Promise<void>;
    renameFileOrFolder(storageNode2: StorageNode2_EXC_I, newName: String): Promise<boolean | unknown>;
    undoFileOperation(): Promise<String | unknown>;
    redoFileOperation(): Promise<String | unknown>;
    moveFileOrFolder(source: StorageNode2_EXC_I | FileNode_EXC_I | unknown, destinationRoot: StorageNode2_EXC_I): Promise<void>;
    getNCToolPath(NCcode: string): Promise<String | unknown>;
}

export class EditorControlerAdapter_EXC_ERROR extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class EditorControlerAdapter_EXC_TYPE_ERROR extends EditorControlerAdapter_EXC_ERROR {
    constructor(msg: string) {
        super(msg);
    }
}