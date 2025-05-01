import { createDecorator } from "../../tecnicalServices/instantiation/ServiceCollection.js"
import { ApplciationIndex } from "../../View/TabManager/TabApplication"
import { FileNode_EXC_I } from "../../ViewDomainI/Interfaces"



export const IAppForFileService = createDecorator<IAppForFileService>('IAppForFileService')


export interface IAppForFileService {
    openFileInapp(fileNode: FileNode_EXC_I,applciationIndex : ApplciationIndex):void
}


