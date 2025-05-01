import { FileNode } from "../Domain/FileSystemService/FileNode.js";
import { ApplciationIndex, TABApplication } from "../View/TabManager/TabApplication.js";
import { TabCreator } from "../View/TabManager/TabCreator.js";
import { FileNode_EXC_I } from "../ViewDomainI/Interfaces.js";

export class InfoFileDiv extends FileNode  {

    private tabCreator: TabCreator;
    private fileTabOpenState: boolean;

    constructor(tabCreator: TabCreator) {
        super(null,null,null)
        this.tabCreator = tabCreator;
        this.fileTabOpenState = false;
    }


    openTabFileState(): void {
        this.fileTabOpenState = true;
    }

    closeTabFileState(): void {
        this.fileTabOpenState = false;
    }

    getUrl() {
        return "infoText";
    }

    saveText(text: string) {
        console.log("InfoFileDiv: saveText called (no-op)");
        return;
    }

    public openFileWithApp(createApplication: ApplciationIndex): void {
        this.tabCreator.createTab(this, createApplication);
    }


    public openFile() {
    }

    setEditable(state: string) {
        return;
    }

    getFileText(): Promise<string> {
        return Promise.resolve("This is the Info View content.");
    }

    getName(): string {
        return "info";
    }

    getFileIsDeleted(): boolean {
        return false;
    }

    isManipulable?(): boolean {
        return this.fileTabOpenState;
    }

    updateThisDiv?(): void {
        // No-op
    }
}
