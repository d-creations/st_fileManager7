import { FileNode_EXC_I } from "../../Contracts/Interfaces.js"
import { ApplciationIndex } from "../../UI/TabManager/TabApplication.js"
import { createDecorator } from "../../Utils/instantiation/ServiceCollection.js"



export const IAppForFileService = createDecorator<IAppForFileService>('IAppForFileService')


export interface IAppForFileService {
    openFileInapp(fileNode: FileNode_EXC_I,applciationIndex : ApplciationIndex):void
}


