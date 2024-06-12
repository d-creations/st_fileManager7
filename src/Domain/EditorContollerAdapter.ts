import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_I, FileNode_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { DirectoryNode } from "./DirectoryNode.js";
import { FileNode } from "./FileNode.js";
import { StorageNode2 } from "./StorageNode2.js";
import { RootStorageNode } from "./RootStorageNode.js";




export class EditorControlerAdapter implements EditorControlerAdapter_EXC_I{
    getStorageUrl(fileNode: StorageNode2_EXC_I) {
        if(fileNode instanceof StorageNode2)return fileNode.getUrl()
    }
    getStorageName(directoryNode: StorageNode2_EXC_I): string {
        if(directoryNode instanceof StorageNode2)return directoryNode.name
    }
    storageNode: StorageNode2;

    constructor(){        
    }
    saveFile(fileNode : FileNode_EXC_I,text): void {
        if(fileNode instanceof FileNode)fileNode.saveFile(text)
    }

    updateFileSystem(){
        console.log("update FS")
        let ret = new Promise((resolve, reject)=>{
        this.storageNode.oberverUpdate().then(
            function(){
                resolve(true)
            })
        })
        return ret
    }

    openDirectory():Promise<DirectoryNode_EXC_I | unknown> {
        let ret = new Promise((resolve, reject) => {
            let retPromis = globalThis.electron.openFolder()
            console.log("return form "+ retPromis)
            let localfileManager = this
            retPromis.then(function(folderPath){

                let folderName = folderPath.split("\\").at(-1)
            
                if(folderPath.indexOf("\\") > 0){
                    folderPath = folderPath.substring(0,folderPath.lastIndexOf("\\"))
                }
                let rootStorageNode = new RootStorageNode(folderPath)
                localfileManager.storageNode = new DirectoryNode(rootStorageNode,folderName)
                localfileManager.storageNode.oberverUpdate()
                resolve(localfileManager.storageNode);
            })
        })
        return ret
    }


    getFileTree(directory : DirectoryNode_EXC_I){
        if(directory instanceof DirectoryNode)return {dirs: directory.dirs,files:directory.files}
    }

    openFile() :Promise<FileNode_EXC_I | unknown>{        
        let ret = new Promise((resolve, reject) => {
            console.log("openFile")
            globalThis.electron.openFile().then(
                function(filePath : string){
                    let filename = filePath.split("\\").at(-1)
                    if(filePath.indexOf("\\") > 0){
                        filePath = filePath.substring(0,filePath.lastIndexOf("\\"))
                    }
                    
                    let rootStorageNode = new RootStorageNode(filePath)
                    let fileNode = new FileNode(rootStorageNode,filename)
                    this.storageNode = fileNode
                    resolve(fileNode);
                }
            )
        })
        return ret
    }


    getFilesInDirectory(directoryNode : DirectoryNode_EXC_I){
        return;
    }
    getFileText(fileNode : FileNode_EXC_I){
        if(fileNode instanceof FileNode)return globalThis.electron.getFileText(fileNode.getUrl())
    }
    closeApplication(){
        
    }
    createFolder(rootDirectory  : StorageNode2_EXC_I) :Promise<boolean | unknown>{
            if(rootDirectory instanceof StorageNode2){
                return rootDirectory.createNewFolder(rootDirectory)
            }else{
                throw new Error("Root Directory type unkown")
            } 
    }

    createFile(rootDirectory  : StorageNode2_EXC_I) :Promise<boolean | unknown>{
        if(rootDirectory instanceof StorageNode2){
            return rootDirectory.createNewFile(rootDirectory)
        }else{
            throw new Error("Root Directory type unkown")
        } 
}
    deleteFileOrFolder(storageNode2 : StorageNode2_EXC_I):Promise<boolean | unknown>{
        let ret = new Promise((resolve, reject) => {
            if(storageNode2 instanceof StorageNode2)globalThis.electron.deleteFileOrFolder(storageNode2.getUrl())
        })
        return ret
    }
    renameFileOrFolder(storageNode2: StorageNode2_EXC_I,newName : String):Promise<boolean | unknown>{
        if(storageNode2 instanceof StorageNode2){
            return storageNode2.renameFileOrFolder(storageNode2,newName)
        }else{
            throw new Error("Root Directory type unkown")
        } 
    }
}
