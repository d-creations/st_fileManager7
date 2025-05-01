import { ApplicationCreator_I } from "../../Applications/Application_I"
import { ViewObjectCreator } from "../../tecnicalServices/ViewObjectCreator.js"
import { ApplciationIndex, FrameAppCreator, TABApplication } from "./TabApplication.js"
import { TabCreator } from "./TabCreator.js"
import { createDecorator } from '../../tecnicalServices/instantiation/ServiceCollection.js'; // Import createDecorator
import { IOpenFileHandler } from "../../Domain/FileSystemService/IOpenFileHander";
import { FileNode_EXC_I } from "../../ViewDomainI/Interfaces";
import { APPUIEvent, IuiEventService } from "../UIEventService/IuieventService.js";
import { ISettings } from "../../tecnicalServices/Settings.js";

export const ITabManager = createDecorator<ITabManager>('ITabManager'); // Create decorator

export interface ITabManager {
    // Keep createTab signature as is for now, TabCreator handles the details
    createTab(openFileHandler: IOpenFileHandler, mainDiv: HTMLDivElement, text: string, applicationCreator: ApplciationIndex): void
    removeTab(tab: TAB): void
    getHtmlElement(): HTMLDivElement
}

export class TABpage {
    contentDiv: HTMLDivElement
    tabapplication: TABApplication

    constructor(contentDiv: HTMLDivElement, tabapplication: TABApplication) {
        this.contentDiv = contentDiv
        this.tabapplication = tabapplication
    }
}

export class TAB {

    tab: TABpage
    button: HTMLDivElement
    fileNode: FileNode_EXC_I
    headDiv: HTMLDivElement
    ApplicationCreator: ApplciationIndex

    private _handleRename: (details: { oldName: string, newName: string }) => void;
    private _handleDelete: () => void;

    constructor(fileNode: FileNode_EXC_I, tab: TABpage, headDiv: HTMLDivElement, applicationCreator: ApplciationIndex) {
        this.fileNode = fileNode
        this.tab = tab
        this.headDiv = headDiv
        this.button = ViewObjectCreator.createTabButton(fileNode.getName())
        this.button.addEventListener("click", (e) => {
            fileNode.openFile()
        })

        this._handleRename = ({ newName }) => this.handleFileRename(newName);
        this._handleDelete = () => this.handleFileDelete();

        if (typeof (this.fileNode as any).on === 'function') {
            (this.fileNode as any).on('renamed', this._handleRename);
            (this.fileNode as any).on('deleted', this._handleDelete);
        } else {
            console.warn("FileNode does not seem to be an EventEmitter in TAB constructor");
        }
    }

    private handleFileRename(newName: string): void {
        this.headDiv.innerText = newName;
        this.button.innerText = newName;
    }

    private handleFileDelete(): void {
        console.log(`File ${this.fileNode.getName()} deleted, tab should be removed by TabManager.`);
        this.cleanupListeners();
    }

    close() {
        this.fileNode.openEditingState()
        this.cleanupListeners();
    }

    open() {
        this.fileNode.openEditingState()
    }

    public save() {
        this.tab.tabapplication.saveText()
    }

    public getTab() {
        return this.tab.contentDiv
    }

    public cleanupListeners(): void {
        if (typeof (this.fileNode as any).off === 'function') {
            (this.fileNode as any).off('renamed', this._handleRename);
            (this.fileNode as any).off('deleted', this._handleDelete);
        } else {
            console.warn("FileNode does not seem to be an EventEmitter in TAB cleanupListeners");
        }
    }
}

// Implement the interface
export class TabManager implements ITabManager {

    private baseTabManagerDiv: HTMLDivElement
    private headTabManagerDiv: HTMLDivElement
    private headTabContentDiv: HTMLDivElement

    private mainTabManagerDiv: HTMLDivElement
    private footTabManagerDiv: HTMLDivElement
    private tabList: TAB[]
    private tabCreator: TabCreator
    private settings: ISettings
    constructor(
        @IuiEventService uiEventService: IuiEventService,
        @ISettings settings: ISettings
    ) {
        this.settings = settings
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
        this.baseTabManagerDiv.appendChild(this.headTabManagerDiv)
        this.baseTabManagerDiv.appendChild(this.mainTabManagerDiv)
        this.baseTabManagerDiv.appendChild(this.footTabManagerDiv)
        this.tabCreator = new TabCreator(this)

        uiEventService.on(APPUIEvent.FileOpenInEditor, (fileNode : FileNode_EXC_I) => { this.askApplication(fileNode) });
    
        uiEventService.on(APPUIEvent.saveOpenFile, this.saveCurrentFile.bind(this));
        uiEventService.on(APPUIEvent.saveAll, this.saveAllFile.bind(this)); // Bind the method to the current context
        uiEventService.on(APPUIEvent.CloseOpenFiles, this.closeAllTabs.bind(this)); // Bind the method to the current context
    }
    askApplication(fileNode: FileNode_EXC_I) {
        this.clearMaintabManagerDiv()  
        let pos = {x:0,y:0}
        console.log("openMenu Ask")
        try {

        this.settings.reloadSettings()
        for(let application of this.settings.getApplications()){
            if(application.aktiv == "True"){
                let openInEditor = document.createElement("div")
                openInEditor.innerText = "Open" + application.name
                openInEditor.classList.add("selectable","rightClickMenu")
                this.mainTabManagerDiv.appendChild(openInEditor)
                openInEditor.addEventListener("click", (e)=> {
                    let appIndex = new ApplciationIndex(application.url)
                    this.tabCreator.createTab(fileNode,appIndex)
                    })
            }
        }
    }catch (error) {
        console.error("Error in askApplication:", error);
    }
    }

    getHtmlElement(): HTMLDivElement {
        return this.baseTabManagerDiv
    }
    getTabCreator(): TabCreator {
        return this.tabCreator
    }

    closeAllTabs(): void {
        const tabsToRemove = [...this.tabList];
        tabsToRemove.forEach(tab => this.removeTab(tab));
    }

    saveAllFile(): void {
        this.tabList.forEach((tab) => tab.save());
    }

    saveCurrentFile(): void {
        const activeTab = this.tabList.find(tab => tab.button.classList.contains("activeTab"));
        activeTab?.save();
    }

    clearMaintabManagerDiv(): void {
        while (this.mainTabManagerDiv.firstChild) {
            this.mainTabManagerDiv.removeChild(this.mainTabManagerDiv.firstChild);
        }
    }

    createTab(openFileHandler: FileNode_EXC_I, div: HTMLDivElement, text: string, applicationCreator): void {
        this.clearMaintabManagerDiv()  
        console.log("createTab", openFileHandler.getName(), openFileHandler.getUrl())
        let indexOfTab = this.getIndexOfTab(openFileHandler.getUrl())
        let that = this
        console.log(indexOfTab)
        if (indexOfTab < 0) {
            let storeFunction = (text: string) => {
                console.log("save text" + text)
                openFileHandler.saveText(text)
            }
            let frameAppCreator = new FrameAppCreator()

            let applicationApp: TABApplication = frameAppCreator.createApplication(div, text, applicationCreator, storeFunction)

            div.classList.add("fileEditor")
            let mainDiv = new TABpage(div, applicationApp)

            let tabdiv = document.createElement("div")
            tabdiv.classList.add("headTab")
            let tab = new TAB(openFileHandler, mainDiv, tabdiv, applicationCreator)
            let TabManager = this
            let closeButton = ViewObjectCreator.createTabBarButton("close", ".\\..\\..\\image\\close.png")
            closeButton.addEventListener("click", (e) => {
                TabManager.removeTab(tab)
            })
            tabdiv.appendChild(tab.button)
            tabdiv.appendChild(closeButton)
            this.headTabContentDiv.appendChild(tabdiv)
            this.tabList.push(tab)

            const handleDelete = () => {
                console.log(`File ${openFileHandler.getName()} deleted event received in TabManager, removing tab.`);
                TabManager.removeTab(tab);
            };

            if (typeof (openFileHandler as any).on === 'function') {
                (openFileHandler as any).on('deleted', handleDelete);
                (tab as any)._handleDeleteForManager = handleDelete;
            } else {
                console.warn("FileNode does not seem to be an EventEmitter in TabManager createTab");
            }

            indexOfTab = this.tabList.length - 1
            this.mainTabManagerDiv.appendChild(this.tabList[indexOfTab].getTab())

            that.openTab(indexOfTab)

        } else {
            this.openTab(indexOfTab)
        }
        return
    }

    getIndexOfTab(url: string): number {
        for (let tabIndex in this.tabList) {
            if (url === this.tabList[tabIndex].fileNode.getUrl()) {
                return Number(tabIndex)
            }
        }
        return -1
    }

    removeTab(tabToRemove: TAB): void {
        const index = this.tabList.indexOf(tabToRemove);
        if (index === -1) {
            console.warn("Attempted to remove a tab that is not in the list.");
            return;
        }

        console.log(`Removing tab for: ${tabToRemove.fileNode.getName()}`);

        tabToRemove.cleanupListeners();

        const handleDeleteForManager = (tabToRemove as any)._handleDeleteForManager;
        if (handleDeleteForManager && typeof (tabToRemove.fileNode as any).off === 'function') {
            (tabToRemove.fileNode as any).off('deleted', handleDeleteForManager);
        }

        tabToRemove.close();

        if (this.headTabContentDiv.contains(tabToRemove.headDiv)) {
            this.headTabContentDiv.removeChild(tabToRemove.headDiv);
        }
        if (this.mainTabManagerDiv.contains(tabToRemove.getTab())) {
            this.mainTabManagerDiv.removeChild(tabToRemove.getTab());
        }

        this.tabList.splice(index, 1);

        console.log(`Tab removed. Remaining tabs: ${this.tabList.length}`);
    }

    private openTab(indexOfTab: number): void {
        if (indexOfTab < 0 || indexOfTab >= this.tabList.length) return;

        for (let i = 0; i < this.tabList.length; i++) {
            const tab = this.tabList[i];
            const isActive = i === indexOfTab;

            tab.button.classList.toggle("activeTab", isActive);
            tab.button.classList.toggle("inactiveTab", !isActive);
            tab.getTab().classList.toggle("activeMainTab", isActive);
            tab.getTab().classList.toggle("inactiveMainTab", !isActive);
        }
    }
}