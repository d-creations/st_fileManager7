
import { TabManager_I } from "../TabManager/TabManager.js";
import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js";

import { FileNode } from "./FileNode.js";
import { FolderNode } from "./FolderNode.js";
import { StorageNode } from "./StorageNode.js";

export interface FileStream{
    openFileStream(FileNode)
    closeFileStream(FileNode)
    saveFileStream(FileNode)
}


export class LocalFileManager  implements FileManager_I,FileStream {


    private storageNode : StorageNode
    private bodyDiv : HTMLDivElement
    private tabManager : TabManager_I
    constructor(parentDiv : HTMLDivElement,tabManager : TabManager_I){
        
        this.tabManager = tabManager
        let openFileButton = ViewObjectCreator.createButton("FILE")
        parentDiv.appendChild(openFileButton);
        let fileManager = this
        openFileButton.addEventListener('click', function(e) {
            fileManager.openFile()
        })

        let openDirButton = ViewObjectCreator.createButton("FOLDER")
        parentDiv.appendChild(openDirButton);
        openDirButton.addEventListener('click', function(e) {
            fileManager.openFolder()
        })

        this.bodyDiv = document.createElement("div")
        parentDiv.appendChild(this.bodyDiv)

    }
    async openFileStream(fileNode: FileNode) {
        let text = await globalThis.electron.getFileText(fileNode.path+"\\"+fileNode.name)
        let div = document.createElement("div")
        div.innerText = text
        div.classList.add("fileEditor")
        this.tabManager.createTab(fileNode,div)
    }
    closeFileStream(fileNode: FileNode) {
        throw new Error("Method not implemented.");
    }
    saveFileStream(fileNode: FileNode) {
        throw new Error("Method not implemented.");
    }
    
    public async update() {
        await this.storageNode.update()
        this.createView()
    }

    createView(){
        while (this.bodyDiv instanceof HTMLDivElement && this.bodyDiv.firstChild) {
            this.bodyDiv.removeChild(this.bodyDiv.firstChild);
        }
        this.storageNode.createDivs(this.bodyDiv,0)
    }

    
    public async openFolder () {
        console.log("openFolder")
        let folderPath : string = await globalThis.electron.openFolder()
        let folderName = folderPath.split("\\").at(-1)
        
        if(folderPath.indexOf("\\") > 0){
            folderPath = folderPath.substring(0,folderPath.lastIndexOf("\\"))
        }
    
        this.storageNode = new FolderNode(folderPath,folderName,this)
        this.update()

    };

    public async openFile () {
        console.log("openFile")
        let filePath : string = await globalThis.electron.openFile()
        let filename = filePath.split("\\").at(-1)
        if(filePath.indexOf("\\") > 0){
            filePath = filePath.substring(0,filePath.lastIndexOf("\\"))
        }
        let fileNode = new FileNode(filePath,filename,this)
        this.storageNode = fileNode
        this.update()
        this.openFileStream(fileNode)
    };


}