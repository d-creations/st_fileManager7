import { ContextMenu } from "./ContextMenu.js";
import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_I, FileNode_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js"; // Added StorageNode2_EXC_I
import { StorageDiv } from "./StorageDiv.js";
import { FileDiv } from "./FileDiv.js";
import { TabCreator } from "./TabManager/TabCreator.js";
import { InstantiationService } from "../tecnicalServices/instantiation/InstantiationService.js";
import { FileNode } from "../Domain/FileNode.js";

export class DirectoryHeadDiv extends StorageDiv {
    private baseName: string;

    constructor(directoryNode: DirectoryNode_EXC_I, editor: EditorControlerAdapter_EXC_I, tabCreator: TabCreator, instantiationService: InstantiationService) {
        super(editor, directoryNode);
        this.baseName = this.editor.getStorageName(this.storageNode);
        this.updateDisplay(false); // Initial state is closed
        this.classList.add("directoryHeadDiv");
        this.classList.add("selectable");
        this.contentEditable = "false";
        this.draggable = true;
        this.style.userSelect = "text";
        this.setAttribute("divname", `DIR head ${this.editor.getStorageName(this.storageNode)}`);

        this.addEventListener("dragstart", (e) => {
            e.dataTransfer?.clearData();
            this.editor.cutStorage(this.storageNode);
            const realFilePath = this.editor.getStorageUrl(this.storageNode);
            e.dataTransfer?.setData("DownloadURL", `application/octet-stream:${this.getName()}:${realFilePath}`);
            e.dataTransfer?.setData("text/uri-list", realFilePath);
            e.dataTransfer?.setData("application/x-internal-cut", "true");
            console.log("dragstart", realFilePath, this.getName());
        });

        this.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (e.dataTransfer)
                e.dataTransfer.dropEffect = "move";
        });

    }

    updateDisplay(isExpanded: boolean): void {
        const prefix = isExpanded ? "v " : "> ";
        this.innerText = prefix + this.baseName;
    }
}

customElements.define("directory-head-div", DirectoryHeadDiv, { extends: "div" });

export class DirectoryDiv extends StorageDiv {
    public node: DirectoryNode_EXC_I;
    private directoryHeadDiv: DirectoryHeadDiv;
    private directoryBodyDiv: HTMLDivElement;
    private tabCreator: TabCreator;
    private instantiationService: InstantiationService;
    private isExpanded: boolean = false;

    constructor(directoryNode: DirectoryNode_EXC_I, editor: EditorControlerAdapter_EXC_I, tabCreator: TabCreator, instantiationService: InstantiationService) {
        super(editor, directoryNode);
        this.node = directoryNode;
        this.tabCreator = tabCreator;
        this.instantiationService = instantiationService;

        this.classList.add("directoryDiv");
        this.setAttribute("divname", `DIR bodydiv${this.editor.getStorageName(this.node)}`);

        this.directoryHeadDiv = new DirectoryHeadDiv(directoryNode, editor, tabCreator, instantiationService);
        this.directoryBodyDiv = document.createElement("div");
        this.directoryBodyDiv.classList.add("directoryBodyDiv");
        this.directoryBodyDiv.style.display = "none";

        this.appendChild(this.directoryHeadDiv);
        this.appendChild(this.directoryBodyDiv);

        this.setupEventListeners();
        this.attachDirectoryNodeListeners();
    }

    private setupEventListeners(): void {
        this.directoryHeadDiv.addEventListener("click", (e) => {
            if (this.directoryHeadDiv.contentEditable !== "true") {
                this.toggleExpand();
            }
        });

        this.directoryHeadDiv.addEventListener("contextmenu", (e) => {
            const contextMenu = new ContextMenu(this.directoryHeadDiv);
            contextMenu.showMenu(e);
        });

        this.directoryHeadDiv.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (e.dataTransfer)
                e.dataTransfer.dropEffect = "move";
        });

        this.directoryHeadDiv.addEventListener("drop", (e) => {
            e.preventDefault();
            console.log("drop on head");
            if (e.dataTransfer?.getData("application/x-internal-cut")) {
                this.insertStorage();
            }
            else if (e.dataTransfer?.files) {
                
                for(let i = 0; i < e.dataTransfer.files.length; i++) {
                    const file = e.dataTransfer.files[i];
                    console.log("File dropped:", file.name);
                    this.editor.openFileByUrl((file as any).path).then((filen) => {
                        if(filen instanceof FileNode) {
                        this.editor.copyStorage(filen).then(() => {
                            
                            console.log("File copied successfully.");
                        }
                        ).catch((error) => {
                            console.error("Error copying file:", error);
                        });
                    }
                    }
                    ).catch((error) => {
                        console.error("Error opening file:", error);
                    }
                    );
                        console.log("File created successfully.");
                    }
                }
            })
       
    }

    private attachDirectoryNodeListeners(): void {
        const eventNode = this.node as any;
        if (typeof eventNode.on === 'function') {
            eventNode.on('updated', this.handleNodeUpdate.bind(this));
            eventNode.on('child-added', this.handleChildAdded.bind(this));
            eventNode.on('child-removed', this.handleChildRemoved.bind(this));
        }
    }

    private handleNodeUpdate(details: { addedFiles: FileNode_EXC_I[], addedDirs: DirectoryNode_EXC_I[], removedFiles: FileNode_EXC_I[], removedDirs: DirectoryNode_EXC_I[] }): void {
        console.log(`DirectoryDiv (${this.getName()}): Node updated`, details);
        if (this.isExpanded) {
            this.renderChildren(details.addedFiles, details.addedDirs, details.removedFiles, details.removedDirs);
        }
    }

    private handleChildAdded(child: { name: string, type?: 'file' | 'directory' }): void {
        console.log(`DirectoryDiv (${this.getName()}): Child added`, child);
        if (this.isExpanded) {
            this.refreshContent();
        }
    }

    private handleChildRemoved(child: StorageDiv): void {
        console.log(`DirectoryDiv (${this.getName()}): Child removed`, child.getName());
        if (this.isExpanded) {
            const childDiv = this.directoryBodyDiv.querySelector(`[divname*="${child.getName()}"]`);
            childDiv?.remove();
        }
    }

    private toggleExpand(): void {
        this.isExpanded = !this.isExpanded;
        this.directoryHeadDiv.updateDisplay(this.isExpanded); // Update display based on new state
        this.directoryBodyDiv.style.display = this.isExpanded ? "block" : "none";
        if (this.isExpanded) {
            this.refreshContent();
        }
    }

    public refreshContent(): Promise<void> {
        console.log(`Refreshing content for ${this.getName()}`);
        this.directoryBodyDiv.innerHTML = '';
        return this.node.updateStorage().then(() => {
            this.renderChildren(this.node.getFiles(), this.node.getDirectories(), [], []);
        }).catch(error => {
            console.error(`Failed to refresh content for ${this.getName()}:`, error);
        });
    }

    refreshStorageRekursiv(): Promise<void> {
        return this.refreshContent().then(() => {
            const childDirs = Array.from(this.directoryBodyDiv.children)
                                   .filter(el => el instanceof DirectoryDiv) as DirectoryDiv[];
            return Promise.all(childDirs.map(child => child.refreshStorageRekursiv())).then(() => {});
        });
    }

    private renderChildren(
        addedFiles: FileNode_EXC_I[],
        addedDirs: DirectoryNode_EXC_I[],
        removedFiles: FileNode_EXC_I[],
        removedDirs: DirectoryNode_EXC_I[]
    ): void {
        console.log(`Rendering children for ${this.getName()}`);

        removedDirs.forEach(dirNode => {
            const divToRemove = Array.from(this.directoryBodyDiv.children)
                                     .find(el => (el as StorageDiv).storageNode === dirNode);
            divToRemove?.remove();
        });
        removedFiles.forEach(fileNode => {
            const divToRemove = Array.from(this.directoryBodyDiv.children)
                                     .find(el => (el as StorageDiv).storageNode === fileNode);
            divToRemove?.remove();
        });

        this.renderItems<DirectoryNode_EXC_I>(addedDirs, (dirNode) =>
            new DirectoryDiv(dirNode, this.editor, this.tabCreator, this.instantiationService)
        );
        this.renderItems<FileNode_EXC_I>(addedFiles, (fileNode) =>
            new FileDiv(fileNode, this.editor, this.tabCreator, this.instantiationService)
        );

        this.sortChildren();
    }

    private renderItems<T extends StorageNode2_EXC_I>(items: T[], createElement: (node: T) => StorageDiv): void {
        items.forEach(item => {
            const existingDiv = Array.from(this.directoryBodyDiv.children)
                                     .find(el => (el as StorageDiv).storageNode === item);
            if (!existingDiv) {
                const element = createElement(item);
                this.directoryBodyDiv.appendChild(element);
            }
        });
    }

    private sortChildren(): void {
        const children = Array.from(this.directoryBodyDiv.children) as StorageDiv[];
        children.sort((a, b) => {
            const aIsDir = a instanceof DirectoryDiv;
            const bIsDir = b instanceof DirectoryDiv;
            if (aIsDir && !bIsDir) return -1;
            if (!aIsDir && bIsDir) return 1;
            return a.getName().localeCompare(b.getName());
        });
        children.forEach(child => this.directoryBodyDiv.appendChild(child));
    }

    createFolder(): void {
        this.directoryHeadDiv.createFolder();
    }
    copyStorage(): void {
        this.directoryHeadDiv.copyStorage();
    }
    cutStorage(): void {
        this.directoryHeadDiv.cutStorage();
    }
    insertStorage(): void {
        this.directoryHeadDiv.insertStorage();
    }
    createFile(): void {
        this.directoryHeadDiv.createFile();
    }
    deleteFileOrFolder(): Promise<void> {
        return new Promise((resolve) => {
            if (confirm("Delete directory " + this.getName() + " and all its contents?")) {
                this.editor.deleteFileOrFolder(this.node).then(() => {
                    resolve();
                }).catch((error) => {
                    console.error("Delete directory error:", error);
                    alert("Failed to delete directory.");
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
    rename(): void {
        this.directoryHeadDiv.rename();
    }
}

customElements.define("directory-div", DirectoryDiv, { extends: "div" });