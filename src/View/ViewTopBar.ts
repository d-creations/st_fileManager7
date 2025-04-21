import { InfoFileDiv } from "../Applications/InfoView.js";
import { IFileManager } from "../Domain/Filemanager_I.js";
import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js";
import { InstantiationService } from "../tecnicalServices/instantiation/InstantiationService.js";
import { BaseTableManager_I } from "./BaseTableManager.js";
import { FileDiv } from "./FileDiv.js";
import { ApplciationIndex, FrameAppCreator } from "./TabManager/TabApplication.js";
import { TabCreator } from "./TabManager/TabCreator.js";


export class ViewTopBar{

    private parentDiv : HTMLDivElement
    private fileManager : IFileManager
    private baseTableManager : BaseTableManager_I
    private tabCreator : TabCreator
    constructor(parentDiv : HTMLDivElement,instantiationService: InstantiationService,baseTableManager : BaseTableManager_I,tabCreator : TabCreator){
        this.parentDiv  = parentDiv
        let openFileButton = ViewObjectCreator.createMenuBarButton("FILE",".\\..\\..\\image\\opendocument.png")
        openFileButton.style.left = 30 + "pt"
        //openFileButton.style.display = "none"; // Make the button invisible
        parentDiv.appendChild(openFileButton);
        instantiationService.invokeFunction((accessor) => {
            this.fileManager = accessor.get(IFileManager);
        } )
        this.baseTableManager = baseTableManager
        this.tabCreator = tabCreator
        let that = this
        openFileButton.addEventListener('click', function(e) {
            that.fileManager.openFile()
        })

        let openDirButton = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\openfolder.png")
        openDirButton.style.left = 55 + "pt"    
        parentDiv.appendChild(openDirButton);
        openDirButton.addEventListener('click', function(e) {
            that.fileManager.openFolder()
            baseTableManager.openFileView()
        })

        let saveFile = ViewObjectCreator.createMenuBarButton("SAVE",".\\..\\..\\image\\save.png")
        saveFile.style.left =  80 + "pt"   

        parentDiv.appendChild(saveFile);
        saveFile.addEventListener('click', function(e) {
            that.fileManager.saveCurrentFile()
        })
        let saveAllFile = ViewObjectCreator.createMenuBarButton("SAVE_ALL",".\\..\\..\\image\\saveAll.png")
        saveAllFile.style.left =  105 + "pt"   
        saveAllFile.style.position ="absolute"        
        parentDiv.appendChild(saveAllFile);
        saveAllFile.addEventListener('click', function(e) {
            that.fileManager.saveAllFile()
        })

        let closeApplication = ViewObjectCreator.createMenuBarButton("CLOSE",".\\..\\..\\image\\close.png")
        parentDiv.appendChild(closeApplication);
        closeApplication.style.right ="0pt"
        closeApplication.style.position ="absolute"
        closeApplication.addEventListener('click', function(e) {
            that.fileManager.closeApplication()
        })

        let settingApplication = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\setting.png")
        parentDiv.appendChild(settingApplication);
        settingApplication.style.right = 25 + "pt"
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
        infoApplication.style.right = 50 + "pt"
        infoApplication.style.position ="absolute"
        infoApplication.addEventListener('click', function(e) {
            let infoNode = new InfoFileDiv(self.tabCreator)
            
            let appIndex = new ApplciationIndex("../../src/Applications/InfoPage/index.html")
            self.tabCreator.createTab(infoNode,appIndex)

        })
    }
}