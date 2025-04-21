import { createDecorator } from "../tecnicalServices/instantiation/ServiceCollection.js";
import { FileDiv } from "../View/FileDiv"
import { TabCreator } from "../View/TabManager/TabCreator"

export const  IFileManager  = createDecorator<IFileManager>('IFileManager');


export interface IFileManager {
    getSettingFileDiv(tabCreator : TabCreator): FileDiv
    closeApplication(): void
    saveCurrentFile(): void
    saveAllFile(): void
    openFolder(): void
    openFile(): void
    openFileByUrl([]) : void
}

