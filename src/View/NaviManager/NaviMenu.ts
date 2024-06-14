import { ViewObjectCreator } from "../../tecnicalServices/ViewObjectCreator.js"
import { NaviMenu_I } from "./NaviMenu_I"


export class NaviPageContent{
    contentDiv : HTMLDivElement

    constructor(contentDiv : HTMLDivElement){
        this.contentDiv = contentDiv
    }
}

export class NaviPage{
    naviPageContent : NaviPageContent
    headDiv : HTMLDivElement
    button : HTMLDivElement
    constructor(naviPageContent : NaviPageContent){
        this.naviPageContent = naviPageContent

        this.button = ViewObjectCreator.createTabButton("Explorer")
        this.button.addEventListener(("click"),(e)=> {
            
        } ) 
    }

    public getTab(){
        return this.naviPageContent.contentDiv
    
    }

    
}

export class NaviMenu implements NaviMenu_I{

    tablist : HTMLDivElement[]
    naviTab : HTMLDivElement
    mainTab : HTMLDivElement

    //    private tabCreator : TabCreator

    constructor(naviTab: HTMLDivElement,mainTab, HTMLDivElement) {
        this.tablist = []
        this.naviTab = naviTab
        this.mainTab = mainTab
        
    }
    display() {
        throw new Error("Method not implemented.")
    }

/*
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

     
*/


}