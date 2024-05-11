import { FileNode } from "../Filemanager/FileNode.js"
import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js"

export interface TabManager_I{

    createTab(fileNode : FileNode, mainDiv : HTMLDivElement) : void
    removeTab(indexOfTab : number) : void
    openTab(indexOfTab : number) : void
}

export class TAB{
    tab : HTMLDivElement
    button : HTMLDivElement
    fileNode : FileNode
    constructor(fileNode : FileNode,tab : HTMLDivElement){
        this.fileNode = fileNode
        this.tab = tab
        this.button = ViewObjectCreator.createTabButton(fileNode.name)
        this.button.addEventListener(("click"),(e)=> {
            fileNode.open()
        } ) 
    }

    
}

export class TabManager implements TabManager_I{

    private baseTabManagerDiv : HTMLDivElement
    private headTabManagerDiv : HTMLDivElement
    private mainTabManagerDiv : HTMLDivElement
    private footTabManagerDiv : HTMLDivElement
    private tabList : TAB[]


    constructor(parentDiv: HTMLDivElement) {
        this.tabList = []
        this.baseTabManagerDiv = document.createElement("div")
        this.baseTabManagerDiv.classList.add("baseTabManagerTable")
        this.headTabManagerDiv = document.createElement("div")
        this.headTabManagerDiv.classList.add("headTabManager")
        this.mainTabManagerDiv = document.createElement("div")
        this.mainTabManagerDiv.classList.add("mainTabManager")
        this.footTabManagerDiv = document.createElement("div")
        this.footTabManagerDiv.classList.add("footTabManager")
        parentDiv.appendChild(this.baseTabManagerDiv)
        this.baseTabManagerDiv.appendChild(this.headTabManagerDiv)
        this.baseTabManagerDiv.appendChild(this.mainTabManagerDiv)
        this.baseTabManagerDiv.appendChild(this.footTabManagerDiv)
    }
    createTab(fileNode : FileNode, mainDiv: HTMLDivElement): void {
        let indexOfTab = this.getIndexOfTab(fileNode.getUrl())
        if(indexOfTab < 0){
            let tab = new TAB(fileNode,mainDiv)
            this.headTabManagerDiv.appendChild(tab.button)
            this.tabList.push(tab)
            indexOfTab = this.tabList.length -1
        }
        this.openTab(indexOfTab)
        return
    }
    getIndexOfTab(url: string) : number {
        for(let tabIndex in this.tabList){
            if(url === this.tabList[tabIndex].fileNode.getUrl()){
                return Number(tabIndex)
            }
        }
        return -1
    }
    removeTab(indexOfTab : number): void {
        if(indexOfTab >= 0){            
            this.headTabManagerDiv.removeChild(this.tabList[indexOfTab].tab)
            while(this.mainTabManagerDiv.firstChild){
                this.mainTabManagerDiv.removeChild(this.mainTabManagerDiv.firstChild)
            }
        }
        return
    }
    openTab(indexOfTab : number): void {
        while(this.mainTabManagerDiv.firstChild){
            this.mainTabManagerDiv.removeChild(this.mainTabManagerDiv.firstChild)
        }
        for(let tab of this.tabList){
            tab.button.classList.remove("activeTab")            
            tab.button.classList.add("inactiveTab")

        }
        this.mainTabManagerDiv.appendChild(this.tabList[indexOfTab].tab)
        this.tabList[indexOfTab].button.classList.remove("inactiveTab")            
        this.tabList[indexOfTab].button.classList.add("activeTab")
    }

     



}