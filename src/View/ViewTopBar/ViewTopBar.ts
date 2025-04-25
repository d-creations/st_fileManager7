import { InfoFileDiv } from "../../Applications/InfoView.js";
import { ITreeView } from "../TreeView/ITreeView.js";
import { ViewObjectCreator } from "../../tecnicalServices/ViewObjectCreator.js";
import { IBaseDivView } from "../BaseDivView/BaseDivView.js";
import { FileDiv } from "../TreeView/FileDiv.js";
import { ApplciationIndex } from "../TabManager/TabApplication.js";
import { TabCreator } from "../TabManager/TabCreator.js";
import { ITabManager } from "../TabManager/TabManager.js"; // Import ITabManager
import { createDecorator } from "../../tecnicalServices/instantiation/ServiceCollection.js";

export const IViewTopBar = createDecorator<IViewTopBar>('IViewTopBar');
export interface IViewTopBar {}

export class ViewTopBar implements IViewTopBar {

    private parentDiv: HTMLDivElement;
    private fileManager: ITreeView;
    private baseTableManager: IBaseDivView;
    private tabManager: ITabManager; // Change type to ITabManager

    constructor(
        // No decorators - dependencies will be passed manually
        fileManager: ITreeView,
        baseTableManager: IBaseDivView,
        parentDiv: HTMLDivElement,
        tabManager: ITabManager
    ) {
        this.parentDiv = parentDiv;
        this.fileManager = fileManager; // Assign manually passed fileManager
        this.baseTableManager = baseTableManager; // Assign manually passed baseTableManager
        this.tabManager = tabManager; // Assign manually passed tabManager
        let tabCreator = this.tabManager.getTabCreator();
        let openFileButton = ViewObjectCreator.createMenuBarButton("FILE", ".\\..\\..\\image\\opendocument.png");
        openFileButton.style.left = 30 + "pt";
        //openFileButton.style.display = "none"; // Make the button invisible
        this.parentDiv.appendChild(openFileButton);
        let that = this;
        openFileButton.addEventListener('click', function (e) {
            that.fileManager.openFile();
        });

        let openDirButton = ViewObjectCreator.createMenuBarButton("FOLDER", ".\\..\\..\\image\\openfolder.png");
        openDirButton.style.left = 55 + "pt";
        parentDiv.appendChild(openDirButton);
        openDirButton.addEventListener('click', function (e) {
            that.fileManager.openFolder();
            that.baseTableManager.openFileView();
        });

        let saveFile = ViewObjectCreator.createMenuBarButton("SAVE", ".\\..\\..\\image\\save.png");
        saveFile.style.left = 80 + "pt";

        parentDiv.appendChild(saveFile);
        saveFile.addEventListener('click', function (e) {
            that.fileManager.saveCurrentFile();
        });
        let saveAllFile = ViewObjectCreator.createMenuBarButton("SAVE_ALL", ".\\..\\..\\image\\saveAll.png");
        saveAllFile.style.left = 105 + "pt";
        saveAllFile.style.position = "absolute";
        parentDiv.appendChild(saveAllFile);
        saveAllFile.addEventListener('click', function (e) {
            that.fileManager.saveAllFile();
        });

        let closeApplication = ViewObjectCreator.createMenuBarButton("CLOSE", ".\\..\\..\\image\\close.png");
        parentDiv.appendChild(closeApplication);
        closeApplication.style.right = "0pt";
        closeApplication.style.position = "absolute";
        closeApplication.addEventListener('click', function (e) {
            that.fileManager.closeApplication();
        });

        let settingApplication = ViewObjectCreator.createMenuBarButton("FOLDER", ".\\..\\..\\image\\setting.png");
        parentDiv.appendChild(settingApplication);
        settingApplication.style.right = 25 + "pt";
        settingApplication.style.position = "absolute";
        let self = this;
        settingApplication.addEventListener('click', function (e) {
            // Use tabCreator obtained above
            let fileDiv: FileDiv = self.fileManager.getSettingFileDiv(tabCreator);
            let infoNode = new InfoFileDiv(tabCreator);
            let appIndex = new ApplciationIndex("../../src/Applications/SettingPage/index.html");
            tabCreator.createTab(fileDiv, appIndex);
        });

        let infoApplication = ViewObjectCreator.createMenuBarButton("FOLDER", ".\\..\\..\\image\\info.png");
        parentDiv.appendChild(infoApplication);
        infoApplication.style.right = 50 + "pt";
        infoApplication.style.position = "absolute";
        infoApplication.addEventListener('click', function (e) {
            // Use tabCreator obtained above
            let infoNode = new InfoFileDiv(tabCreator);
            let appIndex = new ApplciationIndex("../../src/Applications/InfoPage/index.html");
            tabCreator.createTab(infoNode, appIndex);

        });
    }
}