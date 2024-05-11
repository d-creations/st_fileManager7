import { FileNode } from "./FileNode"
import { FileStream } from "./LocalFileManager"



export class FileRightClickMenu{
    static fileRightClickMenuDiv = document.createElement("div")
    private pathDir = ""
    private nameFile = ""
    private fileNode : FileNode

    public showMenu(e : Event){
        FileRightClickMenu.removeContextMenu()
        FileRightClickMenu.fileRightClickMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
        FileRightClickMenu.fileRightClickMenuDiv.classList.add("showRightClickMenu")
        let pos = FileRightClickMenu.getPosition(e)
        FileRightClickMenu.fileRightClickMenuDiv.style.left = pos.x + "px";
        FileRightClickMenu.fileRightClickMenuDiv.style.top = pos.y + "px";
        let openInEditor = document.createElement("div")
        openInEditor.innerText = "OpenInEditor"
        openInEditor.classList.add("selectable","rightClickMenu")
        FileRightClickMenu.fileRightClickMenuDiv.appendChild(openInEditor)
        openInEditor.addEventListener("click", (e)=> {
            
            FileRightClickMenu.removeContextMenu()
            console.log("openFile")
            this.fileNode.open()
        })
        console.log("shoe Menu")
    }

    static removeContextMenu(){
        FileRightClickMenu.fileRightClickMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
        FileRightClickMenu.fileRightClickMenuDiv.classList.add("hiddenRightClickMenu")
        while(FileRightClickMenu.fileRightClickMenuDiv.firstChild){
            FileRightClickMenu.fileRightClickMenuDiv.removeChild(FileRightClickMenu.fileRightClickMenuDiv.firstChild)
        }
    }
    constructor (fileNode : FileNode){
        this.fileNode = fileNode
    }

    static getPosition(e) {
        let posx = 0;
        let  posy = 0;
        if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
        } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
        }
        return {
        x: posx,
        y: posy
        }
        }
}