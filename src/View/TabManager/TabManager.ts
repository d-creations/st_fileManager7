import { ApplicationCreator_I } from "../../Applications/Application_I"
import { ViewObjectCreator } from "../../tecnicalServices/ViewObjectCreator.js"
import { FileDiv_I } from "../FileDiv.js"
import { ApplciationIndex, FrameAppCreator, TABApplication } from "./TabApplication.js"
import { TabCreator } from "./TabCreator.js"

export interface TabManager_I {
    closeAllTabs(): void
    saveAllFile(): void
    saveCurrentFile(): void
    getTabCreator(): TabCreator

    createTab(fileNode: FileDiv_I, mainDiv: HTMLDivElement, text: string, applicationCreator: ApplicationCreator_I): void
    removeTab(tab: TAB): void
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
    fileNode: FileDiv_I
    headDiv: HTMLDivElement
    ApplicationCreator: ApplciationIndex

    private _handleRename: (details: { oldName: string, newName: string }) => void;
    private _handleDelete: () => void;

    constructor(fileNode: FileDiv_I, tab: TABpage, headDiv: HTMLDivElement, applicationCreator: ApplciationIndex) {
        this.fileNode = fileNode
        this.tab = tab
        this.headDiv = headDiv
        this.button = ViewObjectCreator.createTabButton(fileNode.getName())
        this.button.addEventListener("click", (e) => {
            fileNode.openFile(applicationCreator)
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
        this.fileNode.closeTabFileState()
        this.cleanupListeners();
    }

    open() {
        this.fileNode.openTabFileState()
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

export class TabManager implements TabManager_I {

    private baseTabManagerDiv: HTMLDivElement
    private headTabManagerDiv: HTMLDivElement
    private headTabContentDiv: HTMLDivElement

    private mainTabManagerDiv: HTMLDivElement
    private footTabManagerDiv: HTMLDivElement
    private tabList: TAB[]
    private tabCreator: TabCreator

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

    createTab(fileNode: FileDiv_I, div: HTMLDivElement, text: string, applicationCreator): void {
        let indexOfTab = this.getIndexOfTab(fileNode.getUrl())
        let that = this
        console.log(indexOfTab)
        if (indexOfTab < 0) {
            let storeFunction = (text: string) => {
                console.log("save text" + text)
                fileNode.saveText(text)
            }
            let frameAppCreator = new FrameAppCreator()

            let applicationApp: TABApplication = frameAppCreator.createApplication(div, text, applicationCreator, storeFunction)

            div.classList.add("fileEditor")
            let mainDiv = new TABpage(div, applicationApp)

            let tabdiv = document.createElement("div")
            tabdiv.classList.add("headTab")
            let tab = new TAB(fileNode, mainDiv, tabdiv, applicationCreator)
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
                console.log(`File ${fileNode.getName()} deleted event received in TabManager, removing tab.`);
                TabManager.removeTab(tab);
            };

            if (typeof (fileNode as any).on === 'function') {
                (fileNode as any).on('deleted', handleDelete);
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