import { ContextMenu } from "../ContextMenu.js";
import { DirectoryNode_EXC_I, IFileSystemService, FileNode_EXC_I, StorageNode2_EXC_I } from "../../ViewDomainI/Interfaces.js"; // Corrected path
import { StorageDiv } from "./StorageDiv.js";
import { FileDiv } from "./FileDiv.js";
import { ISettings } from "../../tecnicalServices/Settings.js";

export class DirectoryHeadDiv extends StorageDiv {
    private baseName: string;

    constructor(directoryNode: DirectoryNode_EXC_I, fileSystemService: IFileSystemService, settings: ISettings) {
        super(fileSystemService, directoryNode);
        this.baseName = this.fileSystemService.getStorageName(this.storageNode);
        this.updateDisplay(false); // Initial state is closed
        this.classList.add("directoryHeadDiv");
        this.classList.add("selectable");
        this.contentEditable = "false";
        this.draggable = true;
        this.style.userSelect = "text";
        this.setAttribute("divname", `DIR head ${this.fileSystemService.getStorageName(this.storageNode)}`);

        this.addEventListener("dragstart", (e) => {
            e.dataTransfer?.clearData();
            this.fileSystemService.cutStorage(this.storageNode);
            const realFilePath = this.fileSystemService.getStorageUrl(this.storageNode);
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
    private directoryContainerDiv: HTMLDivElement; // Container for DirectoryDivs
    private fileContainerDiv: HTMLDivElement;      // Container for FileDivs
    private settings: ISettings;
    private isExpanded: boolean = false;
    private dropTargetActiveClass = "drop-target-active"; // Define the class name

    constructor(directoryNode: DirectoryNode_EXC_I, editor: IFileSystemService, settings: ISettings) {
        super(editor, directoryNode);
        this.node = directoryNode;
        this.settings = settings;

        this.classList.add("directoryDiv");
        this.setAttribute("divname", `DIR bodydiv${this.fileSystemService.getStorageName(this.node)}`);

        this.directoryHeadDiv = new DirectoryHeadDiv(directoryNode, editor, settings);
        this.directoryBodyDiv = document.createElement("div");
        this.directoryBodyDiv.classList.add("directoryBodyDiv");
        this.directoryBodyDiv.style.display = "none";

        // Create separate containers for directories and files
        this.directoryContainerDiv = document.createElement("div");
        this.directoryContainerDiv.classList.add("directory-container");
        this.fileContainerDiv = document.createElement("div");
        this.fileContainerDiv.classList.add("file-container");

        // Append containers to the body div
        this.directoryBodyDiv.appendChild(this.directoryContainerDiv);
        this.directoryBodyDiv.appendChild(this.fileContainerDiv);

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

        this.directoryHeadDiv.addEventListener("dragenter", (e) => {
            e.preventDefault(); // Necessary to allow drop
            this.directoryHeadDiv.classList.add(this.dropTargetActiveClass);
        });

        this.directoryHeadDiv.addEventListener("dragleave", (e) => {
            // Check if the relatedTarget (where the mouse is going) is outside the head div
            if (!this.directoryHeadDiv.contains(e.relatedTarget as Node)) {
                this.directoryHeadDiv.classList.remove(this.dropTargetActiveClass);
            }
        });

        this.directoryHeadDiv.addEventListener("dragover", (e) => {
            e.preventDefault();
            this.directoryHeadDiv.classList.add(this.dropTargetActiveClass); // Keep class while dragging over
            if (e.dataTransfer)
                e.dataTransfer.dropEffect = "move";
        });

        this.directoryHeadDiv.addEventListener("drop", (e) => {
            this.handleDropEvent(e); // Call the shared handler
        });

        this.fileContainerDiv.addEventListener("dragenter", (e) => {
            e.preventDefault(); // Necessary to allow drop
            this.fileContainerDiv.classList.add(this.dropTargetActiveClass);
        });

        this.fileContainerDiv.addEventListener("dragleave", (e) => {
            // Check if the relatedTarget (where the mouse is going) is outside the container
            if (!this.fileContainerDiv.contains(e.relatedTarget as Node)) {
                this.fileContainerDiv.classList.remove(this.dropTargetActiveClass);
            }
        });

        this.fileContainerDiv.addEventListener("dragover", (e) => {
            e.preventDefault();
            this.fileContainerDiv.classList.add(this.dropTargetActiveClass); // Keep class while dragging over
            if (e.dataTransfer)
                e.dataTransfer.dropEffect = "move"; // Indicate it's a valid drop target
        });

        this.fileContainerDiv.addEventListener("drop", (e) => {
            this.handleDropEvent(e); // Call the shared handler
        });
    }

    private handleDropEvent(e: DragEvent): void {
        e.preventDefault();
        e.stopPropagation(); // Prevent the event from bubbling up further

        this.directoryHeadDiv.classList.remove(this.dropTargetActiveClass);
        this.fileContainerDiv.classList.remove(this.dropTargetActiveClass);

        const isInternalMove = e.dataTransfer?.types.includes("application/x-internal-cut");
        const targetNode = this.node; // The directory where the drop occurs

        if (isInternalMove) {
            console.log("Handling internal drop (move)");
            // Use the editor's insertStorage which uses the clipboard (set by cutStorage)
            this.fileSystemService.insertStorage(this.node)
                .then(() => {
                    console.log("Internal move successful.");
                    // Optional: Refresh the source and target directories if needed,
                    // though node events should ideally handle this.
                })
                .catch(error => {
                    console.error("Internal move failed:", error);
                    alert(`Failed to move item: ${error.message || error}`);
                });
        } else {
            console.log("Handling external drop (copy)");
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                // Attempt to get full paths if available (common in Electron)
                const filePath = globalThis.electron.getPathForFile(files[0]);
                console.log("External files dropped:", filePath);
                this.fileSystemService.openFileByUrl(filePath).then((fileNode : FileNode_EXC_I) => {
                    if (fileNode) {
                        this.fileSystemService.copyStorage(fileNode).then(() => {
                            this.fileSystemService.insertStorage(this.node).then(() => {
                                console.log("External copy successful.");
                                this.refreshContent(); // Refresh the content after copying
                            })
                        }).catch(error => {
                            console.error("External copy failed:", error);
                            alert(`Failed to copy item: ${error.message || error}`);
                        });
                    } else {
                        console.error("Failed to create file node from dropped file.");
                        alert("Failed to create file node from dropped file.");
                    }
                }).catch(error => {
                    console.error("Failed to open file:", error);
                    alert(`Failed to open file: ${error.message || error}`);
                });

            }

            
            
        }
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
            // Search within both containers
            const childDiv = this.directoryContainerDiv.querySelector(`[divname*="${child.getName()}"]`) ||
                             this.fileContainerDiv.querySelector(`[divname*="${child.getName()}"]`);
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
        // Clear the specific containers instead of the whole body
        this.directoryContainerDiv.innerHTML = '';
        this.fileContainerDiv.innerHTML = '';
        return this.node.updateStorage().then(() => {
            this.renderChildren(this.node.getFiles(), this.node.getDirectories(), [], []);
        }).catch(error => {
            console.error(`Failed to refresh content for ${this.getName()}:`, error);
        });
    }

    refreshStorageRekursiv(): Promise<void> {
        return this.refreshContent().then(() => {
            // Get DirectoryDiv children specifically from the directory container
            const childDirs = Array.from(this.directoryContainerDiv.children)
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

        // Handle removals from respective containers
        removedDirs.forEach(dirNode => {
            const divToRemove = Array.from(this.directoryContainerDiv.children)
                                     .find(el => (el as StorageDiv).storageNode === dirNode);
            divToRemove?.remove();
        });
        removedFiles.forEach(fileNode => {
            const divToRemove = Array.from(this.fileContainerDiv.children)
                                     .find(el => (el as StorageDiv).storageNode === fileNode);
            divToRemove?.remove();
        });

        // Render directories into the directory container
        this.renderItems<DirectoryNode_EXC_I>(
            addedDirs,
            (dirNode) => new DirectoryDiv(dirNode, this.fileSystemService, this.settings),
            this.directoryContainerDiv // Specify the target container
        );
        // Render files into the file container
        this.renderItems<FileNode_EXC_I>(
            addedFiles,
            (fileNode) => new FileDiv(fileNode, this.fileSystemService, this.settings),
            this.fileContainerDiv // Specify the target container
        );

        this.sortChildren();
    }

    // Modified renderItems to accept a target container element
    private renderItems<T extends StorageNode2_EXC_I>(items: T[], createElement: (node: T) => StorageDiv, container: HTMLElement): void {
        items.forEach(item => {
            // Check if the item already exists in the container
            const existingDiv = Array.from(container.children)
                                     .find(el => (el as StorageDiv).storageNode === item);
            if (!existingDiv) {
                const element = createElement(item);
                container.appendChild(element);
            }
        });
    }

    // Modified sortChildren to sort within respective containers
    private sortChildren(): void {
        // Sort directories within directoryContainerDiv
        const dirChildren = Array.from(this.directoryContainerDiv.children) as StorageDiv[];
        dirChildren.sort((a, b) => a.getName().localeCompare(b.getName()));
        dirChildren.forEach(child => this.directoryContainerDiv.appendChild(child)); // Re-append in sorted order

        // Sort files within fileContainerDiv
        const fileChildren = Array.from(this.fileContainerDiv.children) as StorageDiv[];
        fileChildren.sort((a, b) => a.getName().localeCompare(b.getName()));
        fileChildren.forEach(child => this.fileContainerDiv.appendChild(child)); // Re-append in sorted order
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
                this.fileSystemService.deleteFileOrFolder(this.node).then(() => {
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