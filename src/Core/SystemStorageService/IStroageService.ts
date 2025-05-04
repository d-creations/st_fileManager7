import { createDecorator } from "../../Utils/instantiation/ServiceCollection.js";


export const IStorageService = createDecorator<IStorageService>('IStorageService');

/**
 * Represents a directory entry returned by listDirectory.
 */
export interface DirectoryEntry {
    name: string;
    isDirectory: boolean;
    isFile: boolean; // Often useful to explicitly know if it's a file
    // Add other relevant properties like size, modified date if needed and available
}


/**
 * Interface defining the contract for file system operations.
 * This allows decoupling the domain logic from the specific implementation (e.g., Electron IPC).
 */
export interface IStorageService {
  getFilesInFolder: (filepath : string) =>
    [{name: string,
        isDirectory: boolean}];
  openFolder:  () => Promise<string | null>;
  openFile: () => Promise<string | null>;
  getFileText: (filepath : string) => Promise<string>;
  saveFile: (filepath : string,text : string)=> Promise<void>;
  closeApplication: () => void
  moveFileOrFolder: (oldfilepath  : string,newfilepath : string) => Promise<void>;
  copyFolderOrFile: (oldfilepath : string,newfilepath : string) =>  Promise<void>;
  createFolder: (filepath : string) => Promise<void>;
  deleteFileOrFolder:(filepath : string) => Promise<void>;
  renameFileOrFolder: (oldfilepath : string,newfilepath : string) => Promise<void>;
  getArgs: () => string[],
  undoFileOperation: () => Promise<void>;
  redoFileOperation: () => Promise<void>;
  getNCToolPath: (ncCode : string) => Promise<string>;
  getPathForFile: (files) => string
}

/**
 * Symbol used for dependency injection to identify the FileSystemService_I.
 */
