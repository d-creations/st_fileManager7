import { ApplicationSettings } from "../tecnicalServices/Settings.js";
import { FileDiv } from "./FileDiv.js";
import { ApplciationIndex } from "./TabManager/TabApplication.js";



export class FileLeftClickMenu{
    static fileRightClickMenuDiv = document.createElement("div")
    private pathDir = ""
    private nameFile = ""
    private fileNode : FileDiv
    static target :HTMLDivElement;
    private applications : ApplicationSettings[]
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
            for(let application of this.applications){
                if(application.aktiv == "True"){
                    let openInEditor = document.createElement("div")
                    openInEditor.innerText = "Open" + application.name
                    openInEditor.classList.add("selectable","rightClickMenu")
                    FileLeftClickMenu.fileRightClickMenuDiv.appendChild(openInEditor)
                    openInEditor.addEventListener("click", (e)=> {
                        FileLeftClickMenu.removeMenu()
                        console.log("openFile")
                        let appIndex = new ApplciationIndex(application.url)
                        this.fileNode.openFile(appIndex)
                        })
                }
        }

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
    constructor (fileNode : FileDiv,applications){
        this.fileNode = fileNode
        this.applications = applications
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