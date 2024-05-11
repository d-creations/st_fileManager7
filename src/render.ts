import { FileContextMenu } from "./Filemanager/FileContextMenu.js"
import { FileRightClickMenu } from "./Filemanager/FileRightClickMenu.js";
import { LocalFileManager } from "./Filemanager/LocalFileManager.js"
import { TabManager, TabManager_I } from "./TabManager/TabManager.js";
import { ViewTopBar } from "./View/ViewTopBar.js";


let div = document.getElementById("windowFileExpolorer")
let tabDiv = document.getElementById("windowMainView");
let headBarDiv = document.getElementById("headerBar");

if(div instanceof HTMLDivElement&& tabDiv instanceof HTMLDivElement && headBarDiv instanceof HTMLDivElement){
  FileContextMenu.createMenu() 
  let tabManager : TabManager_I = new TabManager(tabDiv)
  let fileManager = new LocalFileManager(div,tabManager)
  let headBar = new ViewTopBar(headBarDiv,fileManager)
  document.body.appendChild(FileContextMenu.contextMenuDiv)
  document.body.appendChild(FileRightClickMenu.fileRightClickMenuDiv)
  
  FileContextMenu.removeContextMenu()

    document.addEventListener("click", () => {
      
      FileContextMenu.removeContextMenu()
      });

      document.addEventListener("contextMenu", () => {
        
        FileRightClickMenu.removeContextMenu()
      });
}