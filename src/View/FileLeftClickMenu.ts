import { FileDiv } from "./FileDiv.js";
import { ApplciationIndex } from "./TabManager/TabApplication.js";



export class FileLeftClickMenu{
    static fileRightClickMenuDiv = document.createElement("div")
    private pathDir = ""
    private nameFile = ""
    private fileNode : FileDiv
    static target :HTMLDivElement;
    public showMenu(e : Event){
        if(e.target instanceof HTMLDivElement && e.target.contentEditable != "true"){
            e.target.setAttribute("click","true")
            FileLeftClickMenu.target = e.target
            let pos = this.getPosition(e)
            FileLeftClickMenu.removeMenu()
            FileLeftClickMenu.fileRightClickMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
            FileLeftClickMenu.fileRightClickMenuDiv.classList.add("showRightClickMenu")
            FileLeftClickMenu.fileRightClickMenuDiv.style.left = pos.x + "px";
            FileLeftClickMenu.fileRightClickMenuDiv.style.top = pos.y + "px";
            let openInEditor = document.createElement("div")
            openInEditor.innerText = "OpenInEditor"
            openInEditor.classList.add("selectable","rightClickMenu")
            FileLeftClickMenu.fileRightClickMenuDiv.appendChild(openInEditor)
            openInEditor.addEventListener("click", (e)=> {
                FileLeftClickMenu.removeMenu()
                console.log("openFile")
                let appIndex = new ApplciationIndex("../../src/Applications/EditorACE/index.html")
                this.fileNode.openFile(appIndex)
            })

            let openInStarEditPro = document.createElement("div")
            openInStarEditPro.innerText = "openInStarEditPro"
            openInStarEditPro.classList.add("selectable","rightClickMenu")
            FileLeftClickMenu.fileRightClickMenuDiv.appendChild(openInStarEditPro)
            openInStarEditPro.addEventListener("click", (e)=> {
                FileLeftClickMenu.removeMenu()
                console.log("openFile")               
                //let appIndex = new ApplciationIndex("https://nc-editx7pro.star-ncplot.com/")
                let appIndex = new ApplciationIndex("http://172.22.242.37/")

                this.fileNode.openFile(appIndex)               

            })


            console.log("shoe Menu")
        }
    }

    static removeMenu(){
        if(FileLeftClickMenu.fileRightClickMenuDiv.classList.contains("showRightClickMenu")){
            FileLeftClickMenu.fileRightClickMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
            FileLeftClickMenu.fileRightClickMenuDiv.classList.add("hiddenRightClickMenu")
        while(FileLeftClickMenu.fileRightClickMenuDiv.firstChild){
            FileLeftClickMenu.fileRightClickMenuDiv.removeChild(FileLeftClickMenu.fileRightClickMenuDiv.firstChild)
        }
        FileLeftClickMenu.target.removeAttribute("click")
    }
    }
    constructor (fileNode : FileDiv){
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