import { DirectoryDiv } from "./DirectoryDiv.js"; // Corrected path
import { ITreeView } from "./ITreeView.js"; // Corrected path
import { FileDiv } from "./FileDiv.js"; // Corrected path
import { APPUIEvent, IuiEventService } from "../UIEventService/IuieventService.js";
import { DirectoryNode_EXC_I, FileNode_EXC_I, IFileSystemService } from "../../Contracts/Interfaces.js";
import { IStorageService } from "../../Core/SystemStorageService/IStroageService.js";
import { ISettings } from "../../Utils/Settings.js";

export class TreeView extends HTMLDivElement implements ITreeView {
    private rootStorageDiv: DirectoryDiv | null;
    private editor: IFileSystemService;
    private settings: ISettings;
    private storageService: IStorageService;

    constructor(
        // Dependencies injected by InstantiationService
        @IFileSystemService editor: IFileSystemService,
        @ISettings settings: ISettings,
        @IStorageService storageService: IStorageService, // Use IFileSystemService decorator
        @IuiEventService uiEventService: IuiEventService // Use IuiEventService decorator
    ) {
        super();
        this.editor = editor;
        this.settings = settings;
        this.storageService = storageService;
        uiEventService.on(APPUIEvent.FileOpen, () => this.openFile());
        uiEventService.on(APPUIEvent.FolderOpen, () => this.openFolder());
        

        let dumyDiv = document.createElement("div");
        dumyDiv.innerText = "Open Folder...";
        this.rootStorageDiv =dumyDiv

        this.rootStorageDiv.addEventListener("click", async () => {
            await this.openFolder();
        });

        this.appendChild(this.rootStorageDiv);
        this.id = "fileExplorer";
    }

    // --- IFileManager Implementation ---

    getSettingFileDiv(): FileNode_EXC_I {
        const settingNode = this.editor.getSettingFileNode();
        return settingNode ; // Cast to FileNode_EXC_I if necessary
    }

    closeApplication(): void {
        this.editor.closeApplication();
    }

    async openFolder(): Promise<void> {
        try {
            const directoryNode = await this.editor.openDirectory() as DirectoryNode_EXC_I;
            if (directoryNode) {
                this.rootStorageDiv.remove();
                this.rootStorageDiv = new DirectoryDiv(
                    directoryNode,
                    this.editor
                );
                this.appendChild(this.rootStorageDiv);
                this.rootStorageDiv.refreshContent();
            }
        } catch (error) {
            console.error("Failed to open folder:", error);
        }
    }

    async openFile(): Promise<void> {
        try {
            const fileNode = await this.editor.openFile() as FileNode_EXC_I;
            if (fileNode) {
                const fileDiv = new FileDiv(fileNode, this.editor);
                fileDiv.openFileWithSelector();
            }
        } catch (error) {
            console.error("Failed to open file:", error);
        }
    }

    async openFileByUrl(url: string): Promise<void> {
        try {
            const fileNode = await this.editor.openFileByUrl(url) as FileNode_EXC_I;
            if (fileNode) {
                const fileDiv = new FileDiv(fileNode, this.editor);
                fileDiv.openFileWithSelector();
            }
        } catch (error) {
            console.error(`Failed to open file by URL (${url}):`, error);
        }
    }

    // --- Other Methods ---

    public refreshExplorer(): Promise<void> {
        if (this.rootStorageDiv) {
            return this.rootStorageDiv.refreshStorageRekursiv();
        }
        return Promise.resolve();
    }
}

// Custom element definition should ideally be done once, perhaps in render.ts
// If kept here, ensure it's guarded against re-definition
if (!customElements.get('file-explorer-div')) {
    customElements.define("file-explorer-div", TreeView, { extends: "div" });
}