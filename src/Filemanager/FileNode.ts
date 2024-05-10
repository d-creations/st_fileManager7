import { FileContextMenu } from "./FileContextMenu.js"
import { StorageNode } from "./StorageNode.js"

export class FileNode extends StorageNode{
    constructor(path : string, name : string){
        super(path,name)
    }

    print(space?: string) {
        if( space === null) space = ""
        console.log(space+this.name)
    }

    createDivs(parentDiv : HTMLDivElement, spaceLeft : number) {
        this.bodyDiv = document.createElement("div")
        this.bodyDiv .style.marginLeft = spaceLeft + "pt"
        this.bodyDiv .classList.add("selectable")
        this.bodyDiv .innerText = this.name
        
        this.bodyDiv.setAttribute("divname" , "FOLDER bodydiv" + this.name)
        parentDiv.appendChild(this.bodyDiv )
        
        this.bodyDiv.addEventListener("contextmenu", (e) => {
            FileContextMenu.showContextMenu(this.path,e)
        });

    }


    async update(){

    }


}