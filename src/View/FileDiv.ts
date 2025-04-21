import { EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces.js"
import { InstantiationService } from "../tecnicalServices/instantiation/InstantiationService.js"
import { ContextMenu } from "./ContextMenu.js"
import { FileLeftClickMenu } from "./FileLeftClickMenu.js"
import { StorageDiv } from "./StorageDiv.js"
import { ApplciationIndex } from "./TabManager/TabApplication"
import { TabCreator } from "./TabManager/TabCreator.js"

// Interface no longer needs to extend EventEmitter
export interface FileDiv_I {
    openTabFileState(): void
    closeTabFileState(): void
    getUrl()
    saveText(text: string)
    openFile(createApplication : ApplciationIndex)
    setEditable(state : string)
    getFileText() :Promise<string |unknown>
    getName():string
    getFileIsDeleted():boolean
}

// FileDiv now inherits EventEmitter capabilities from StorageDiv
export class FileDiv extends StorageDiv implements FileDiv_I {

    public fileNode : FileNode_EXC_I
    private tabCreator : TabCreator
    private fileTabOpenState : boolean
    private instantiationService : InstantiationService

    constructor(fileNode: FileNode_EXC_I, editor: EditorControlerAdapter_EXC_I, tabCreator: TabCreator, instantiationService : InstantiationService) {
        super(editor, fileNode) // Calls StorageDiv constructor which handles emitter and listeners
        this.fileTabOpenState = true
        this.fileNode = fileNode // Already assigned in StorageDiv, but keep for specific type
        this.tabCreator = tabCreator
        this.instantiationService = instantiationService
        this.contentEditable = "false";
        this.classList.add("selectable");
        this.classList.add("directoryDiv") // Should this be fileDiv?
        this.innerText = this.fileNode.getName()
        this.draggable = true;
        this.style.userSelect = "text";
        this.setAttribute("divname", `FILE bodydiv${this.editor.getStorageName(this.fileNode)}`);

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.addEventListener("contextmenu", (e) => {
            let fileContextMenu = new ContextMenu(this);
            fileContextMenu.showMenu(e);
        });

        this.addEventListener("click", (e) => {
            console.log("click left");
            if (e.target instanceof HTMLDivElement && e.target.contentEditable == "false") {
                let rightClickMenu = new FileLeftClickMenu(this, this.instantiationService);
                rightClickMenu.showMenu(e);
            }
        });

        this.addEventListener("dragstart", (e) => {
            e.dataTransfer?.clearData();
            this.editor.cutStorage(this.storageNode);
            const realFilePath = this.getUrl();
            e.dataTransfer?.setData("DownloadURL", `application/octet-stream:${this.getName()}:${realFilePath}`);
            e.dataTransfer?.setData("text/uri-list", realFilePath);
            e.dataTransfer?.setData("application/x-internal-cut", "true");
            console.log("dragstart", realFilePath, this.getName());
        });

        this.addEventListener("dblclick", () => {
            this.openFileWithSelector();
        });
    }

    openTabFileState(): void {
        this.fileTabOpenState = false
    }

    closeTabFileState(): void {
        this.fileTabOpenState = true
    }

    isManipulable() : boolean {
        return this.fileTabOpenState
    }

    getFileIsDeleted(): boolean {
        return typeof (this.storageNode as any).isDeleted === 'function' ? (this.storageNode as any).isDeleted() : false;
    }

    getFileText() :Promise<string |unknown> {
        if (typeof (this.storageNode as any).getFileText === 'function') {
            return (this.storageNode as any).getFileText();
        } else {
            console.error("getFileText not available on storageNode");
            return Promise.reject("getFileText not available");
        }
    }

    public getUrl() {
        if (typeof (this.storageNode as any).getUrl === 'function') {
            return (this.storageNode as any).getUrl();
        } else {
            console.error("getUrl not available on storageNode");
            return null; // Return null or appropriate default
        }
    }

    public saveText(text: string) {
        if (typeof (this.storageNode as any).saveFile === 'function') {
            (this.storageNode as any).saveFile(text);
        } else {
            console.error("saveFile not available on storageNode");
        }
    }

    public openFile(createApplication : ApplciationIndex) {
        this.tabCreator.createTab(this , createApplication)
    }

    public openFileWithSelector() {
        let rightClickMenu = new FileLeftClickMenu(this,this.instantiationService);
        rightClickMenu.showSimpleMenu();
    }

    public updateThisDiv(): void {
        super.updateThisDiv(); // Call parent method to update name
        console.log("update File Div specific logic (if any)")
    }
}
customElements.define("file-div", FileDiv, { extends: "div" });