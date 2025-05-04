import { FileNode_EXC_I } from "../../Contracts/Interfaces.js";
import { createDecorator } from "../../Utils/instantiation/ServiceCollection.js";
import { ISettings } from "../../Utils/Settings.js";
import { ViewObjectCreator } from "../../Utils/ViewObjectCreator.js";
import { IuiEventService, APPUIEvent } from "../UIEventService/IuieventService.js";
import { ApplciationIndex, TABApplication, FrameAppCreator } from "./TabApplication.js";


export const ITabManager = createDecorator<ITabManager>('ITabManager');

export interface ITabManager {
    createTabForFile(fileNode: FileNode_EXC_I, applicationCreator?: ApplciationIndex): void;
    removeTab(tab: TAB): void;
    getHtmlElement(): HTMLDivElement;
}

// Represents the content area of a tab
export class TABpage {
    contentDiv: HTMLDivElement;
    tabapplication: TABApplication;

    constructor(contentDiv: HTMLDivElement, tabapplication: TABApplication) {
        this.contentDiv = contentDiv;
        this.tabapplication = tabapplication;
    }

    setActive(isActive: boolean): void {
        this.contentDiv.classList.toggle("activeMainTab", isActive);
        this.contentDiv.classList.toggle("inactiveMainTab", !isActive);
        this.contentDiv.style.display = isActive ? '' : 'none';
    }
}

// Represents the visual header part of a tab (button, close button)
class TabView {
    private headDiv: HTMLDivElement;
    private button: HTMLDivElement;
    private closeButton: HTMLDivElement;
    private _openCallback: () => void;
    private _closeCallback: () => void;

    constructor(
        fileName: string,
        openCallback: () => void,
        closeCallback: () => void
    ) {
        this._openCallback = openCallback;
        this._closeCallback = closeCallback;

        this.headDiv = document.createElement("div");
        this.headDiv.classList.add("headTab");

        this.button = ViewObjectCreator.createTabButton(fileName);
        this.button.addEventListener("click", this._openCallback);

        this.closeButton = ViewObjectCreator.createTabBarButton("close", ".\\..\\..\\image\\close.png");
        this.closeButton.addEventListener("click", (e) => {
            e.stopPropagation();
            this._closeCallback();
        });

        this.headDiv.appendChild(this.button);
        this.headDiv.appendChild(this.closeButton);
    }

    getElement(): HTMLDivElement {
        return this.headDiv;
    }

    updateName(newName: string): void {
        if (this.button) {
            this.button.innerText = newName;
        }
    }

    setActive(isActive: boolean): void {
        if (this.button) {
            this.button.classList.toggle("activeTab", isActive);
            this.button.classList.toggle("inactiveTab", !isActive);
        }
    }

    destroy(): void {
        this.button?.removeEventListener("click", this._openCallback);
        this.closeButton?.removeEventListener("click", this._closeCallback);
        this.headDiv?.remove();
    }
}

// Represents the logical Tab, linking FileNode, content (TABpage), and view (TabView)
export class TAB {
    fileNode: FileNode_EXC_I;
    tabPage: TABpage;
    tabView: TabView;
    ApplicationCreator: ApplciationIndex;

    private _handleRename: (details: { oldName: string, newName: string }) => void;
    private _handleDelete: () => void;
    _handleDeleteForManager?: () => void;

    constructor(
        fileNode: FileNode_EXC_I,
        tabPage: TABpage,
        tabView: TabView,
        applicationCreator: ApplciationIndex,
    ) {
        this.fileNode = fileNode;
        this.tabPage = tabPage;
        this.tabView = tabView;
        this.ApplicationCreator = applicationCreator;

        this._handleRename = ({ newName }) => this.handleFileRename(newName);
        this._handleDelete = () => this.handleFileDelete();

        if (typeof (this.fileNode as any).on === 'function') {
            (this.fileNode as any).on('renamed', this._handleRename);
        } else {
            console.warn("FileNode does not seem to be an EventEmitter in TAB constructor");
        }
    }

    private handleFileRename(newName: string): void {
        this.tabView.updateName(newName);
    }

    private handleFileDelete(): void {
        console.log(`File ${this.fileNode.getName()} deleted event received by TAB.`);
        this.cleanupListeners();
    }

    close(): void {
        this.fileNode.closeEditingState();
        this.cleanupListeners();
        this.tabView.destroy();
    }

    open(): void {
        this.fileNode.openEditingState();
    }

    save(): void {
        this.tabPage.tabapplication.saveText();
    }

    getTabContentElement(): HTMLDivElement {
        return this.tabPage.contentDiv;
    }

    cleanupListeners(): void {
        if (typeof (this.fileNode as any).off === 'function') {
            (this.fileNode as any).off('renamed', this._handleRename);
        } else {
            console.warn("FileNode does not seem to be an EventEmitter in TAB cleanupListeners");
        }
    }

    hasUrl(url: string): boolean {
        return this.fileNode.getUrl() === url;
    }

    wasCreatedBy(appIndex: ApplciationIndex): boolean {
        return this.ApplicationCreator.url === appIndex.url;
    }
}

// Main Tab Manager Implementation
export class TabManager implements ITabManager {

    private baseTabManagerDiv: HTMLDivElement;
    private headTabManagerDiv: HTMLDivElement;
    private headTabContentDiv: HTMLDivElement;
    private mainTabManagerDiv: HTMLDivElement;
    private footTabManagerDiv: HTMLDivElement;
    private tabList: TAB[];
    private settings: ISettings;
    private uiEventService: IuiEventService;

    constructor(
        @IuiEventService uiEventService: IuiEventService,
        @ISettings settings: ISettings
    ) {
        this.settings = settings;
        this.uiEventService = uiEventService;
        this.tabList = [];
        this.setupDOM();
        this.registerUIEvents();
    }

    private setupDOM(): void {
        this.baseTabManagerDiv = document.createElement("div");
        this.baseTabManagerDiv.classList.add("baseTabManagerTable");
        this.headTabManagerDiv = document.createElement("div");
        this.headTabManagerDiv.classList.add("headTabManager");
        this.headTabContentDiv = document.createElement("div");
        this.headTabContentDiv.classList.add("headTabContent");
        this.headTabManagerDiv.appendChild(this.headTabContentDiv);
        this.mainTabManagerDiv = document.createElement("div");
        this.mainTabManagerDiv.classList.add("mainTabManager");
        this.footTabManagerDiv = document.createElement("div");
        this.footTabManagerDiv.classList.add("footTabManager");
        this.baseTabManagerDiv.appendChild(this.headTabManagerDiv);
        this.baseTabManagerDiv.appendChild(this.mainTabManagerDiv);
        this.baseTabManagerDiv.appendChild(this.footTabManagerDiv);
    }

    private registerUIEvents(): void {
        this.uiEventService.on(APPUIEvent.FileSave, this.saveCurrentFile.bind(this));
        this.uiEventService.on(APPUIEvent.saveAll, this.saveAllFiles.bind(this));
        this.uiEventService.on(APPUIEvent.CloseOpenFiles, this.closeAllTabs.bind(this));
        this.uiEventService.on(APPUIEvent.FileOpenInEditor, this.askApplication.bind(this));
        this.uiEventService.on(APPUIEvent.FileOpenWithSpezApplication, this.createSpecificTab.bind(this));
    }

    getHtmlElement(): HTMLDivElement {
        return this.baseTabManagerDiv;
    }

    private askApplication(fileNode: FileNode_EXC_I): void {
        this.clearMainTabManagerDiv();
        this.uiEventService.trigger(APPUIEvent.Info, `Displaying application selection for: ${fileNode.getName()}`);

        try {
            this.settings.reloadSettings();
            const applications = this.settings.getApplications();

            if (!applications || applications.length === 0) {
                this.uiEventService.trigger(APPUIEvent.Warning, "No applications found in settings.");
                return;
            }

            applications.forEach(app => {
                if (app.aktiv === "True") {
                    const appDiv = document.createElement("div");
                    appDiv.innerText = `Open with ${app.name}`;
                    appDiv.classList.add("selectable", "rightClickMenu");
                    appDiv.addEventListener("click", () => {
                        this.uiEventService.trigger(APPUIEvent.Info, `Selected application ${app.name} for ${fileNode.getName()}`);
                        const appIndex = new ApplciationIndex(app.url);
                        this.createTabForFile(fileNode, appIndex);
                    });
                    this.mainTabManagerDiv.appendChild(appDiv);
                }
            });

        } catch (error) {
            this.uiEventService.trigger(APPUIEvent.Error, `Error displaying application selection: ${error}`);
        }
    }

    private createSpecificTab(payload: { fileNode: FileNode_EXC_I, urlToApp: string }): void {
        const { fileNode, urlToApp } = payload;
        if (!fileNode || !urlToApp) {
            this.uiEventService.trigger(APPUIEvent.Error, `Invalid payload for createSpecificTab: ${JSON.stringify(payload)}`);
            return;
        }
        const appIndex = new ApplciationIndex(urlToApp);
        this.createTabForFile(fileNode, appIndex);
    }

    async createTabForFile(fileNode: FileNode_EXC_I, applicationCreator?: ApplciationIndex): Promise<void> {
        if (!applicationCreator) {
            this.askApplication(fileNode);
            return;
        }

        this.uiEventService.trigger(APPUIEvent.Info, `Attempting to create/open tab for ${fileNode.getName()} with app ${applicationCreator.url}`);

        const existingTab = this.findTab(fileNode.getUrl(), applicationCreator);

        if (existingTab) {
            this.uiEventService.trigger(APPUIEvent.Info, "Tab already exists, focusing.");
            this.openTab(existingTab);
        } else {
            this.uiEventService.trigger(APPUIEvent.Info, "Creating new tab.");
            try {
                const text = await fileNode.getFileText();
                this.addTab(fileNode, text, applicationCreator);
            } catch (error) {
                this.uiEventService.trigger(APPUIEvent.Error, `Error fetching file content for ${fileNode.getName()}: ${error}`);
                this.uiEventService.trigger(APPUIEvent.Error, `Failed to load file: ${fileNode.getName()}`);
            }
        }
    }

    private addTab(fileNode: FileNode_EXC_I, text: string, applicationCreator: ApplciationIndex): void {
        this.clearMainTabManagerDiv();

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("fileEditor", "inactiveMainTab");
        contentDiv.style.display = 'none';

        const frameAppCreator = new FrameAppCreator();
        const storeFunction = (newText: string) => {
            this.uiEventService.trigger(APPUIEvent.Info, `Saving text for ${fileNode.getName()}`);
            fileNode.saveText(newText);
        };
        const tabApplication: TABApplication = frameAppCreator.createApplication(contentDiv, text, applicationCreator, storeFunction);
        const tabPage = new TABpage(contentDiv, tabApplication);

        const tabView = new TabView(
            fileNode.getName(),
            () => this.openTab(tab),
            () => this.removeTab(tab)
        );

        const tab = new TAB(fileNode, tabPage, tabView, applicationCreator);

        this.headTabContentDiv.appendChild(tabView.getElement());
        this.mainTabManagerDiv.appendChild(tabPage.contentDiv);
        this.tabList.push(tab);

        const handleDelete = () => {
            this.uiEventService.trigger(APPUIEvent.Info, `File ${fileNode.getName()} deleted event received, removing tab.`);
            this.removeTab(tab);
        };
        tab._handleDeleteForManager = handleDelete;

        if (typeof (fileNode as any).on === 'function') {
            (fileNode as any).on('deleted', handleDelete); // Fix: Use the local variable fileNode
        } else {
            this.uiEventService.trigger(APPUIEvent.Warning, "FileNode does not seem to be an EventEmitter in TabManager addTab");
        }

        this.openTab(tab);
    }

    removeTab(tabToRemove: TAB): void {
        const index = this.tabList.indexOf(tabToRemove);
        if (index === -1) {
            this.uiEventService.trigger(APPUIEvent.Warning, `Attempted to remove a tab that is not in the list: ${tabToRemove.fileNode?.getName()}`);
            return;
        }

        this.uiEventService.trigger(APPUIEvent.Info, `Removing tab for: ${tabToRemove.fileNode.getName()}`);

        if (tabToRemove._handleDeleteForManager && typeof (tabToRemove.fileNode as any).off === 'function') {
            (tabToRemove.fileNode as any).off('deleted', tabToRemove._handleDeleteForManager);
        }

        tabToRemove.close();

        const tabContent = tabToRemove.getTabContentElement();
        if (tabContent) {
            tabContent.remove();
        }

        this.tabList.splice(index, 1);

        this.uiEventService.trigger(APPUIEvent.Info, `Tab removed. Remaining tabs: ${this.tabList.length}`);

        if (this.tabList.length > 0) {
            const wasActive = tabToRemove.tabView.getElement().classList.contains("activeTab");
            if (wasActive) {
                this.openTab(this.tabList[Math.max(0, index - 1)]);
            }
        } else {
            this.clearMainTabManagerDiv();
        }
    }

    private openTab(tabToOpen: TAB): void {
        if (!this.tabList.includes(tabToOpen)) {
            this.uiEventService.trigger(APPUIEvent.Warning, `Attempted to open a tab that is not managed: ${tabToOpen.fileNode?.getName()}`);
            return;
        }
        this.uiEventService.trigger(APPUIEvent.Info, `Opening tab: ${tabToOpen.fileNode.getName()}`);

        this.tabList.forEach(tab => {
            const isActive = tab === tabToOpen;
            tab.tabView.setActive(isActive);
            tab.tabPage.setActive(isActive);
            if (isActive) {
                tab.open();
            }
        });

        this.clearMainTabManagerDiv();
        this.tabList.forEach(tab => {
            this.mainTabManagerDiv.appendChild(tab.getTabContentElement());
        });
    }

    private findTab(url: string, applicationCreator: ApplciationIndex): TAB | undefined {
        return this.tabList.find(tab => tab.hasUrl(url) && tab.wasCreatedBy(applicationCreator));
    }

    private getActiveTab(): TAB | undefined {
        return this.tabList.find(tab => tab.tabView.getElement()?.classList.contains("activeTab"));
    }

    closeAllTabs(): void {
        this.uiEventService.trigger(APPUIEvent.Info, "Closing all tabs.");
        while (this.tabList.length > 0) {
            this.removeTab(this.tabList[this.tabList.length - 1]);
        }
    }

    saveAllFiles(): void {
        this.uiEventService.trigger(APPUIEvent.Info, "Saving all open files.");
        this.tabList.forEach(tab => tab.save());
        this.uiEventService.trigger(APPUIEvent.Info, "All files saved.");
    }

    saveCurrentFile(): void {
        const activeTab = this.getActiveTab();
        if (activeTab) {
            this.uiEventService.trigger(APPUIEvent.Info, `Saving current file: ${activeTab.fileNode.getName()}`);
            activeTab.save();
            this.uiEventService.trigger(APPUIEvent.Info, `${activeTab.fileNode.getName()} saved.`);
        } else {
            this.uiEventService.trigger(APPUIEvent.Info, "No active tab to save.");
        }
    }

    private clearMainTabManagerDiv(): void {
        const activeContent = this.mainTabManagerDiv.querySelector('.activeMainTab');
        if (!activeContent) {
            while (this.mainTabManagerDiv.firstChild) {
                this.mainTabManagerDiv.removeChild(this.mainTabManagerDiv.firstChild);
            }
        } else {
            while (this.mainTabManagerDiv.firstChild && !this.mainTabManagerDiv.firstChild.isSameNode(activeContent)) {
                this.mainTabManagerDiv.removeChild(this.mainTabManagerDiv.firstChild);
            }
            let nextSibling = activeContent.nextSibling;
            while (nextSibling) {
                this.mainTabManagerDiv.removeChild(nextSibling);
                nextSibling = activeContent.nextSibling;
            }
        }
    }
}