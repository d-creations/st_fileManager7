import { FileNode } from "./FileNode"
import { FileStream } from "./LocalFileManager"



export class FileRightClickMenu{
    static fileRightClickMenuDiv = document.createElement("div")
    private pathDir = ""
    private nameFile = ""
    private fileNode : FileNode
    static target :HTMLDivElement;
    public showMenu(e : Event){
        if(e.target instanceof HTMLDivElement && e.target.contentEditable != "true"){
            FileRightClickMenu.target = e.target
            e.target.setAttribute("click","true")
            FileRightClickMenu.removeContextMenu()
            FileRightClickMenu.fileRightClickMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
            FileRightClickMenu.fileRightClickMenuDiv.classList.add("showRightClickMenu")
            let pos = this.getPosition(e)
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
    }

    static removeContextMenu(){
        if(FileRightClickMenu.fileRightClickMenuDiv.classList.contains("showRightClickMenu")){
        FileRightClickMenu.fileRightClickMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
        FileRightClickMenu.fileRightClickMenuDiv.classList.add("hiddenRightClickMenu")
        while(FileRightClickMenu.fileRightClickMenuDiv.firstChild){
            FileRightClickMenu.fileRightClickMenuDiv.removeChild(FileRightClickMenu.fileRightClickMenuDiv.firstChild)
        }
        FileRightClickMenu.target.removeAttribute("click")
    }
    }
    constructor (fileNode : FileNode){
        this.fileNode = fileNode
    }

    public getPosition(e) {
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