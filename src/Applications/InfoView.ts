import { FileDiv_I } from "../View/TreeView/FileDiv.js";
import { ApplciationIndex, TABApplication } from "../View/TabManager/TabApplication.js";
import { TabCreator } from "../View/TabManager/TabCreator.js";

export class InfoFileDiv implements FileDiv_I {

    private tabCreator: TabCreator;
    private fileTabOpenState: boolean;

    constructor(tabCreator: TabCreator) {
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

    public openFile(createApplication: ApplciationIndex) {
        this.tabCreator.createTab(this, createApplication);
    }

    setEditable(state: string) {
        return;
    }

    getFileText(): Promise<String | unknown> {
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
