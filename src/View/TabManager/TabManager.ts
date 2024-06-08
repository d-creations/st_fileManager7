import { ViewObjectCreator } from "../../tecnicalServices/ViewObjectCreator.js"
import { CanalAdapter } from "../../tecnicalServices/canalAdapter.js"
import { Observer } from "../../tecnicalServices/oberserver.js"
import { FileDiv } from "../FileDiv.js"
import { TabCreator } from "./TabCreator.js"


export interface TabManager_I{
    closeAllTabs(): void
    saveAllFile(): void
    saveCurrentFile(): void
    getTabCreator(): TabCreator

    createTab(fileNode : FileDiv, mainDiv: TABpage)
    removeTab(indexOfTab : TAB) : void

}

export class TABpage{
    tab : HTMLDivElement
    canal : CanalAdapter

    constructor(tab : HTMLDivElement, canal : CanalAdapter){
        this.tab = tab
        this.canal = canal
    }
}

export class TAB implements Observer{
    tab : TABpage
    button : HTMLDivElement
    fileNode : FileDiv
    headDiv : HTMLDivElement
    constructor(fileNode : FileDiv,tab : TABpage,headDiv : HTMLDivElement){
        this.fileNode = fileNode
        this.tab = tab
        this.headDiv = headDiv
        this.button = ViewObjectCreator.createTabButton(fileNode.getName())
        this.button.addEventListener(("click"),(e)=> {
            fileNode.openFile()
        } ) 
        this.fileNode.addObserver(this)
    }
    oberverUpdate(): void {
        this.headDiv.innerText = this.fileNode.getName()
    }
    public save(){
        this.fileNode.saveText(this.tab.canal.text)
    }

    public getTab(){
        return this.tab.tab
    }

    
}

export class TabManager implements TabManager_I{

    private baseTabManagerDiv : HTMLDivElement
    private headTabManagerDiv : HTMLDivElement
    private mainTabManagerDiv : HTMLDivElement
    private footTabManagerDiv : HTMLDivElement
    private tabList : TAB[]
    private headTabList : HTMLDivElement[]
    private currentTabIndex : number
    private tabCreator : TabCreator

    constructor(parentDiv: HTMLDivElement) {
        this.tabList = []
        this.headTabList = []
        this.currentTabIndex = -1
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
        this.tabCreator = new TabCreator(this)
    }
    getTabCreator(): TabCreator {
        return this.tabCreator
    }
    closeAllTabs(): void {
        while(this.tabList.length > 0){
            this.removeTab(this.tabList[0])
        }
    }
    saveAllFile(): void {    
     this.tabList.forEach((tab) => tab.save());
    }
    saveCurrentFile():  void {
        for(let tab of this.tabList){
            tab.save()
        }
    }
    createTab(fileNode : FileDiv, mainDiv: TABpage): void {
        let indexOfTab = this.getIndexOfTab(fileNode.getUrl())
        if(indexOfTab < 0){
            let tabdiv = document.createElement("div")
            tabdiv.classList.add("headTab")
            let tab = new TAB(fileNode,mainDiv,tabdiv)
            let TabManager = this
            let closeButton = ViewObjectCreator.createTabBarButton("close",".\\..\\..\\image\\close.png")
            closeButton.addEventListener("click",(e) => {
                TabManager.removeTab(tab)
            })
            tabdiv.appendChild(tab.button)
            tabdiv.appendChild(closeButton)
            this.headTabManagerDiv.appendChild(tabdiv)
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
    removeTab(Tab : TAB): void {
        let indexOfTab = -1
        for (let child in this.headTabManagerDiv.childNodes){
            if(this.headTabManagerDiv.childNodes[child] === Tab.headDiv){
                indexOfTab = Number(child)
            }
        }
        if(this.headTabManagerDiv.contains(Tab.headDiv)){            
            this.headTabManagerDiv.removeChild(Tab.headDiv)

            if (this.mainTabManagerDiv.contains(Tab.getTab())){
                while(this.mainTabManagerDiv.firstChild){
                    this.mainTabManagerDiv.removeChild(this.mainTabManagerDiv.firstChild)
                }
            }            
            
            this.tabList.splice(indexOfTab, 1);
            this.currentTabIndex = -1

        }
        return
    }
    private openTab(indexOfTab : number): void {
        while(this.mainTabManagerDiv.firstChild){
            this.mainTabManagerDiv.removeChild(this.mainTabManagerDiv.firstChild)
        }
        for(let tab of this.tabList){
            tab.button.classList.remove("activeTab")            
            tab.button.classList.add("inactiveTab")

        }
        this.mainTabManagerDiv.appendChild(this.tabList[indexOfTab].getTab())
        this.tabList[indexOfTab].button.classList.remove("inactiveTab")            
        this.tabList[indexOfTab].button.classList.add("activeTab")
        this.currentTabIndex = indexOfTab
    }

     



}