
import { FileDiv_I } from "..//TreeView/FileDiv.js"
import { ApplciationIndex } from "./TabApplication.js"
import { TabManager } from "./TabManager.js"


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