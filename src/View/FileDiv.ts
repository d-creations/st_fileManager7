import { EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces.js"
import { ApplicationSettings, Settings } from "../tecnicalServices/Settings.js"
import { ObservableI, ObserverI } from "../tecnicalServices/oberserver"
import { ContextMenu } from "./ContextMenu.js"
import { FileLeftClickMenu } from "./FileLeftClickMenu.js"
import { StorageDiv } from "./StorageDiv.js"
import { ApplciationIndex } from "./TabManager/TabApplication"
import { TabCreator } from "./TabManager/TabCreator.js"

export interface FileDiv_I{
    openTabFileState(): void
    closeTabFileState(): void
    getUrl()
    saveText(text: string)
    openFile(createApplication : ApplciationIndex)
    setEditable(state : string)
    getFileText() :Promise<String |unknown>
    getName():string
    getFileIsDeleted():boolean
    addObserver( observer : ObserverI) 
    
}


export class FileDiv extends StorageDiv implements FileDiv_I, ObservableI{




    public fileNode : FileNode_EXC_I
    private tabCreator : TabCreator
    private obervers: Array<ObserverI>
    private fileTabOpenState : boolean
    private settings : Settings

    
    constructor(fileNode: FileNode_EXC_I, editor: EditorControlerAdapter_EXC_I, tabCreator: TabCreator, settings: Settings) {
        super(editor, fileNode)
        this.fileTabOpenState = true
        this.obervers = []
        this.fileNode = fileNode
        this.tabCreator = tabCreator
        this.settings = settings
        this.contentEditable = "false";
        this.classList.add("selectable");
        this.classList.add("directoryDiv")

        this.draggable = true; // Enable dragging
        this.style.userSelect = "text"; // Allow text selection
        this.innerText = this.editor.getStorageName(this.fileNode);
        this.setAttribute("divname", "FOLDER bodydiv" + this.editor.getStorageName(this.fileNode));
        this.addEventListener("contextmenu", (e) => {
            let fileContextMenu = new ContextMenu(this);
            fileContextMenu.showMenu(e);
        });

        this.addEventListener("click", (e) => {
            console.log("click left");
            if (e.target instanceof HTMLDivElement && e.target.contentEditable == "false") {
                let rightClickMenu = new FileLeftClickMenu(this, settings);
                rightClickMenu.showMenu(e);
            }
        });
        this.addEventListener("dragstart", (e) => {
            // Delay the start of the drag operation
            e.dataTransfer?.clearData();

                this.editor.cutStorage(this.fileNode); // Set the cut state for the file
                const fileUrl = this.getUrl(); // Get the file URL

                // Provide a real file path for the drag operation
                const realFilePath = this.getUrl(); // Assuming this method exists
                e.dataTransfer?.setData("DownloadURL", `application/octet-stream:${this.getName()}:${realFilePath}`);
                e.dataTransfer?.setData("text/uri-list", realFilePath);

                // Set internal cut state
                e.dataTransfer?.setData("application/x-internal-cut", "true");

                console.log("dragstart");
                console.log(fileUrl);
                console.log(this.getName());

            // Clear timeout if drag is cancelled
            this.addEventListener("dragend", () => {
            }, { once: true }); // Remove the event listener after it's executed
        });

    }



    openTabFileState(): void {
        this.fileTabOpenState = false
    }
    closeTabFileState(): void {
        this.fileTabOpenState = true
    }

    isManipulable() : boolean{
        return this.fileTabOpenState
    }


    getFileIsDeleted(): boolean{
        return this.fileNode.isDeleted()
    }


    getFileText() :Promise<String |unknown>{
        return this.editor.getFileText(this.fileNode)
    }
    public getUrl() {
        return this.editor.getStorageUrl(this.fileNode)
    }
    public saveText(text: string) {
        this.editor.saveFile(this.fileNode,text)
    }
    
    public openFile(createApplication : ApplciationIndex) {
        this.tabCreator.createTab(this , createApplication)
    }

    public openFileWithSelector() {
        let rightClickMenu = new FileLeftClickMenu(this,this.settings);
        rightClickMenu.showSimpleMenu();
    }

    setEditable(state : string){
        this.contentEditable = state
    }


    public updateThisDiv(): void {
        console.log("update File Div")
        this.innerText = this.editor.getStorageName(this.fileNode);
        this.observerUpdated()
    }


  
    public addObserver( observer : ObserverI) {
        this.obervers.push(observer);
    }  
 
    public observerUpdated(){
        for(let observer of this.obervers){
            observer.oberverUpdate()
        }
    }
}