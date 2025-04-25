import { createDecorator } from "../../tecnicalServices/instantiation/ServiceCollection.js";
import { FileDiv } from "./FileDiv.js"
import { TabCreator } from "../TabManager/TabCreator.js"

export const  ITreeView  = createDecorator<ITreeView>('ITreeView');


export interface ITreeView {
    getSettingFileDiv(tabCreator : TabCreator): FileDiv
    closeApplication(): void
    saveCurrentFile(): void
    saveAllFile(): void
    openFolder(): Promise<void>
    openFile(): Promise<void>
    openFileByUrl(url: string) : Promise<void>
}

