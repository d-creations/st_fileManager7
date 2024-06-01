import { EditorControlerAdapter } from "./Domain/EditorContollerAdapter.js";
import { ContextMenu } from "./View/ContextMenu.js";
import { DirectoryHeadDiv, DirectoryDiv } from "./View/DirectoryDiv.js";
import { FileDiv } from "./View/FileDiv.js";
import { FileExplorerDiv } from "./View/FileExplorerDiv.js";
import { FileLeftClickMenu } from "./View/FileLeftClickMenu.js";
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



if(div instanceof HTMLDivElement&& tabDiv instanceof HTMLDivElement && headBarDiv instanceof HTMLDivElement){
  let tabManager : TabManager_I = new TabManager(tabDiv)
  let editor : EditorControlerAdapter = new EditorControlerAdapter()
  let fileManager = new FileExplorerDiv(tabManager,editor) 
  let headBar = new ViewTopBar(headBarDiv,fileManager)
  div.appendChild(fileManager)
  //document.body.appendChild(FileContextMenu.contextMenuDiv)
  document.body.appendChild(FileLeftClickMenu.fileRightClickMenuDiv)
  document.body.appendChild(ContextMenu.contextMenuDiv)
  document.addEventListener("contextMenu", () => {
    FileLeftClickMenu.removeMenu()
  });
  document.addEventListener("click", (e) => {
    if(e.target instanceof HTMLDivElement && e.target.getAttribute("click")!= "true" ){
      FileLeftClickMenu.removeMenu()
    }
      ContextMenu.removeMenu()
    })
  /*
  FileContextMenu.removeContextMenu()

    document.addEventListener("click", (e) => {
<      if(e.target instanceof HTMLDivElement && e.target.getAttribute("click")!= "true" ){
        FileRightClickMenu.removeContextMenu()
      }>
      FileContextMenu.removeContextMenu()
      });

      document.addEventListener("contextMenu", () => {
        FileRightClickMenu.removeContextMenu()
      });
      */
}