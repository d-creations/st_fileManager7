import { EditorControlerAdapter } from "../Domain/EditorContollerAdapter.js"
import { FileNode } from "../Domain/FileNode.js"
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
        
        this.innerText = this.editor.getStorageName(this.fileNode);
    }

    public fileNode : FileNode
    private tabCreator : TabCreator
    constructor(fileNode : FileNode,editor : EditorControlerAdapter,tabCreator : TabCreator, spaceLeft : number){
        super(editor,fileNode)
        this.fileNode = fileNode
        this.tabCreator = tabCreator

        this.contentEditable == "false";
        this.style.marginLeft = spaceLeft + "pt";
        this.classList.add("selectable");
        this.innerText = this.editor.getStorageName(this.fileNode);
        this.setAttribute("divname", "FOLDER bodydiv" + this.editor.getStorageName(this.fileNode));
        this.addEventListener("contextmenu", (e) => {
           let fileContextMenu = new ContextMenu(this);
           fileContextMenu.showMenu(e);
        });
        this.addEventListener("click", (e) => {
            let rightClickMenu = new FileLeftClickMenu(this);
            rightClickMenu.showMenu(e);
        });

    }
}