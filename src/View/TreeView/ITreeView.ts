import { createDecorator } from "../../tecnicalServices/instantiation/ServiceCollection.js";
import { FileNode_EXC_I } from "../../ViewDomainI/Interfaces.js";

export const  ITreeView  = createDecorator<ITreeView>('ITreeView');


export interface ITreeView {
    getSettingFileDiv(): FileNode_EXC_I
    closeApplication(): void
    openFolder(): Promise<void>
    openFile(): Promise<void>
    openFileByUrl(url: string) : Promise<void>
}

