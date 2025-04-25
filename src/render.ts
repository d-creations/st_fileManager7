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

// Ensure custom elements are defined only once
if (!customElements.get('directory-head-div')) {
  customElements.define('directory-head-div', DirectoryHeadDiv, {extends: 'div'});
}
if (!customElements.get('storage-div')) {
  customElements.define('storage-div', StorageDiv, {extends: 'div'});
}
if (!customElements.get('directory-div')) {
  customElements.define('directory-div', DirectoryDiv, {extends: 'div'});
}
if (!customElements.get('file-div')) {
  customElements.define('file-div', FileDiv, {extends: 'div'});
}
if (!customElements.get('file-explorer-div')) {
  customElements.define('file-explorer-div', TreeView, {extends: 'div'});
}

let fileExplorerDiv = document.getElementById("windowFileExpolorer")
let tabDiv = document.getElementById("windowMainView");
let headBarDiv = document.getElementById("headerBar");
let naviDiv = document.getElementById("navi");
let bar = document.getElementById("bar");
let baseTable = document.getElementById("basetable");

if(baseTable instanceof HTMLDivElement && bar instanceof HTMLDivElement && naviDiv instanceof HTMLDivElement && fileExplorerDiv instanceof HTMLDivElement && tabDiv instanceof HTMLDivElement && headBarDiv instanceof HTMLDivElement){



  // Initialize the ServiceCollection and InstantiationService
  const serviceCollection = new ServiceCollection();
  const instantiationService = new InstantiationService(serviceCollection);

  // Register IFileSystemService using SyncDescriptor
  const fileSystemServiceDescriptor = new SyncDescriptor(LocalStorageService, [], true);
  serviceCollection.register(IStorageService, fileSystemServiceDescriptor);

  // Register EditorControlerAdapter
  // EditorControlerAdapter requires IFileSystemService, which will now be resolved by DI
  const editorDescriptor = new SyncDescriptor(FileSystemService, [], true);
  serviceCollection.register(IFileSystemService, editorDescriptor);

  // Register TreeView
  const treeViewDescriptor = new SyncDescriptor(TreeView, [], true);
  serviceCollection.register(ITreeView, treeViewDescriptor);

  // Register Settings
  // Settings requires EditorControlerAdapter_EXC_I, which will be resolved by DI
  const settingsDescriptor = new SyncDescriptor(Settings, [], true);
  serviceCollection.register(ISettings, settingsDescriptor);

  // Register BaseDivView
  const baseTableManager = new BaseDivView(baseTable, bar, naviDiv, fileExplorerDiv);
  serviceCollection.register(IBaseDivView, baseTableManager);
  window.addEventListener('resize', () => {
    baseTableManager.moveBar(fileExplorerDiv.clientWidth);
  });

  // Register TabManager using SyncDescriptor
  const tabManagerDescriptor = new SyncDescriptor(TabManager, [tabDiv], true);
  serviceCollection.register(ITabManager, tabManagerDescriptor);


  // Register NaviMenu - Pass ALL arguments manually via SyncDescriptor
  // Arguments: naviTab, mainTab, treeViewElement, baseTableManager
  let treeView 
  instantiationService.invokeFunction((accessor) => {
    treeView = accessor.get(ITreeView)

  });
  const naviMenuDescriptor = new SyncDescriptor(NaviMenu, [naviDiv, fileExplorerDiv, treeView, baseTableManager], true);
  serviceCollection.register(INaviMenu, naviMenuDescriptor);

  // --- Instantiate Components using DI --- 

  let headBar: ViewTopBar;
  let navi: INaviMenu;

  instantiationService.invokeFunction((accessor) => {
    // Get instances needed for manual ViewTopBar creation
    const treeViewInstance = accessor.get(ITreeView);
    const tabManagerInstance = accessor.get(ITabManager); // Get TabManager instance
    const baseDivViewInstance = accessor.get(IBaseDivView); // Get BaseDivView instance

    // Manually create ViewTopBar, passing ALL arguments since constructor has no decorators
    headBar = instantiationService.createInstance(
        ViewTopBar,
        treeViewInstance,    // 1st arg: fileManager
        baseDivViewInstance, // 2nd arg: baseTableManager
        headBarDiv,          // 3rd arg: parentDiv
        tabManagerInstance   // 4th arg: tabManager
    );

    // Instantiate NaviMenu via accessor
    navi = accessor.get(INaviMenu);

    // Ensure the 'div' element IS the treeViewInstance (check remains useful)
    // Check if the resolved ITreeView instance is actually the expected HTMLDivElement
    if (!(treeViewInstance instanceof HTMLDivElement) || treeViewInstance !== fileExplorerDiv) {
        console.warn("TreeView instance is not the expected HTMLDivElement 'windowFileExpolorer'. NaviMenu might not display correctly.");
    }
  });

  // Event Listeners and Other Setup
  document.body.appendChild(FileLeftClickMenu.fileRightClickMenuDiv)
  document.body.appendChild(ContextMenu.contextMenuDiv)
  ContextMenu.contextMenuDiv.id = "TESTID"
  document.addEventListener("contextMenu", () => {
    FileLeftClickMenu.removeMenu()
  });
  document.addEventListener("click", (e) => {
    if(e.target instanceof HTMLDivElement && FileLeftClickMenu.state == "true" && FileLeftClickMenu.target != e.target){
      FileLeftClickMenu.removeMenu()
    }
    ContextMenu.removeMenu()
  });

  globalThis.electron.getArgs().then((args)=>{
    if(args.length>1 && args[1].length>2){  
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
        let path = (file as unknown as { path }).path
        treeView.openFileByUrl(path);
      }
    });           
  });

  tabDiv.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

}


