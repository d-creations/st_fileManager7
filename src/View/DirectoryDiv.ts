import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces";
import { TabCreator } from "./TabManager/TabCreator.js";
import { ContextMenu } from "./ContextMenu.js";
import { FileDiv } from "./FileDiv.js";
import { StorageDiv } from "./StorageDiv.js";
import { ApplicationSettings, Settings } from "../tecnicalServices/Settings";

export class DirectoryHeadDiv extends StorageDiv {
    public stateOpen: boolean = false; // Default state
    private readonly directoryNode: DirectoryNode_EXC_I;
    private readonly symbolDiv: HTMLDivElement;
    public readonly nameDiv: HTMLDivElement;

    constructor(directoryNode: DirectoryNode_EXC_I, editor: EditorControlerAdapter_EXC_I) {
        super(editor, directoryNode);
        this.directoryNode = directoryNode;

        this.symbolDiv = this.createSymbolDiv();
        this.nameDiv = this.createNameDiv();

        this.appendChild(this.symbolDiv);
        this.appendChild(this.nameDiv);

        this.updateElement(); // Initial state
        this.directoryNode.addObserver(this);
    }

    private createSymbolDiv(): HTMLDivElement {
        const div = document.createElement("div");
        div.contentEditable = "false";
        div.classList.add("inline");
        return div;
    }

    private createNameDiv(): HTMLDivElement {
        const div = document.createElement("div");
        div.contentEditable = "false";
        div.innerText = this.editor.getStorageName(this.directoryNode);
        div.classList.add("inline");
        return div;
    }

    updateElement() {
        this.symbolDiv.innerText = this.stateOpen ? "v " : "> ";
    }

    getName(): string {
        return this.nameDiv.innerText;
    }

    setName(name: string): void {
        this.nameDiv.innerText = name;
    }

    setEditable(state: "true" | "false"): void {
        this.nameDiv.contentEditable = state;
    }

    public oberverUpdate(): void {
        console.log("FS update observed in DirectoryHeadDiv for:", this.getName());
        this.setName(this.editor.getStorageName(this.directoryNode));
    }
}

export class DirectoryDiv extends StorageDiv {
    private readonly directoryHeadDiv: DirectoryHeadDiv;
    private readonly directoryFilesDiv: HTMLDivElement;
    private readonly directoryDirsDiv: HTMLDivElement;
    private readonly directoryBodyDiv: HTMLDivElement;
    private readonly directoryNode: DirectoryNode_EXC_I;
    private readonly tabCreator: TabCreator;
    private readonly settings: Settings;

    constructor(directoryNode: DirectoryNode_EXC_I, editor: EditorControlerAdapter_EXC_I, tabCreator: TabCreator, settings: Settings) {
        super(editor, directoryNode);
        this.directoryNode = directoryNode;
        this.tabCreator = tabCreator;
        this.settings = settings;

        this.directoryHeadDiv = this.createDirectoryHead();
        this.directoryBodyDiv = this.createDirectoryBody();
        this.directoryFilesDiv = this.createSubContainer("files");
        this.directoryDirsDiv = this.createSubContainer("dirs");

        this.directoryBodyDiv.appendChild(this.directoryFilesDiv);
        this.directoryBodyDiv.appendChild(this.directoryDirsDiv);

        this.appendChild(this.directoryHeadDiv);
        this.appendChild(this.directoryBodyDiv);
        this.classList.add("directoryDiv");

        this.setupEventListeners();
        this.closeDirectory(); // Initial state
        this.directoryNode.addObserver(this); // Observe the node itself for changes
    }

    private createDirectoryHead(): DirectoryHeadDiv {
        const headDiv = new DirectoryHeadDiv(this.directoryNode, this.editor);
        headDiv.setAttribute("divname", `FOLDER HEADDIV ${this.editor.getStorageName(this.directoryNode)}`);
        headDiv.classList.add("selectable");
        return headDiv;
    }

    private createDirectoryBody(): HTMLDivElement {
        const bodyDiv = document.createElement("div");
        bodyDiv.setAttribute("divname", `FOLDER bodydiv ${this.editor.getStorageName(this.directoryNode)}`);
        bodyDiv.style.display = "none"; // Initially hidden
        return bodyDiv;
    }

    private createSubContainer(type: "files" | "dirs"): HTMLDivElement {
        const container = document.createElement("div");
        container.setAttribute("divname", `FOLDER ${type} ${this.editor.getStorageName(this.directoryNode)}`);
        return container;
    }

    private setupEventListeners(): void {
        // Click to toggle open/close
        this.directoryHeadDiv.addEventListener("click", (e) => {
            if (e.target instanceof HTMLElement && e.target.contentEditable === "false") {
                this.toggleDirectory();
            }
        });

        // Context menu
        this.directoryHeadDiv.addEventListener("contextmenu", (e) => {
            const contextMenu = new ContextMenu(this.directoryHeadDiv);
            contextMenu.showMenu(e);
        });

        // Drop listener on the main div (catches drops on head or body)
        this.addEventListener('drop', this.handleDrop.bind(this));

        // Drag enter/leave/over for visual feedback
        this.directoryHeadDiv.addEventListener("dragenter", this.handleDragEnter.bind(this));
        this.directoryHeadDiv.addEventListener("dragleave", this.handleDragLeave.bind(this));
        this.directoryHeadDiv.addEventListener("dragover", this.handleDragOver.bind(this));

        // Also apply drag feedback to the body/subcontainers if needed
        this.directoryFilesDiv.addEventListener("dragenter", this.handleDragEnter.bind(this));
        this.directoryFilesDiv.addEventListener("dragleave", this.handleDragLeave.bind(this));
        this.directoryFilesDiv.addEventListener("dragover", this.handleDragOver.bind(this));
    }

    private handleDragEnter(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        // Add visual cue to the appropriate element (e.g., the head or body)
        const targetElement = event.currentTarget as HTMLElement;
        targetElement.classList.add("dragover");
        console.log("Drag enter:", this.getName());
    }

    private handleDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        const targetElement = event.currentTarget as HTMLElement;
        // Check relatedTarget to prevent flickering when moving over child elements
        if (!targetElement.contains(event.relatedTarget as Node)) {
            targetElement.classList.remove("dragover");
            console.log("Drag leave:", this.getName());
        }
    }

    private handleDragOver(event: DragEvent): void {
        event.preventDefault(); // Necessary to allow dropping
        event.stopPropagation();
    }

    private async handleDrop(event: DragEvent): Promise<void> {
        event.preventDefault();
        event.stopPropagation();
        (event.currentTarget as HTMLElement).classList.remove("dragover"); // Remove visual cue
        console.log("Drop on:", this.getName());

        if (event.dataTransfer?.files) {
            for (const file of event.dataTransfer.files) {
                await this.importDroppedFile(file);
            }
            // Optionally refresh after all files are processed
            // await this.refreshStorageRekursiv();
        }
    }

    private async importDroppedFile(file: File): Promise<void> {
        const path = (file as any).path; // Note: 'path' is Electron-specific
        if (!path) {
            console.error("Dropped item is not a file with a path:", file.name);
            return;
        }
        try {
            console.log(`Importing file: ${path} into ${this.getName()}`);
            const fileNode = await this.editor.openFileByUrl(path);
            await this.editor.moveFileOrFolder(fileNode, this.directoryNode);
            // Refresh is handled by the observer update triggered by moveFileOrFolder
            // await this.refreshStorageRekursiv(); // Consider if needed immediately
        } catch (error) {
            console.error(`Failed to import file "${file.name}":`, error);
            // Optionally show user feedback
        }
    }

    toggleDirectory(): void {
        if (this.directoryHeadDiv.stateOpen) {
            this.closeDirectory();
        } else {
            this.openDirectory();
        }
    }

    async openDirectory(): Promise<void> {
        if (this.directoryHeadDiv.stateOpen) return; // Already open

        this.directoryHeadDiv.stateOpen = true;
        this.directoryHeadDiv.updateElement();
        this.directoryBodyDiv.style.display = "block";
        try {
            await this.editor.updateFileTree(this.directoryNode);
            await this.updateThisDiv(); // Populate content after ensuring node is up-to-date
        } catch (error) {
            console.error(`Failed to open directory "${this.getName()}":`, error);
            // Optionally revert state or show error
            this.closeDirectory(); // Revert to closed state on error
        }
    }

    closeDirectory(): void {
        this.directoryHeadDiv.stateOpen = false;
        this.directoryHeadDiv.updateElement();
        this.directoryBodyDiv.style.display = "none";
        // No need to clear children immediately, they will be updated on next open
    }

    getName(): string {
        return this.directoryHeadDiv.getName();
    }

    setName(name: string): void {
        this.directoryHeadDiv.setName(name);
    }

    setEditable(state: "true" | "false"): void {
        this.directoryHeadDiv.setEditable(state);
    }

    // Called by the observed DirectoryNode_EXC_I
    public oberverUpdate(): void {
        console.log(`Observer update triggered for DirectoryDiv: ${this.getName()}`);
        // Update the name displayed in the head
        this.directoryHeadDiv.setName(this.editor.getStorageName(this.directoryNode));
        // Refresh the contents if the directory is open
        if (this.directoryHeadDiv.stateOpen) {
            this.updateThisDiv().catch(error => {
                console.error(`Error during observer-triggered refresh for ${this.getName()}:`, error);
            });
        }
    }

    async refreshStorageRekursiv(): Promise<void> {
        if (!this.directoryHeadDiv.stateOpen) {
            console.log(`Skipping refresh for closed directory: ${this.getName()}`);
            return Promise.resolve();
        }

        console.log(`Refreshing directory recursively: ${this.getName()}`);
        try {
            await this.editor.updateFileTree(this.directoryNode);
            await this.updateThisDiv(); // Update direct children first

            // Recursively refresh child directories that are *currently rendered*
            const childDirDivs = Array.from(this.directoryDirsDiv.childNodes)
                .filter((child): child is DirectoryDiv => child instanceof DirectoryDiv);

            await Promise.all(childDirDivs.map(directoryDiv =>
                directoryDiv.refreshStorageRekursiv().catch(error => {
                    // Log error but continue refreshing others
                    console.error(`Failed to refresh child directory "${directoryDiv.getName()}":`, error);
                })
            ));
        } catch (error) {
            console.error(`Error during recursive refresh for ${this.getName()}:`, error);
            throw error; // Re-throw to indicate failure at this level
        }
    }

    async updateThisDiv(): Promise<void> {
        console.log(`Updating direct children of: ${this.getName()}`);
        try {
            const fileTree = await this.editor.getFileTree(this.directoryNode);
            const currentFiles = fileTree.files;
            const currentDirs = fileTree.dirs;

            // --- Sync Directories ---
            const existingDirDivs = Array.from(this.directoryDirsDiv.childNodes)
                .filter((node): node is DirectoryDiv => node instanceof DirectoryDiv);
            const existingDirNodes = existingDirDivs.map(div => div.directoryNode);

            // Remove divs for directories that no longer exist or are marked as cut
            existingDirDivs.forEach(dirDiv => {
                if (!currentDirs.includes(dirDiv.directoryNode) || dirDiv.isCutStorage()) {
                    console.log(`Removing directory div: ${dirDiv.getName()}`);
                    this.directoryDirsDiv.removeChild(dirDiv);
                }
            });

            // Add divs for new directories
            currentDirs.forEach(dirNode => {
                if (!existingDirNodes.includes(dirNode)) {
                    console.log(`Adding directory div for: ${this.editor.getStorageName(dirNode)}`);
                    this.insertDirectoryDiv(dirNode); // Handles sorting
                }
            });

            // Re-sort existing directory divs if necessary (e.g., after rename)
            this.sortChildren(this.directoryDirsDiv);

            // --- Sync Files ---
            const existingFileDivs = Array.from(this.directoryFilesDiv.childNodes)
                .filter((node): node is FileDiv => node instanceof FileDiv);
            const existingFileNodes = existingFileDivs.map(div => div.fileNode);

            // Remove divs for files that no longer exist or are marked as cut
            existingFileDivs.forEach(fileDiv => {
                if (!currentFiles.includes(fileDiv.fileNode) || fileDiv.isCutStorage()) {
                    console.log(`Removing file div: ${fileDiv.getName()}`);
                    this.directoryFilesDiv.removeChild(fileDiv);
                }
            });

            // Add divs for new files
            currentFiles.forEach(fileNode => {
                if (!existingFileNodes.includes(fileNode)) {
                    console.log(`Adding file div for: ${this.editor.getStorageName(fileNode)}`);
                    this.insertFileDiv(fileNode); // Handles sorting
                }
            });

            // Re-sort existing file divs if necessary
            this.sortChildren(this.directoryFilesDiv);

        } catch (error) {
            console.error(`Failed to update directory div contents for "${this.getName()}":`, error);
            throw error; // Rethrow the error to propagate it
        }
    }

    private insertDirectoryDiv(dir: DirectoryNode_EXC_I): void {
        const directoryDiv = new DirectoryDiv(dir, this.editor, this.tabCreator, this.settings);
        this.insertSorted(this.directoryDirsDiv, directoryDiv);
        // Child observers/listeners are handled within the child's constructor
    }

    private insertFileDiv(file: FileNode_EXC_I): void {
        const fileDiv = new FileDiv(file, this.editor, this.tabCreator, this.settings);
        this.insertSorted(this.directoryFilesDiv, fileDiv);
        // Add observer relationship if needed (e.g., if FileDiv needs updates from DirectoryDiv)
        // fileDiv.addObserver(this); // Example if FileDiv needed to observe DirectoryDiv
    }

    // Helper to insert a StorageDiv into a container, maintaining alphabetical order
    private insertSorted(container: HTMLDivElement, elementToInsert: StorageDiv & { getName: () => string }): void {
        const nameToInsert = elementToInsert.getName();
        let inserted = false;
        for (const child of Array.from(container.childNodes)) {
            // Type guard to ensure child is a StorageDiv with getName
            if (child instanceof StorageDiv && typeof (child as any).getName === 'function') {
                const childTyped = child as StorageDiv & { getName: () => string };
                if (childTyped.getName().localeCompare(nameToInsert) > 0) {
                    container.insertBefore(elementToInsert, childTyped);
                    inserted = true;
                    break;
                }
            }
        }
        if (!inserted) {
            container.appendChild(elementToInsert);
        }
    }

    // Helper to sort existing children in a container
    private sortChildren(container: HTMLDivElement): void {
        const children = Array.from(container.childNodes)
            .filter((node): node is (StorageDiv & { getName: () => string }) =>
                node instanceof StorageDiv && typeof (node as any).getName === 'function'
            );

        children.sort((a, b) => a.getName().localeCompare(b.getName()));

        // Re-append children in sorted order
        children.forEach(child => container.appendChild(child));
    }
}