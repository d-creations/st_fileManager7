import { ViewObjectCreator } from "../../tecnicalServices/ViewObjectCreator.js";
import { ApplciationIndex } from "../TabManager/TabApplication.js";
import { createDecorator } from "../../tecnicalServices/instantiation/ServiceCollection.js";
import { IuiEventService, APPUIEvent } from "../UIEventService/IuieventService.js";

export const IViewTopBar = createDecorator<IViewTopBar>('IViewTopBar');
export interface IViewTopBar{
    getHtmlElements(): HTMLDivElement[]; // Method to get HTML elements
    // Add any other methods you need for the interface
}


export class ViewTopBar implements IViewTopBar  {

//    private tabManager: ITabManager; // Change type to ITabManager

    divElements = []  // Initialize divElements as an array of HTMLDivElement
    constructor(
        @IuiEventService uiEventService : IuiEventService      
    ) {
//        this.fileManager = fileManager; // Assign manually passed fileManager
//        this.tabManager = tabManager; // Assign manually passed tabManager
//        let tabCreator = this.tabManager.getTabCreator();
        let openFileButton = ViewObjectCreator.createMenuBarButton("FILE", ".\\..\\..\\image\\opendocument.png");
        openFileButton.style.left = 30 + "pt";
        //openFileButton.style.display = "none"; // Make the button invisible
        this.divElements.push(openFileButton);
        let that = this;
        openFileButton.addEventListener('click', function (e) {
            uiEventService.trigger(APPUIEvent.FileOpen, {}); // Trigger the event when the button is clicked
        });

        let openDirButton = ViewObjectCreator.createMenuBarButton("FOLDER", ".\\..\\..\\image\\openfolder.png");
        openDirButton.style.left = 55 + "pt";
        this.divElements.push(openDirButton);
        openDirButton.addEventListener('click', function (e) {
            uiEventService.trigger(APPUIEvent.FolderOpen, {}); // Trigger the event when the button is clicked
        });

        let saveFile = ViewObjectCreator.createMenuBarButton("SAVE", ".\\..\\..\\image\\save.png");
        saveFile.style.left = 80 + "pt";

        this.divElements.push(saveFile);
        saveFile.addEventListener('click', function (e) {
            uiEventService.trigger(APPUIEvent.FileSave, {}); // Trigger the event when the button is clicked
        });
        let saveAllFile = ViewObjectCreator.createMenuBarButton("SAVE_ALL", ".\\..\\..\\image\\saveAll.png");
        saveAllFile.style.left = 105 + "pt";
        saveAllFile.style.position = "absolute";
        this.divElements.push(saveAllFile);
        saveAllFile.addEventListener('click', function (e) {
//@todo            that.fileManager.saveAllFile();
        });

        let closeApplication = ViewObjectCreator.createMenuBarButton("CLOSE", ".\\..\\..\\image\\close.png");
        this.divElements.push(closeApplication);
        closeApplication.style.right = "0pt";
        closeApplication.style.position = "absolute";
        closeApplication.addEventListener('click', function (e) {
            uiEventService.trigger(APPUIEvent.CloseApplication, {}); // Trigger the event when the button is clicked
//@todo            that.fileManager.closeApplication();
        });

        let settingApplication = ViewObjectCreator.createMenuBarButton("FOLDER", ".\\..\\..\\image\\setting.png");
        this.divElements.push(settingApplication);
        settingApplication.style.right = 25 + "pt";
        settingApplication.style.position = "absolute";
        let self = this;
        settingApplication.addEventListener('click', function (e) {
        
            // Use tabCreator obtained above
//@todo            let fileDiv: FileNode_EXC_I = self.fileManager.getSettingFileDiv();
//@todo            let infoNode = new InfoFileDiv(tabCreator);
            let appIndex = new ApplciationIndex("../../src/Applications/SettingPage/index.html");
//@todo            tabCreator.createTab(fileDiv, appIndex);
        });

        let infoApplication = ViewObjectCreator.createMenuBarButton("FOLDER", ".\\..\\..\\image\\info.png");
        this.divElements.push(infoApplication);
        infoApplication.style.right = 50 + "pt";
        infoApplication.style.position = "absolute";
        infoApplication.addEventListener('click', function (e) {
            // Use tabCreator obtained above
//@todo            let infoNode = new InfoFileDiv(tabCreator);
            let appIndex = new ApplciationIndex("../../src/Applications/InfoPage/index.html");
//@todo            tabCreator.createTab(infoNode, appIndex);

        });
    }

    getHtmlElements(): HTMLDivElement[] {
        return this.divElements; // Return the array of div elements
    }
}