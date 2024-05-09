
import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js";
import { FolderNode } from "./FolderNode.js";




export class LocalFileManager implements FileManager_I{

    static folderTree : FolderNode
    constructor(parentDiv : HTMLDivElement){
        let openFolderButton = ViewObjectCreator.openFileButton()
        parentDiv.appendChild(openFolderButton);
        openFolderButton.addEventListener('change', function(e) {
            LocalFileManager.openFile()

        })

        let openDirButton = ViewObjectCreator.createTabButton("FOLDER")
        parentDiv.appendChild(openDirButton);
        openDirButton.addEventListener('click', function(e) {
            LocalFileManager.openFolder()
            })

    }

    openFolder(): void {
        throw new Error("Method not implemented.");
    }
    openFile(): void {
        throw new Error("Method not implemented.");
    }

    
    static async openFolder () {
        console.log("openFolder")
        const filePath = await globalThis.electron.openFolder()
        const getFiles = await globalThis.electron.getFilesInFolder(filePath)
        LocalFileManager.folderTree = new FolderNode(filePath)
        await LocalFileManager.folderTree.print("")
    };

    static async openFile () {
        console.log("openFile")

        const filePath = await globalThis.electron.openFile()
        console.log(filePath)
    };


}