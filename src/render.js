import { EditorControlerAdapter } from "./Domain/EditorContollerAdapter.js";
import { BaseTableManager } from "./View/BaseTableManager.js";
import { ContextMenu } from "./View/ContextMenu.js";
import { DirectoryHeadDiv, DirectoryDiv } from "./View/DirectoryDiv.js";
import { FileDiv } from "./View/FileDiv.js";
import { FileExplorerDiv } from "./View/FileExplorerDiv.js";
import { FileLeftClickMenu } from "./View/FileLeftClickMenu.js";
import { NaviMenu } from "./View/NaviManager/NaviMenu.js";
import { StorageDiv } from "./View/StorageDiv.js";
import { TabManager } from "./View/TabManager/TabManager.js";
import { ViewTopBar } from "./View/ViewTopBar.js";
import { ServiceCollection, SyncDescriptor } from "./tecnicalServices/instantiation/ServiceCollection.js";
import { IFileManager } from "./Domain/Filemanager_I.js";
import { InstantiationService } from "./tecnicalServices/instantiation/InstantiationService.js";
import { ISettings, Settings } from "./tecnicalServices/Settings.js";
if (!customElements.get('directory-head-div')) {
    customElements.define('directory-head-div', DirectoryHeadDiv, { extends: 'div' });
}
if (!customElements.get('storage-div')) {
    customElements.define('storage-div', StorageDiv, { extends: 'div' });
}
if (!customElements.get('directory-div')) {
    customElements.define('directory-div', DirectoryDiv, { extends: 'div' });
}
if (!customElements.get('file-div')) {
    customElements.define('file-div', FileDiv, { extends: 'div' });
}
if (!customElements.get('file-explorer-div')) {
    customElements.define('file-explorer-div', FileExplorerDiv, { extends: 'div' });
}
let div = document.getElementById("windowFileExpolorer");
let tabDiv = document.getElementById("windowMainView");
let headBarDiv = document.getElementById("headerBar");
let naviDiv = document.getElementById("navi");
let bar = document.getElementById("bar");
let baseTable = document.getElementById("basetable");
if (baseTable instanceof HTMLDivElement && bar instanceof HTMLDivElement && naviDiv instanceof HTMLDivElement && div instanceof HTMLDivElement && tabDiv instanceof HTMLDivElement && headBarDiv instanceof HTMLDivElement) {
    let baseTableManager = new BaseTableManager(baseTable, bar, naviDiv, div);
    window.addEventListener('resize', () => {
        baseTableManager.moveBar(div.clientWidth);
    });
    let tabManager = new TabManager(tabDiv);
    let editor = new EditorControlerAdapter();
    const serviceCollection = new ServiceCollection();
    const instantiationService = new InstantiationService(serviceCollection);
    let descriptor = new SyncDescriptor(FileExplorerDiv, [tabManager, editor, instantiationService], true);
    serviceCollection.register(IFileManager, descriptor);
    let settings = new Settings(editor);
    serviceCollection.register(ISettings, settings);
    let fileManager;
    instantiationService.invokeFunction((accessor) => {
        fileManager = accessor.get(IFileManager);
    });
    let headBar = new ViewTopBar(headBarDiv, instantiationService, baseTableManager, tabManager.getTabCreator());
    let navi = new NaviMenu(naviDiv, div, [fileManager], baseTableManager);
    document.body.appendChild(FileLeftClickMenu.fileRightClickMenuDiv);
    document.body.appendChild(ContextMenu.contextMenuDiv);
    ContextMenu.contextMenuDiv.id = "TESTID";
    document.addEventListener("contextMenu", () => {
        FileLeftClickMenu.removeMenu();
    });
    document.addEventListener("click", (e) => {
        if (e.target instanceof HTMLDivElement && FileLeftClickMenu.state == "true" && FileLeftClickMenu.target != e.target) {
            FileLeftClickMenu.removeMenu();
        }
        ContextMenu.removeMenu();
    });
    globalThis.electron.getArgs().then((args) => {
        if (args.length > 1 && args[1].length > 2) {
            instantiationService.invokeFunction((accessor) => {
                const fileManager = accessor.get(IFileManager);
                fileManager.openFileByUrl(args[1]);
            });
        }
    });
    tabDiv.addEventListener('drop', (event) => {
        event.preventDefault();
        event.stopPropagation();
        instantiationService.invokeFunction((instantiationService) => {
            const fileManager = instantiationService.get(IFileManager);
            for (const file of event.dataTransfer.files) {
                let path = file.path;
                fileManager.openFileByUrl(path);
            }
        });
    });
    tabDiv.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.stopPropagation();
    });
}
