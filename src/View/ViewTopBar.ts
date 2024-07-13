import { InfoFileDiv } from "../Applications/InfoView.js";
import { FileManager_I } from "../Domain/Filemanager_I.js";
import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js";
import { BaseTableManager_I } from "./BaseTableManager.js";
import { FileDiv } from "./FileDiv.js";
import { ApplciationIndex, FrameAppCreator } from "./TabManager/TabApplication.js";
import { TabCreator } from "./TabManager/TabCreator.js";

export class ViewTopBar{

    private parentDiv : HTMLDivElement
    private fileManager : FileManager_I
    private baseTableManager : BaseTableManager_I
    private tabCreator : TabCreator
    constructor(parentDiv : HTMLDivElement,fileManager : FileManager_I,baseTableManager : BaseTableManager_I,tabCreator : TabCreator){
        this.parentDiv  = parentDiv
        let openFileButton = ViewObjectCreator.createMenuBarButton("FILE",".\\..\\..\\image\\opendocument.png")
        openFileButton.style.left = 20 + "pt"

        parentDiv.appendChild(openFileButton);
        this.fileManager = fileManager
        this.baseTableManager = baseTableManager
        this.tabCreator = tabCreator
        openFileButton.addEventListener('click', function(e) {
            fileManager.openFile()
            baseTableManager.openFileView()

        })

        let openDirButton = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\openfolder.png")
        parentDiv.appendChild(openDirButton);
        openDirButton.addEventListener('click', function(e) {
            fileManager.openFolder()
            baseTableManager.openFileView()
        })

        let saveFile = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\save.png")
        parentDiv.appendChild(saveFile);
        saveFile.addEventListener('click', function(e) {
            fileManager.saveCurrentFile()
        })
        let saveAllFile = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\saveAll.png")
        parentDiv.appendChild(saveAllFile);
        saveAllFile.addEventListener('click', function(e) {
            fileManager.saveAllFile()
        })

        let closeApplication = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\close.png")
        parentDiv.appendChild(closeApplication);
        closeApplication.style.right ="0pt"
        closeApplication.style.position ="absolute"
        closeApplication.addEventListener('click', function(e) {
            fileManager.closeApplication()
        })

        let settingApplication = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\setting.png")
        parentDiv.appendChild(settingApplication);
        settingApplication.style.right = 20 + "pt"
        settingApplication.style.position ="absolute"
        let self = this
        settingApplication.addEventListener('click', function(e) {
            let fileDiv : FileDiv = self.fileManager.getSettingFileDiv(self.tabCreator)            
            let infoNode = new InfoFileDiv(self.tabCreator)
            let appIndex = new ApplciationIndex("../../src/Applications/SettingPage/index.html")
            self.tabCreator.createTab(fileDiv,appIndex)
        })

        let infoApplication = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\info.png")
        parentDiv.appendChild(infoApplication);
        infoApplication.style.right = 40 + "pt"
        infoApplication.style.position ="absolute"
        infoApplication.addEventListener('click', function(e) {
            let infoNode = new InfoFileDiv(self.tabCreator)
            
            let appIndex = new ApplciationIndex("../../src/Applications/InfoPage/index.html")
            self.tabCreator.createTab(infoNode,appIndex)

        })

        
    }
}