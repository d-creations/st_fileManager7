import { ApplicationCreator_I } from "../../Applications/Application_I"
import { ViewObjectCreator } from "../../tecnicalServices/ViewObjectCreator.js"
import { Observer, ObserverFunction, observerFunc } from "../../tecnicalServices/oberserver.js"
import { FileDiv_I } from "../FileDiv.js"
import { ApplciationIndex, TABApplication } from "./TabApplication.js"
import { TabCreator } from "./TabCreator.js"


export interface TabManager_I{
    closeAllTabs(): void
    saveAllFile(): void
    saveCurrentFile(): void
    getTabCreator(): TabCreator

    createTab(fileNode : FileDiv_I, mainDiv: TABpage,applicationCreator : ApplicationCreator_I)
    removeTab(indexOfTab : TAB) : void

}

export class TABpage{
    contentDiv : HTMLDivElement
    tabapplication : TABApplication

    constructor(contentDiv : HTMLDivElement, tabapplication : TABApplication){
        this.contentDiv = contentDiv
        this.tabapplication = tabapplication
    }
}

export class TAB implements Observer{
    tab : TABpage
    button : HTMLDivElement
    fileNode : FileDiv_I
    headDiv : HTMLDivElement
    ApplicationCreator : ApplciationIndex
    constructor(fileNode : FileDiv_I,tab : TABpage,headDiv : HTMLDivElement,applicationCreator : ApplciationIndex){
        this.fileNode = fileNode
        this.tab = tab
        this.headDiv = headDiv
        this.button = ViewObjectCreator.createTabButton(fileNode.getName())
        this.button.addEventListener(("click"),(e)=> {
            fileNode.openFile(applicationCreator)
        } ) 
        this.fileNode.addObserver(this)
    }
    oberverUpdate(): void {
        this.headDiv.innerText = this.fileNode.getName()
    }
    public save(){
        this.tab.tabapplication.saveText()
    }

    public getTab(){
        return this.tab.contentDiv
    }

    
}

export class TabManager implements TabManager_I{

    private baseTabManagerDiv : HTMLDivElement
    private headTabManagerDiv : HTMLDivElement
    private headTabContentDiv : HTMLDivElement

    private mainTabManagerDiv : HTMLDivElement
    private footTabManagerDiv : HTMLDivElement
    private tabList : TAB[]
    private tabCreator : TabCreator

    constructor(parentDiv: HTMLDivElement) {
        this.tabList = []
        this.baseTabManagerDiv = document.createElement("div")
        this.baseTabManagerDiv.classList.add("baseTabManagerTable")
        this.headTabManagerDiv = document.createElement("div")
        this.headTabManagerDiv.classList.add("headTabManager")
        this.headTabContentDiv = document.createElement("div")
        this.headTabContentDiv.classList.add("headTabContent")
        this.headTabManagerDiv.appendChild(this.headTabContentDiv)
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
    createTab(fileNode : FileDiv_I, mainDiv: TABpage,applicationCreator): void {
        let indexOfTab = this.getIndexOfTab(fileNode.getUrl())
        if(indexOfTab < 0){
            let tabdiv = document.createElement("div")
            tabdiv.classList.add("headTab")
            let tab = new TAB(fileNode,mainDiv,tabdiv,applicationCreator)
            let TabManager = this
            let closeButton = ViewObjectCreator.createTabBarButton("close",".\\..\\..\\image\\close.png")
            closeButton.addEventListener("click",(e) => {
                TabManager.removeTab(tab)
            })
            tabdiv.appendChild(tab.button)
            tabdiv.appendChild(closeButton)
            this.headTabContentDiv.appendChild(tabdiv)
            this.tabList.push(tab)
            let func : observerFunc = ()=>{
                if(fileNode.getFileIsDeleted())TabManager.removeTab(tab)
            }
            fileNode.addObserver(new ObserverFunction(func))
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
        for (let child in this.headTabContentDiv.childNodes){
            if(this.headTabContentDiv.childNodes[child] === Tab.headDiv){
                indexOfTab = Number(child)
            }
        }
        if(this.headTabContentDiv.contains(Tab.headDiv)){            
            this.headTabContentDiv.removeChild(Tab.headDiv)

            if (this.mainTabManagerDiv.contains(Tab.getTab())){
                while(this.mainTabManagerDiv.firstChild){
                    this.mainTabManagerDiv.removeChild(this.mainTabManagerDiv.firstChild)
                }
            }            
            
            this.tabList.splice(indexOfTab, 1);

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
    }

     



}