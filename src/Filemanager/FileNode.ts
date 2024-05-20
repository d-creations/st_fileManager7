import { FileContextMenu } from "./FileContextMenu.js"
import { FileRightClickMenu } from "./FileRightClickMenu.js"
import { FileStream } from "./LocalFileManager.js"
import { StorageNode } from "./StorageNode.js"

export class FileNode extends StorageNode{

    getUrl(): string {
        return this.path + "\\" + this.headDiv.innerText
    }
    private fileStream : FileStream
    constructor(path : string, name : string,fileStream : FileStream){
        super(path,name)
        this.fileStream= fileStream
    }

    print(space?: string) {
        if( space === null) space = ""
        console.log(space+this.name)
    }

    createDivs(parentDiv : HTMLDivElement, spaceLeft : number) {
        this.headDiv = document.createElement("div")
        this.headDiv.contentEditable == "false"
        this.headDiv.style.marginLeft = spaceLeft + "pt"
        this.headDiv.classList.add("selectable")
        this.headDiv.innerText = this.name
        
        this.headDiv.setAttribute("divname" , "FOLDER bodydiv" + this.name)
        parentDiv.appendChild(this.headDiv )
        
        this.headDiv.addEventListener("contextmenu", (e) => {
            
            let fileContextMenu = new FileContextMenu(this)
            fileContextMenu.showContextMenu(e)
        });

        this.headDiv.addEventListener("click", (e) => {
            let rightClickMenu = new FileRightClickMenu(this)
            rightClickMenu.showMenu(e)
        });


    }

    async open(){
        this.fileStream.openFileStream(this)
    }

    save(text: string) {
        this.fileStream.saveFileStream(this,text)
    }


    async update(){

    }


}