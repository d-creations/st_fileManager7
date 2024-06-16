
import { ApplicationCreator_I } from "../../Applications/Application_I.js"
import { EditorControlerAdapter_EXC_I } from "../../ViewDomainI/Interfaces.js"
import { FileDiv } from "../FileDiv.js"
import { TABApplication } from "./TabApplication.js"
import { TabManager, TABpage } from "./TabManager.js"


export class TabCreator{
    
    private tabManager : TabManager
    constructor(tabManager:  TabManager){
        this.tabManager = tabManager
    }
    createTab(fileDiv : FileDiv,applicationCreator : ApplicationCreator_I,editor : EditorControlerAdapter_EXC_I){
        let tabManager = this.tabManager
        editor.getFileText(fileDiv.fileNode).then(function(text) {
            let div : HTMLDivElement= document.createElement("div")
            let canal : TABApplication= applicationCreator.createApplication(div)
            canal.setText(text.toString())
            div.classList.add("fileEditor")
            tabManager.createTab(fileDiv,new TABpage(div,canal),applicationCreator)
        })
    }


 
}