import { FileContextMenu } from "./FileContextMenu.js"
import { FileRightClickMenu } from "./FileRightClickMenu.js"
import { FileStream } from "./LocalFileManager.js"
import { StorageNode } from "./StorageNode.js"

export class FileNode extends StorageNode{

    getUrl(): string {
        return this.path + "\\" + this.name
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
        this.bodyDiv = document.createElement("div")
        this.bodyDiv.style.marginLeft = spaceLeft + "pt"
        this.bodyDiv.classList.add("selectable")
        this.bodyDiv.innerText = this.name
        
        this.bodyDiv.setAttribute("divname" , "FOLDER bodydiv" + this.name)
        parentDiv.appendChild(this.bodyDiv )
        
        this.bodyDiv.addEventListener("contextmenu", (e) => {
            FileContextMenu.showContextMenu(this.path,this.name,e)
        });

        this.bodyDiv.addEventListener("click", (e) => {
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