import { ApplicationCreator_I } from "../Applications/Application_I"
import { EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces.js"
import { ObservableI, Observer } from "../tecnicalServices/oberserver"
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
    oberverUpdate(): void
    getFileText() :Promise<String |unknown>
    getName():string
    getFileIsDeleted():boolean
    addObserver( observer : Observer) 
    
}


export class FileDiv extends StorageDiv implements FileDiv_I,ObservableI{



    public fileNode : FileNode_EXC_I
    private tabCreator : TabCreator
    private obervers: Array<Observer>
    private fileTabOpenState : boolean

    
    constructor(fileNode : FileNode_EXC_I,editor : EditorControlerAdapter_EXC_I,tabCreator : TabCreator){
        super(editor,fileNode)
        this.fileTabOpenState = true
        this.obervers = []
        this.fileNode = fileNode
        this.tabCreator = tabCreator
        this.fileNode.addObserver(this)

        this.contentEditable ="false";
        this.classList.add("selectable");
        this.classList.add("directoryDiv")
        
        this.innerText = this.editor.getStorageName(this.fileNode);
        this.setAttribute("divname", "FOLDER bodydiv" + this.editor.getStorageName(this.fileNode));
        this.addEventListener("contextmenu", (e) => {
           let fileContextMenu = new ContextMenu(this);
           fileContextMenu.showMenu(e);
        });

        this.addEventListener("click", (e) => {
            if(e.target instanceof HTMLDivElement && e.target.contentEditable == "false"){
            let rightClickMenu = new FileLeftClickMenu(this);
            rightClickMenu.showMenu(e);
            }
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



    setEditable(state : string){
        this.contentEditable = state
    }


    public oberverUpdate(): void {
        console.log("update File Div")
        this.innerText = this.editor.getStorageName(this.fileNode);
        this.observerUpdated()
    }


  
    public addObserver( observer : Observer) {
        this.obervers.push(observer);
    }  
 
    public observerUpdated(){
        for(let observer of this.obervers){
            observer.oberverUpdate()
        }
    }
}