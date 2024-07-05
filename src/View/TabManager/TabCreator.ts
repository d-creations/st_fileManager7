
import { ApplicationCreator_I } from "../../Applications/Application_I.js"
import { SettingFileNode } from "../../Applications/Setting.js"
import { FileDiv_I } from "../FileDiv.js"
import { TABApplication } from "./TabApplication.js"
import { TabManager, TABpage } from "./TabManager.js"


export class TabCreator{
    
    private tabManager : TabManager
    constructor(tabManager:  TabManager){
        this.tabManager = tabManager
    }
    createTab(fileDiv : FileDiv_I,applicationCreator : ApplicationCreator_I){
        let tabManager = this.tabManager
        fileDiv.getFileText().then(function(text) {
            let div : HTMLDivElement= document.createElement("div")
            let canal : TABApplication= applicationCreator.createApplication(div)
            canal.setText(text.toString())
            div.classList.add("fileEditor")
            tabManager.createTab(fileDiv,new TABpage(div,canal),applicationCreator)
        })
    }


 
}