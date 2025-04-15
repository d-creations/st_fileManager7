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
            let dragTimeout = setTimeout(() => {
                this.editor.cutStorage(this.fileNode); // Set the cut state for the file
                const fileUrl = this.getUrl(); // Get the file URL
                e.dataTransfer?.setData("text/plain", fileUrl); // Set the URL as plain text
                e.dataTransfer?.setData("source", "fileDiv");

                // Provide a real file path for the drag operation
                if (true) {
                    const realFilePath = this.getUrl() // Assuming this method exists
                    e.dataTransfer?.setData("DownloadURL", `application/octet-stream:${this.getName()}:${realFilePath}`);
                }

                console.log("dragstart");
                console.log(fileUrl);
                console.log(this.getName());

                // Create an offscreen canvas for the drag image
                const dragImage = document.createElement("canvas");
                const text = this.getName();
                const ctx2 = document.createElement("canvas").getContext('2d');
                if(ctx2){
                    ctx2.font = "12px Arial";
                    const textWidth = ctx2.measureText(text).width;
                    dragImage.width = textWidth + 20;
                }
                
                dragImage.height = 12; // Increased height
                const ctx = dragImage.getContext("2d");
                if (ctx) {
                    ctx.fillStyle = "lightgray";
                    ctx.fillRect(0, 0, dragImage.width, dragImage.height);
                    ctx.fillStyle = "black";
                    ctx.font = "12px Arial";

                    // Display the file name and URL on the drag image
                    const fileName = this.getName();
                    ctx.fillText(fileName, 10, 15); // File name at the top
                }
                //e.dataTransfer?.setDragImage(dragImage, 0, 0);
            }, 200); // Delay of 200 milliseconds

            // Clear timeout if drag is cancelled
            this.addEventListener("dragend", () => {
                clearTimeout(dragTimeout);
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