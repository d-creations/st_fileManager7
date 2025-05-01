import { InstantiationService } from "../tecnicalServices/instantiation/InstantiationService.js";
import {ISettings } from "../tecnicalServices/Settings.js";
import { FileDiv } from "./TreeView/FileDiv.js";
import { ApplciationIndex } from "./TabManager/TabApplication.js";
import { IuiEventService } from "./UIEventService/IuieventService.js";

export class FileLeftClickMenu{

    static fileRightClickMenuDiv = document.createElement("div")
    private fileNode : FileDiv
    static target :HTMLDivElement;
    private settings : ISettings
    static state = "false"

    public showSimpleMenu() {
        this.openMenu({x:0,y:0})
    }



    public showMenu(e : Event){
        FileLeftClickMenu.target = e.target as HTMLDivElement
        if(e.target instanceof HTMLDivElement && e.target.contentEditable != "true"){
            e.target.setAttribute("click","true")
            let pos = this.getPosition(e)
            this.openMenu(pos)
        }
    }

    static removeMenu(){
        if(FileLeftClickMenu.fileRightClickMenuDiv.classList.contains("showRightClickMenu")){
            FileLeftClickMenu.fileRightClickMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
            FileLeftClickMenu.fileRightClickMenuDiv.classList.add("hiddenRightClickMenu")
        while(FileLeftClickMenu.fileRightClickMenuDiv.firstChild){
            FileLeftClickMenu.fileRightClickMenuDiv.removeChild(FileLeftClickMenu.fileRightClickMenuDiv.firstChild)
        }
        }
            
        FileLeftClickMenu.state = "false"
    }

    constructor (fileNode : FileDiv, settings :  ISettings){
        this.fileNode = fileNode
        this.settings = settings
    }
    private openMenu(pos){
        console.log("openMenu")
        FileLeftClickMenu.removeMenu()
        FileLeftClickMenu.fileRightClickMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
        FileLeftClickMenu.fileRightClickMenuDiv.classList.add("showRightClickMenu")
        FileLeftClickMenu.fileRightClickMenuDiv.style.left = pos.x + "px";
        FileLeftClickMenu.fileRightClickMenuDiv.style.top = pos.y + "px";
        this.settings.reloadSettings()
        for(let application of this.settings.getApplications()){
            if(application.aktiv == "True"){
                let openInEditor = document.createElement("div")
                openInEditor.innerText = "Open" + application.name
                openInEditor.classList.add("selectable","rightClickMenu")
                FileLeftClickMenu.fileRightClickMenuDiv.appendChild(openInEditor)
                openInEditor.addEventListener("click", (e)=> {
                    FileLeftClickMenu.removeMenu()
                    let appIndex = new ApplciationIndex(application.url)
//                    this.fileNode.openFile(appIndex)
                    })
            }
        }
        FileLeftClickMenu.state = "true"
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