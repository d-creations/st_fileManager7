import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces";
import { TabCreator } from "./TabManager/TabCreator.js";
import { ContextMenu } from "./ContextMenu.js";
import { FileDiv } from "./FileDiv.js";
import { StorageDiv } from "./StorageDiv.js";
import { ApplicationSettings, Settings } from "../tecnicalServices/Settings";

export class DirectoryHeadDiv extends StorageDiv {
    public stateOpen: boolean;
    private directoryNode: DirectoryNode_EXC_I;
    private symbole: HTMLDivElement;
    public nameDiv: HTMLDivElement;

    constructor(directoryNode: DirectoryNode_EXC_I, editor: EditorControlerAdapter_EXC_I) {
        super(editor, directoryNode);
        this.innerText = "";
        this.directoryNode = directoryNode;
        this.symbole = document.createElement("div");
        this.appendChild(this.symbole);
        this.symbole.contentEditable = "false";
        this.symbole.innerText = "> ";
        this.symbole.classList.add("inline");
        this.symbole.contentEditable = "false";

        this.nameDiv = document.createElement("div");
        this.appendChild(this.nameDiv);
        this.nameDiv.contentEditable = "false";
        this.nameDiv.innerText = this.editor.getStorageName(this.directoryNode);
        this.nameDiv.classList.add("inline");
        this.directoryNode.addObserver(this);
    }

    updateElement() {
        if (!this.stateOpen) {
            this.symbole.innerText = "> ";
        } else {
            this.symbole.innerText = "v ";
        }
    }

    getName() {
        return this.nameDiv.innerText;
    }

    setName(name: string) {
        this.nameDiv.innerText = name;
        return;
    }

    setEditable(state: string) {
        this.nameDiv.contentEditable = state;
    }

    public oberverUpdate(): void {
        console.log("FS update");
        this.setName(this.editor.getStorageName(this.directoryNode));
    }
}

export class DirectoryDiv extends StorageDiv {
    private directoryHeadDiv: DirectoryHeadDiv;
    private directoryBodyDiv: HTMLDivElement;
    private directoryNode: DirectoryNode_EXC_I;
    private tabCreator: TabCreator;
    private settings: Settings;

    constructor(directoryNode: DirectoryNode_EXC_I, editor: EditorControlerAdapter_EXC_I, tabCreator: TabCreator, settings: Settings) {
        super(editor, directoryNode);
        this.tabCreator = tabCreator;
        this.settings = settings;
        let self = this;
        this.directoryHeadDiv = new DirectoryHeadDiv(directoryNode, editor);
        this.directoryBodyDiv = document.createElement("div");
        this.directoryNode = directoryNode;
        this.directoryNode.addObserver(this);

        this.directoryHeadDiv.nameDiv.contentEditable = "false";
        this.directoryHeadDiv.setAttribute("divname", "FOLDER HEADDIV" + this.editor.getStorageName(directoryNode));
        this.directoryHeadDiv.classList.add("selectable");
        this.directoryBodyDiv = document.createElement("div");
        this.directoryBodyDiv.setAttribute("divname", "FOLDER bodydiv" + this.editor.getStorageName(directoryNode));

        this.directoryHeadDiv.addEventListener("click", (e) => {
            console.log("click");
            if (e.target instanceof HTMLDivElement && e.target.contentEditable == "false") {
                if (self.directoryHeadDiv.stateOpen) self.closeDirectory();
                else self.openDirectory();
            }
        });
        this.directoryHeadDiv.addEventListener("contextmenu", (e) => {
            let fileContextMenu = new ContextMenu(self.directoryHeadDiv);
            fileContextMenu.showMenu(e);
        });
        this.createDiv();
        this.closeDirectory();
    }

    openDirectory() {
        this.directoryHeadDiv.stateOpen = true;
        this.editor.updateFileTree(this.directoryNode);
        this.updateDiv();
        this.directoryHeadDiv.updateElement();
        this.directoryBodyDiv.style.display = "block";
    }

    closeDirectory() {
        this.directoryHeadDiv.stateOpen = false;
        this.directoryHeadDiv.updateElement();
        this.directoryBodyDiv.style.display = "none";
    }

    getName() {
        return this.directoryHeadDiv.nameDiv.innerText;
    }

    setName(name: string) {
        this.directoryHeadDiv.nameDiv.innerText = name;
    }

    setEditable(state: string) {
        this.directoryHeadDiv.nameDiv.contentEditable = state;
    }

    oberverUpdate(): void {
        this.updateDiv();
    }

    updateDiv(): void {
        console.log("directory div update");
        this.editor.getFileTree(this.directoryNode).then(fileTree => {
            let files: Array<FileNode_EXC_I> = fileTree.files;
            let dirs: Array<DirectoryNode_EXC_I> = fileTree.dirs;
            dirs.forEach(dir => {
                if (this.bodyNotContainDirChild(dir)) this.insertDirectoryDiv(dir);
            });
            files.forEach(file => {
                if (this.bodyNotContainFileChild(file)) this.insertFileDiv(file);
            });
            this.directoryBodyDiv.childNodes.forEach((directoryDiv) => {
                if (directoryDiv instanceof DirectoryDiv) {
                    if (!dirs.includes(directoryDiv.directoryNode)) this.directoryBodyDiv.removeChild(directoryDiv);
                } else if (directoryDiv instanceof FileDiv) {
                    if (!files.includes(directoryDiv.fileNode)) this.directoryBodyDiv.removeChild(directoryDiv);
                }
            });
        }).catch(error => {
            console.error("Failed to update directory div:", error);
        });
    }

    bodyNotContainDirChild(dir: DirectoryNode_EXC_I): boolean {
        for (let directoryBodyDiv of this.directoryBodyDiv.childNodes) {
            if (directoryBodyDiv instanceof DirectoryDiv && directoryBodyDiv.directoryNode == dir) return false;
        }
        return true;
    }

    bodyNotContainFileChild(file: FileNode_EXC_I): boolean {
        for (let directoryBodyDiv of this.directoryBodyDiv.childNodes) {
            if (directoryBodyDiv instanceof FileDiv && directoryBodyDiv.fileNode == file) return false;
        }
        return true;
    }

    insertDirectoryDiv(dir: DirectoryNode_EXC_I) {
        let insert = false;
        let fileDiv = new DirectoryDiv(dir, this.editor, this.tabCreator, this.settings);
        for (let i = 0; i < this.directoryBodyDiv.childNodes.length; i++) {
            let item = this.directoryBodyDiv.childNodes.item(i);
            if (item instanceof DirectoryDiv && item.getName() > fileDiv.getName()) {
                this.directoryBodyDiv.insertBefore(fileDiv, item);
                insert = true;
            }
        }
        if (!insert) this.directoryBodyDiv.appendChild(fileDiv);
    }

    insertFileDiv(file: FileNode_EXC_I) {
        let insert = false;
        let fileDiv = new FileDiv(file, this.editor, this.tabCreator, this.settings);
        for (let i = 0; i < this.directoryBodyDiv.childNodes.length; i++) {
            let item = this.directoryBodyDiv.childNodes.item(i);
            if (!insert && item instanceof FileDiv && item.getName() > fileDiv.getName()) {
                this.directoryBodyDiv.insertBefore(fileDiv, item);
                insert = true;
                return;
            } else if (item instanceof DirectoryDiv && !insert) {
                this.directoryBodyDiv.insertBefore(fileDiv, item);
                insert = true;
            }
        }
        if (!insert) this.directoryBodyDiv.appendChild(fileDiv);
    }

    createDiv(): void {
        this.innerText = this.editor.getStorageName(this.directoryNode);
        console.log("directory div created");
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        while (this.directoryBodyDiv.firstChild) {
            this.directoryBodyDiv.removeChild(this.directoryBodyDiv.firstChild);
        }
        this.appendChild(this.directoryHeadDiv);
        this.appendChild(this.directoryBodyDiv);
        this.classList.add("directoryDiv");
        this.directoryHeadDiv.updateElement();
        if (this.directoryHeadDiv.stateOpen) {
            this.editor.getFileTree(this.directoryNode).then(fileTree => {
                for (let file of fileTree.files) {
                    this.insertFileDiv(file);
                }
                for (let dir of fileTree.dirs) {
                    this.insertDirectoryDiv(dir);
                }
            }).catch(error => {
                console.error("Failed to create directory div:", error);
            });
        }
    }
}