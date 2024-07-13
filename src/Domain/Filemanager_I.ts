import { FileDiv } from "../View/FileDiv"
import { TabCreator } from "../View/TabManager/TabCreator"


export interface FileManager_I {
    getSettingFileDiv(tabCreator : TabCreator): FileDiv
    closeApplication(): void
    saveCurrentFile(): void
    saveAllFile()
    openFolder()
    openFile()
  }