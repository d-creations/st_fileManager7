
import { IAppForFileService } from "../../Domain/FileSystemService/IAppForFileService.js"
import { FileNode_EXC_I } from "../../ViewDomainI/Interfaces.js"
import { ApplciationIndex } from "./TabApplication.js"
import { ITabManager, TabManager } from "./TabManager.js"


export class TabCreator implements IAppForFileService {
    
    private tabManager : ITabManager
    constructor(
        tabManager: ITabManager){
        this.tabManager = tabManager
    }
    openFileInapp(fileNode: FileNode_EXC_I, applciationIndex: ApplciationIndex) {
        this.createTab(fileNode, applciationIndex)
        return
    }


    createTab(fileNode : FileNode_EXC_I,appli : ApplciationIndex){
        let tabManager = this.tabManager
        
        let div : HTMLDivElement= document.createElement("div")

        fileNode.getFileText().then(function(text : string) {        
            tabManager.createTab(fileNode,div,text,appli)
        })

    }


 
}