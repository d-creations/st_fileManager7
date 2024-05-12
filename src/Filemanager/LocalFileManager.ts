
import { TABpage, TabManager_I } from "../TabManager/TabManager.js";
import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js";
import { CanalAdapter } from "../tecnicalServices/canalAdapter.js";

import { FileNode } from "./FileNode.js";
import { FolderNode } from "./FolderNode.js";
import { StorageNode } from "./StorageNode.js";

export interface FileStream{
    openFileStream(FileNode)
    closeFileStream(FileNode)
    saveFileStream(FileNode,text:string)
}


export class LocalFileManager  implements FileManager_I,FileStream {


    private storageNode : StorageNode
    private bodyDiv : HTMLDivElement
    private tabManager : TabManager_I
    constructor(parentDiv : HTMLDivElement,tabManager : TabManager_I){
        
        this.tabManager = tabManager
        this.bodyDiv = document.createElement("div")
        parentDiv.appendChild(this.bodyDiv)

    }
    async openFileStream(fileNode: FileNode) {
        let text = await globalThis.electron.getFileText(fileNode.path+"\\"+fileNode.name)
        let div = document.createElement("div")
        let canal = new CanalAdapter(1,div,false,false)
        canal.text = text
        div.classList.add("fileEditor")
        this.tabManager.createTab(fileNode,new TABpage(div,canal))
    }
    closeFileStream(fileNode: FileNode) {
        throw new Error("Method not implemented.");
    }
    async saveFileStream(fileNode: FileNode,text : string) {
         await globalThis.electron.saveFile(fileNode.path+"\\"+fileNode.name,text)

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
        
        this.tabManager.closeAllTabs()
        let folderPath : string = await globalThis.electron.openFolder()
        let folderName = folderPath.split("\\").at(-1)
        
        if(folderPath.indexOf("\\") > 0){
            folderPath = folderPath.substring(0,folderPath.lastIndexOf("\\"))
        }
    
        this.storageNode = new FolderNode(folderPath,folderName,this)
        this.update()

    };

    
    
    public async saveCurrentFile () {
        this.tabManager.saveCurrentFile()
    }

    public async saveAllFile () {
        this.tabManager.saveAllFile()
    }
    public async openFile () {
        console.log("openFile")
        this.tabManager.closeAllTabs()
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