import { DirectoryNode } from "../Domain/DirectoryNode.js"
import { EditorControlerAdapter } from "../Domain/EditorContollerAdapter.js"
import { FileNode } from "../Domain/FileNode.js"
import { DirectoryDiv } from "./DirectoryDiv.js"
import { FileDiv } from "./FileDiv.js"
import { StorageDiv } from "./StorageDiv.js"
import { TabManager_I } from "./TabManager/TabManager.js"





export class FileExplorerDiv extends HTMLDivElement implements FileManager_I{
    private tabManager : TabManager_I
    private rootStorageDiv : StorageDiv
    private editor : EditorControlerAdapter
    constructor(tabManager :TabManager_I,editor : EditorControlerAdapter){
        super()
        this.editor = editor
        this.tabManager = tabManager
    }

    public openFolder () {
        console.log("openDirectory")
        
        this.tabManager.closeAllTabs()
        
        let localfileManager = this
        let ret =this.editor.openDirectory()
        console.log("return form "+ ret)
        ret.then(function(directoryNode){
            if(directoryNode instanceof DirectoryNode){
            localfileManager.rootStorageDiv = new DirectoryDiv(directoryNode,localfileManager.editor,localfileManager.tabManager.getTabCreator(),0)
            localfileManager.updateElement()
            }   
        })

    }updateElement() {
        this.rootStorageDiv.updateElement()
        while(this.firstChild){
            this.removeChild(this.firstChild)
        }
        this.appendChild(this.rootStorageDiv)
    }
;

    
    
    public async saveCurrentFile () {
        this.tabManager.saveCurrentFile()
    }

    public async saveAllFile () {
        this.tabManager.saveAllFile()
    }
    public async openFile () {
        let ret = this.editor.openFile()
        let fileDiv = this
        ret.then(function(file) {
            if(file instanceof FileNode){
            fileDiv.rootStorageDiv = new FileDiv(file,fileDiv.editor,fileDiv.tabManager.getTabCreator(),0)
            fileDiv.updateElement()
            }
        })
    };

}