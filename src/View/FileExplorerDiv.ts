
import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces.js"
import { DirectoryDiv } from "./DirectoryDiv.js"
import { FileDiv } from "./FileDiv.js"
import { StorageDiv } from "./StorageDiv.js"
import { TabManager_I } from "./TabManager/TabManager.js"





export class FileExplorerDiv extends HTMLDivElement implements FileManager_I{
    private tabManager : TabManager_I
    private rootStorageDiv : StorageDiv
    private editor : EditorControlerAdapter_EXC_I
    constructor(tabManager :TabManager_I,editor : EditorControlerAdapter_EXC_I){
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
        ret.then(function(directoryNode : DirectoryNode_EXC_I){
            localfileManager.rootStorageDiv = new DirectoryDiv(directoryNode,localfileManager.editor,localfileManager.tabManager.getTabCreator())
            localfileManager.updateElement()
            
        })

    }updateElement() {
        while(this.firstChild){
            this.removeChild(this.firstChild)
        }
        this.appendChild(this.rootStorageDiv)
        
    }

    
    
    public async saveCurrentFile () {
        this.tabManager.saveCurrentFile()
    }

    public async saveAllFile () {
        this.tabManager.saveAllFile()
    }
    public async openFile () {
        let ret = this.editor.openFile()
        let fileDiv = this
        ret.then(function(file : FileNode_EXC_I) {

            fileDiv.rootStorageDiv = new FileDiv(file,fileDiv.editor,fileDiv.tabManager.getTabCreator())
            fileDiv.updateElement()
            
        })
    };

}