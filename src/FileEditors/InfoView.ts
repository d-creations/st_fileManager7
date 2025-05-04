import { FileNode_EXC_I, StorageNode2_EXC_I } from "../Contracts/Interfaces.js";
import { IuiEventService, APPUIEvent } from "../UI/UIEventService/IuieventService.js";
import { CustomEventEmitter } from "../Utils/CustomEventEmitter.js";
import { createDecorator } from "../Utils/instantiation/ServiceCollection.js";

export const IInfoFile = createDecorator<IInfoFile>('IInfoFile'); // Create decorator


export interface IInfoFile{

}

export class InfoFileDiv extends CustomEventEmitter  implements IInfoFile,FileNode_EXC_I{

    private fileTabOpenState: boolean;
    private url : string = "infoText"; // Default URL

    constructor(@IuiEventService uiEventService : IuiEventService) {
        super(); // Call the constructor of CustomEventEmitter
        this.fileTabOpenState = false;
        console.log("InfoFileDiv: constructor called");
        uiEventService.on(APPUIEvent.openInfo,(url ) => {
            console.log("OPEN INFO")            
            uiEventService.trigger(APPUIEvent.FileOpenWithSpezApplication,{fileNode : this , urlToApp : url});
        })
    }
    
    getFileText(): Promise<string> {
        return Promise.resolve("This is the Info View content.");
    }

    isDeleted(): boolean {
        throw new Error("Method not implemented.");
    }
    saveFile(text: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    openEditingState(): void {

    }
    closeEditingState(): void {

    }
    updateStorage(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    renameFileOrFolder(newName: string): Promise<boolean | unknown> {
        throw new Error("Method not implemented.");
    }
    addChild(node: StorageNode2_EXC_I): void {
        throw new Error("Method not implemented.");
    }
    removeChild(node: StorageNode2_EXC_I): void {
        throw new Error("Method not implemented.");
    }
    getParent(): StorageNode2_EXC_I | null {
        throw new Error("Method not implemented.");
    }


    openTabFileState(): void {
        this.fileTabOpenState = true;
    }

    closeTabFileState(): void {
        this.fileTabOpenState = false;
    }

    getUrl() {
        return this.url;
    }


    saveText(text: string) {
        console.log("InfoFileDiv: saveText called (no-op)");
        return;
    }


    public openFile() {
    }

    setEditable(state: string) {
        return;
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
