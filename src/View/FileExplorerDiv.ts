import { FileManager_I } from "../Domain/Filemanager_I.js"
import { Settings } from "../tecnicalServices/Settings.js"
import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js"
import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces.js"
import { DirectoryDiv } from "./DirectoryDiv.js"
import { FileDiv } from "./FileDiv.js"
import { NaviMenu_I } from "./NaviManager/NaviMenu_I.js"
import { StorageDiv } from "./StorageDiv.js"
import { TabCreator } from "./TabManager/TabCreator.js"
import { TabManager_I } from "./TabManager/TabManager.js"

export class FileExplorerDiv extends HTMLDivElement implements FileManager_I, NaviMenu_I {

    private tabManager: TabManager_I
    private rootStorageDiv: StorageDiv
    private editor: EditorControlerAdapter_EXC_I
    private settings: Settings
    constructor(tabManager: TabManager_I, editor: EditorControlerAdapter_EXC_I) {
        super()
        this.editor = editor
        this.settings = new Settings(editor)
        this.tabManager = tabManager
        
    }

    private undo() {
        let that = this;   
        that.editor.undoFileOperation().then(()=>{
            that.rootStorageDiv.refreshStorageRekursiv().then(()=>{
                that.refreshView();
            })
        })

        }

    private createAHeadMenuDiv(): HTMLDivElement {
        let headMenuDiv = document.createElement('div');
        let that = this
        headMenuDiv.className = 'head-menu';
        let undoButton = ViewObjectCreator.createFileMenuButton("undo", ".\\..\\..\\image\\undo.png")
        undoButton.addEventListener('click', () => {
            that.undo();
        });
        headMenuDiv.appendChild(undoButton);
        return headMenuDiv;
    }

    getSettingFileDiv(tabCreator: TabCreator): FileDiv {
        return new FileDiv(this.editor.getSettingFileNode(), this.editor, tabCreator, this.settings)
    }


    getNaviHTMLDiv(): HTMLDivElement {
        return this
    }

    closeApplication(): void {
        this.editor.closeApplication()
    }

    private clearChildElements() {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
    }

    private initializeRootStorageDiv(directoryNode: DirectoryNode_EXC_I) {
        this.rootStorageDiv = new DirectoryDiv(
            directoryNode,
            this.editor,
            this.tabManager.getTabCreator(),
            this.settings
        );
    }

    public openFolder(): void {
        console.log("Opening directory...");
        // this.tabManager.closeAllTabs(); // Uncomment to test behavior when tabs are closed
        this.editor.openDirectory().then((directoryNode: DirectoryNode_EXC_I) => {
            this.initializeRootStorageDiv(directoryNode);
            this.refreshView();
        });
    }

    public refreshView() {
        this.clearChildElements();
        this.appendChild(this.createAHeadMenuDiv());
        this.appendChild(this.rootStorageDiv);
        this.rootStorageDiv.refreshStorageRekursiv();
    }

    public async saveCurrentFile() {
        this.tabManager.saveCurrentFile()
    }

    public async saveAllFile() {
        this.tabManager.saveAllFile()
    }
    public async openFile() {
        let self = this
        this.editor.openFile().then(function (file: FileNode_EXC_I) {
            let fileDiv = new FileDiv(file, self.editor, self.tabManager.getTabCreator(), self.settings)
            fileDiv.openFileWithSelector()
        })
    }

    openFileByUrl(url: string) {
        let self = this;
        this.editor.openFileByUrl(url).then(function (file: FileNode_EXC_I) {
            let fileDiv = new FileDiv(file, self.editor, self.tabManager.getTabCreator(), self.settings)
            fileDiv.openFileWithSelector()
        })

    }




}