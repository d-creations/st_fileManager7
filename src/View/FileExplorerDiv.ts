import { DirectoryDiv } from "./DirectoryDiv.js";
import { DirectoryNode } from "../Domain/DirectoryNode.js";
import { EditorControlerAdapter_EXC_I, DirectoryNode_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces.js";
import { TabCreator } from "./TabManager/TabCreator.js";
import { InstantiationService } from "../tecnicalServices/instantiation/InstantiationService.js";
import { IFileManager } from "../Domain/Filemanager_I.js";
import { FileDiv } from "./FileDiv.js";
import { TabManager_I } from "./TabManager/TabManager.js";

export class FileExplorerDiv extends HTMLDivElement implements IFileManager {
    private rootStorageDiv: DirectoryDiv;
    private editor: EditorControlerAdapter_EXC_I;
    private tabManager: TabManager_I;
    private instantiationService: InstantiationService;

    constructor(tabManager: TabManager_I, editor: EditorControlerAdapter_EXC_I, instantiationService: InstantiationService) {
        super();
        this.editor = editor;
        this.tabManager = tabManager;
        this.instantiationService = instantiationService;

        const placeholderRoot = new DirectoryNode(null, "root");
        this.rootStorageDiv = new DirectoryDiv(
            placeholderRoot as DirectoryNode_EXC_I,
            this.editor,
            this.tabManager.getTabCreator(),
            this.instantiationService
        );

        this.appendChild(this.rootStorageDiv);
        this.id = "fileExplorer";
    }

    // --- IFileManager Implementation ---

    getSettingFileDiv(tabCreator: TabCreator): FileDiv {
        const settingNode = this.editor.getSettingFileNode();
        return new FileDiv(settingNode, this.editor, tabCreator, this.instantiationService);
    }

    closeApplication(): void {
        this.editor.closeApplication();
    }

    saveCurrentFile(): void {
        this.tabManager.saveCurrentFile();
    }

    saveAllFile(): void {
        this.tabManager.saveAllFile();
    }

    async openFolder(): Promise<void> {
        try {
            const directoryNode = await this.editor.openDirectory() as DirectoryNode_EXC_I;
            if (directoryNode) {
                this.rootStorageDiv.remove();
                this.rootStorageDiv = new DirectoryDiv(
                    directoryNode,
                    this.editor,
                    this.tabManager.getTabCreator(),
                    this.instantiationService
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
                const fileDiv = new FileDiv(fileNode, this.editor, this.tabManager.getTabCreator(), this.instantiationService);
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
                const fileDiv = new FileDiv(fileNode, this.editor, this.tabManager.getTabCreator(), this.instantiationService);
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

customElements.define("file-explorer-div", FileExplorerDiv, { extends: "div" });