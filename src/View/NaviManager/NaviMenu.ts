import { ViewObjectCreator } from "../../tecnicalServices/ViewObjectCreator.js"
import { BaseTableManager_I } from "../BaseTableManager.js"
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
    naviMenu : NaviMenu
    constructor(naviMenu : NaviMenu,naviPageContent : NaviPageContent){
        this.naviPageContent = naviPageContent
        this.naviMenu = naviMenu
        let self = this
        self.naviMenu.display(naviPageContent.contentDiv)
        
        this.button = ViewObjectCreator.createNaviButton("Explorer","../../image/folder.png")
        this.button.addEventListener(("click"),(e)=> {
            self.naviMenu.display(naviPageContent.contentDiv)
        } ) 
    }

    public getTab(){
        return this.naviPageContent.contentDiv
    
    }

    
}

export class NaviMenu {

    tablist : HTMLDivElement[]
    naviTab : HTMLDivElement
    mainTab : HTMLDivElement
    baseTableManager : BaseTableManager_I
    //    private tabCreator : TabCreator

    constructor(naviTab: HTMLDivElement,mainTab:  HTMLDivElement,pages: HTMLDivElement[] = [],baseTableManager : BaseTableManager_I) {
        this.tablist = []
        this.naviTab = naviTab
        this.mainTab = mainTab
        this.baseTableManager = baseTableManager
        let self = this
        for(let page of pages){
            let naviPage = new NaviPage(self,new NaviPageContent(page))
            this.naviTab.appendChild(naviPage.button)
        }

    }
    display(content : HTMLDivElement) {
        if(this.mainTab.firstChild == content){
            while(this.mainTab.firstChild){
                this.mainTab.removeChild(this.mainTab.firstChild)
            }
            this.baseTableManager.closeFileView()
        }else{
        while(this.mainTab.firstChild){
            this.mainTab.removeChild(this.mainTab.firstChild)
        }
        this.mainTab.appendChild(content)
        this.baseTableManager.openFileView()

        }
    }



}