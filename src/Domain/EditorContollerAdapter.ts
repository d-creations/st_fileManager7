import { DirectoryDiv } from "../View/DirectoryDiv.js";
import { DirectoryNode } from "./DirectoryNode.js";
import { FileNode } from "./FileNode.js";
import { StorageNode2 } from "./StorageNode2.js";




export class EditorControlerAdapter{
    getStorageUrl(fileNode: StorageNode2) {
        return fileNode.getUrl()
    }
    getStorageName(directoryNode: StorageNode2): string {
        return directoryNode.name
    }
    storageNode: StorageNode2;

    constructor(){        
    }
    saveFile(fileNode : FileNode,text): void {
        fileNode.saveFile(text)
    }

    async updateFileSystem(){
        this.storageNode.oberverUpdate()
    }

    openDirectory() {
        let ret = new Promise((resolve, reject) => {
            let retPromis = globalThis.electron.openFolder()
            console.log("return form "+ retPromis)
            let localfileManager = this
            retPromis.then(function(folderPath){

                let folderName = folderPath.split("\\").at(-1)
            
                if(folderPath.indexOf("\\") > 0){
                    folderPath = folderPath.substring(0,folderPath.lastIndexOf("\\"))
                }
                localfileManager.storageNode = new DirectoryNode(folderPath,folderName)
                localfileManager.storageNode.oberverUpdate()
                resolve(localfileManager.storageNode);
            })
        })
        return ret
    }

    getFileTree(directory : DirectoryNode){
        return {dirs: directory.dirs,files:directory.files}
    }

    async openFile() {
        console.log("openFile")
        let filePath : string = await globalThis.electron.openFile()
        let filename = filePath.split("\\").at(-1)
        if(filePath.indexOf("\\") > 0){
            filePath = filePath.substring(0,filePath.lastIndexOf("\\"))
        }
        let fileNode = new FileNode(filePath,filename)
        this.storageNode = fileNode
        return fileNode
    }


    getFilesInDirectory(directoryNode : DirectoryNode){
        return;
    }
    getFileText(fileNode : FileNode){
        return globalThis.electron.getFileText(fileNode.path+"\\"+fileNode.name)
    }
    closeApplication(){
        
    }
    createFolder(rootDirectory  : StorageNode2){
        let url = rootDirectory.getUrl()
        if(rootDirectory instanceof FileNode){
            url = rootDirectory.path
        }

        globalThis.electron.getFilesInFolder(url).then((files) =>{
            let newRootFileName = "TEST2"
            let newFileName = newRootFileName
            for(let i = 0;i<10;i++){
                if(!checkContains(files,(newFileName + ""))){
                    globalThis.electron.createFolder(url+"\\"+ newFileName)
                    break
                }
                newFileName = newRootFileName+String(i)
            }

        })
    }

    createFile(rootDirectory  : StorageNode2){
        let url = rootDirectory.getUrl()
        if(rootDirectory instanceof FileNode){
            url = rootDirectory.path
        }
        globalThis.electron.getFilesInFolder(url).then((files) =>{
            let newRootFileName = "new File"
            let newFileName = newRootFileName
            for(let i = 0;i<10;i++){
                if(!checkContains(files,(newFileName + ".txt"))){
                    globalThis.electron.saveFile(url+"\\"+ newFileName+".txt","")
                    break
                }
                newFileName = newRootFileName+String(i)
            }

        })
    }
    deleteFileOrFolder(storageNode2 : StorageNode2){
        globalThis.electron.deleteFileOrFolder(storageNode2.getUrl())
    }
    renameFileOrFolder(storageNode2: StorageNode2,newName : String){
        return globalThis.electron.renameFileOrFolder(storageNode2.getUrl(),storageNode2.path+"\\"+newName) 
    }
  
}

function checkContains(files: any, arg1: string) {
    for (var i = 0; i < files.length; i++) {
        if (files[i].name === arg1) {
            return true;
        }
    }
    return false;
}
