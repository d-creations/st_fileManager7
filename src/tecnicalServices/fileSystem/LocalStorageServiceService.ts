
// Define the expected structure of the electron API exposed on the global object (window).

import { IStorageService } from "./IStroageService"


/**
 * Implementation of FileSystemService_I using Electron's IPC mechanism (via globalThis.electron).
 */
export class LocalStorageService implements IStorageService {

    getFilesInFolder(filepath: string){
        return globalThis.electron.getFilesInFolder(filepath)
    }
    openFolder(){
        return globalThis.electron.openFolder() 
     }
    openFile(){
        return globalThis.electron.openFile()
    }
    getFileText(filepath: string){
        return globalThis.electron.getFileText(filepath)
    }
    saveFile(filepath: string, text: string){
        return globalThis.electron.saveFile(filepath, text)
    }
    closeApplication(){
        return globalThis.electron.closeApplication()
    }
    moveFileOrFolder(oldfilepath: string, newfilepath: string){
        return globalThis.electron.moveFileOrFolder(oldfilepath, newfilepath)
    }
    copyFolderOrFile(oldfilepath: string, newfilepath: string){
        return globalThis.electron.copyFolderOrFile(oldfilepath, newfilepath)
    }
    createFolder(filepath: string){
        return globalThis.electron.createFolder(filepath)
    }
    deleteFileOrFolder(filepath: string){
        return globalThis.electron.deleteFileOrFolder(filepath)
    }
    renameFileOrFolder(oldfilepath: string, newfilepath: string){
        return globalThis.electron.renameFileOrFolder(oldfilepath, newfilepath)
    }
    getArgs(){
        return globalThis.electron.getArgs()
    }
    undoFileOperation(){
        return globalThis.electron.undoFileOperation()
    }
    redoFileOperation(){    
        return globalThis.electron.redoFileOperation()
    }
    getNCToolPath(ncCode: string){
        return globalThis.electron.getNCToolPath(ncCode)
    }
    getPathForFile(files: any){
        return globalThis.electron.getPathForFile(files)
    }
    
}