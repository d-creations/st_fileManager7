import { EditorControlerAdapter } from "./Domain/EditorContollerAdapter.js";
import { BaseTableManager } from "./View/BaseTableManager.js";
import { ContextMenu } from "./View/ContextMenu.js";
import { DirectoryHeadDiv, DirectoryDiv } from "./View/DirectoryDiv.js";
import { FileDiv } from "./View/FileDiv.js";
import { FileExplorerDiv } from "./View/FileExplorerDiv.js";
import { FileLeftClickMenu } from "./View/FileLeftClickMenu.js";
import { NaviMenu } from "./View/NaviManager/NaviMenu.js";
import { StorageDiv } from "./View/StorageDiv.js";
import { TabManager_I, TabManager } from "./View/TabManager/TabManager.js";
import { ViewTopBar } from "./View/ViewTopBar.js";


customElements.define('directory-head-div', DirectoryHeadDiv, {extends: 'div'});

customElements.define('storage-div', StorageDiv, {extends: 'div'});
customElements.define('directory-div', DirectoryDiv, {extends: 'div'});
customElements.define('file-div', FileDiv, {extends: 'div'});
customElements.define('file-explorer-div', FileExplorerDiv, {extends: 'div'});

let div = document.getElementById("windowFileExpolorer")
let tabDiv = document.getElementById("windowMainView");
let headBarDiv = document.getElementById("headerBar");
let naviDiv = document.getElementById("navi");
let bar = document.getElementById("bar");
let baseTable = document.getElementById("basetable");



if(baseTable instanceof HTMLDivElement&&bar instanceof HTMLDivElement&& naviDiv instanceof HTMLDivElement&&div instanceof HTMLDivElement&& tabDiv instanceof HTMLDivElement && headBarDiv instanceof HTMLDivElement){

  let baseTableManager = new BaseTableManager(baseTable,bar,naviDiv,div)
  window.addEventListener('resize', ()=>{
    baseTableManager.moveBar(div.clientWidth)
  })

  let tabManager : TabManager_I = new TabManager(tabDiv)
  let editor : EditorControlerAdapter = new EditorControlerAdapter()
  let fileManager = new FileExplorerDiv(tabManager,editor) 
  let headBar = new ViewTopBar(headBarDiv,fileManager,baseTableManager,tabManager.getTabCreator())
  let navi : NaviMenu = new NaviMenu(naviDiv,div,[fileManager],baseTableManager)
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
    })
    globalThis.electron.getArgs().then((args)=>{
      if(args.length>1 && args[1].length>2){  
        fileManager.openFileByUrl(args[1])
      }
    })


      tabDiv.addEventListener('drop', (event) => {
            event.preventDefault();
            event.stopPropagation();
            for (const file of event.dataTransfer.files) {
              let path = (file as unknown as { path }).path
              fileManager.openFileByUrl(path);
            }           
          });

    
      tabDiv.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.stopPropagation();
          });

}


