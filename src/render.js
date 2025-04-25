import { FileSystemService } from "./Domain/FileSystemService.js";
import { BaseDivView, IBaseDivView } from "./View/BaseDivView/BaseDivView.js";
import { ContextMenu } from "./View/ContextMenu.js";
import { DirectoryHeadDiv, DirectoryDiv } from "./View/TreeView/DirectoryDiv.js";
import { FileDiv } from "./View/TreeView/FileDiv.js";
import { TreeView } from "./View/TreeView/TreeView.js";
import { FileLeftClickMenu } from "./View/FileLeftClickMenu.js";
import { NaviMenu, INaviMenu } from "./View/NaviManager/NaviMenu.js";
import { StorageDiv } from "./View/TreeView/StorageDiv.js";
import { TabManager, ITabManager } from "./View/TabManager/TabManager.js";
import { ViewTopBar } from "./View/ViewTopBar/ViewTopBar.js";
import { ServiceCollection, SyncDescriptor } from "./tecnicalServices/instantiation/ServiceCollection.js";
import { ITreeView } from "./View/TreeView/ITreeView.js";
import { InstantiationService } from "./tecnicalServices/instantiation/InstantiationService.js";
import { ISettings, Settings } from "./tecnicalServices/Settings.js";
import { IFileSystemService } from "./ViewDomainI/Interfaces.js";
import { LocalStorageService } from "./tecnicalServices/fileSystem/LocalStorageServiceService.js";
import { IStorageService } from "./tecnicalServices/fileSystem/IStroageService.js";
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
    customElements.define('file-explorer-div', TreeView, { extends: 'div' });
}
let fileExplorerDiv = document.getElementById("windowFileExpolorer");
let tabDiv = document.getElementById("windowMainView");
let headBarDiv = document.getElementById("headerBar");
let naviDiv = document.getElementById("navi");
let bar = document.getElementById("bar");
let baseTable = document.getElementById("basetable");
if (baseTable instanceof HTMLDivElement && bar instanceof HTMLDivElement && naviDiv instanceof HTMLDivElement && fileExplorerDiv instanceof HTMLDivElement && tabDiv instanceof HTMLDivElement && headBarDiv instanceof HTMLDivElement) {
    const serviceCollection = new ServiceCollection();
    const instantiationService = new InstantiationService(serviceCollection);
    const fileSystemServiceDescriptor = new SyncDescriptor(LocalStorageService, [], true);
    serviceCollection.register(IStorageService, fileSystemServiceDescriptor);
    const editorDescriptor = new SyncDescriptor(FileSystemService, [], true);
    serviceCollection.register(IFileSystemService, editorDescriptor);
    const treeViewDescriptor = new SyncDescriptor(TreeView, [], true);
    serviceCollection.register(ITreeView, treeViewDescriptor);
    const settingsDescriptor = new SyncDescriptor(Settings, [], true);
    serviceCollection.register(ISettings, settingsDescriptor);
    const baseTableManager = new BaseDivView(baseTable, bar, naviDiv, fileExplorerDiv);
    serviceCollection.register(IBaseDivView, baseTableManager);
    window.addEventListener('resize', () => {
        baseTableManager.moveBar(fileExplorerDiv.clientWidth);
    });
    const tabManagerDescriptor = new SyncDescriptor(TabManager, [tabDiv], true);
    serviceCollection.register(ITabManager, tabManagerDescriptor);
    let treeView;
    instantiationService.invokeFunction((accessor) => {
        treeView = accessor.get(ITreeView);
    });
    const naviMenuDescriptor = new SyncDescriptor(NaviMenu, [naviDiv, fileExplorerDiv, treeView, baseTableManager], true);
    serviceCollection.register(INaviMenu, naviMenuDescriptor);
    let headBar;
    let navi;
    instantiationService.invokeFunction((accessor) => {
        const treeViewInstance = accessor.get(ITreeView);
        const tabManagerInstance = accessor.get(ITabManager);
        const baseDivViewInstance = accessor.get(IBaseDivView);
        headBar = instantiationService.createInstance(ViewTopBar, treeViewInstance, baseDivViewInstance, headBarDiv, tabManagerInstance);
        navi = accessor.get(INaviMenu);
        if (!(treeViewInstance instanceof HTMLDivElement) || treeViewInstance !== fileExplorerDiv) {
            console.warn("TreeView instance is not the expected HTMLDivElement 'windowFileExpolorer'. NaviMenu might not display correctly.");
        }
    });
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
                const fileManager = accessor.get(ITreeView);
                fileManager.openFileByUrl(args[1]);
            });
        }
    });
    tabDiv.addEventListener('drop', (event) => {
        event.preventDefault();
        event.stopPropagation();
        instantiationService.invokeFunction((accessor) => {
            const treeView = accessor.get(ITreeView);
            for (const file of event.dataTransfer.files) {
                let path = file.path;
                treeView.openFileByUrl(path);
            }
        });
    });
    tabDiv.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.stopPropagation();
    });
}
