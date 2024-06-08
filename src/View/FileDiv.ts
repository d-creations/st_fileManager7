import { EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces.js"
import { ContextMenu } from "./ContextMenu.js"
import { FileLeftClickMenu } from "./FileLeftClickMenu.js"
import { StorageDiv } from "./StorageDiv.js"
import { TabCreator } from "./TabManager/TabCreator.js"



export class FileDiv extends StorageDiv{
    getUrl() {
        return this.editor.getStorageUrl(this.fileNode)
    }
    saveText(text: string) {
        this.editor.saveFile(this.fileNode,text)
    }
    getName(): string {
        return this.editor.getStorageName(this.fileNode)
    }
    openFile() {
        this.tabCreator.createTab(this , this.editor)
    }

    public oberverUpdate(): void {
        console.log("FS update")
        this.innerText = this.editor.getStorageName(this.fileNode);
    }

    public fileNode : FileNode_EXC_I
    private tabCreator : TabCreator
    constructor(fileNode : FileNode_EXC_I,editor : EditorControlerAdapter_EXC_I,tabCreator : TabCreator){
        super(editor,fileNode)
        this.fileNode = fileNode
        this.tabCreator = tabCreator

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
}