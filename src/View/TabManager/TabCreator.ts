
import { ApplicationCreator_I } from "../../Applications/Application_I.js"
import { FileDiv_I } from "../FileDiv.js"
import { ApplciationIndex, FrameAppCreator, TABApplication, TABApplicationFrame } from "./TabApplication.js"
import { TabManager, TABpage } from "./TabManager.js"


export class TabCreator{
    
    private tabManager : TabManager
    constructor(tabManager:  TabManager){
        this.tabManager = tabManager
    }
    createTab(fileDiv : FileDiv_I,appli : ApplciationIndex){
        let tabManager = this.tabManager
        fileDiv.getFileText().then(function(text) {
            let div : HTMLDivElement= document.createElement("div")
            let textC = text.toString()
            let storeFunction = (text : string)=>{
                fileDiv.saveText(text)
            }
            let frameAppCreator =  new FrameAppCreator()
            let applicationApp : TABApplication= frameAppCreator.createApplication(div,textC,appli,storeFunction)
            div.classList.add("fileEditor")
            tabManager.createTab(fileDiv,new TABpage(div,applicationApp),appli)
        })
    }


 
}