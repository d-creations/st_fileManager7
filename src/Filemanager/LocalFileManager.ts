
import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js";
import { Observable, Observer } from "../tecnicalServices/oberserver.js";
import { FileNode } from "./FileNode.js";
import { FolderNode } from "./FolderNode.js";
import { StorageNode } from "./StorageNode.js";




export class LocalFileManager  implements FileManager_I {

    static stateChange = new Observable()
    static storageNode : StorageNode
    bodyDiv : HTMLDivElement
    constructor(parentDiv : HTMLDivElement){
        let openFileButton = ViewObjectCreator.createButton("FILE")
        parentDiv.appendChild(openFileButton);
        openFileButton.addEventListener('click', function(e) {
            LocalFileManager.openFile()
        })

        let openDirButton = ViewObjectCreator.createButton("FOLDER")
        parentDiv.appendChild(openDirButton);
        openDirButton.addEventListener('click', function(e) {
            LocalFileManager.openFolder()
        })

        this.bodyDiv = document.createElement("div")
        parentDiv.appendChild(this.bodyDiv)

        LocalFileManager.stateChange.addObserver(this)
    }
    async oberverUpdate() {
        await LocalFileManager.storageNode.update()
        this.createView()
    }

    createView(){
        while (this.bodyDiv instanceof HTMLDivElement && this.bodyDiv.firstChild) {
            this.bodyDiv.removeChild(this.bodyDiv.firstChild);
        }
        LocalFileManager.storageNode.createDivs(this.bodyDiv,0)
    }

    
    static async openFolder () {
        console.log("openFolder")
        let folderPath : string = await globalThis.electron.openFolder()
        let folderName = folderPath.split("\\").at(-1)
        
        if(folderPath.indexOf("\\") > 0){
            folderPath = folderPath.substring(0,folderPath.lastIndexOf("\\"))
        }
    
        LocalFileManager.storageNode = new FolderNode(folderPath,folderName)
        LocalFileManager.stateChange.updated()

    };

    static async openFile () {
        console.log("openFile")
        let filePath : string = await globalThis.electron.openFile()
        let filename = filePath.split("\\").at(-1)
        if(filePath.indexOf("\\") > 0){
            filePath = filePath.substring(0,filePath.lastIndexOf("\\"))
        }
        LocalFileManager.storageNode = new FileNode(filePath,filename)
        LocalFileManager.stateChange.updated()
    };


}