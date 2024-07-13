
import { ApplicationCreator_I } from "../../Applications/Application_I.js"
import { FileDiv_I } from "../FileDiv.js"
import { ApplciationIndex, FrameAppCreator, TABApplication } from "./TabApplication.js"
import { TabManager, TABpage } from "./TabManager.js"


export class TabCreator{
    
    private tabManager : TabManager
    constructor(tabManager:  TabManager){
        this.tabManager = tabManager
    }
    createTab(fileDiv : FileDiv_I,appli : ApplciationIndex){
        let tabManager = this.tabManager
        let div : HTMLDivElement= document.createElement("div")

        fileDiv.getFileText().then(function(text : string) {        
            tabManager.createTab(fileDiv,div,text,appli)
        })

    }


 
}