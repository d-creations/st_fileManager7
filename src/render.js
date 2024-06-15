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
customElements.define('directory-head-div', DirectoryHeadDiv, { extends: 'div' });
customElements.define('storage-div', StorageDiv, { extends: 'div' });
customElements.define('directory-div', DirectoryDiv, { extends: 'div' });
customElements.define('file-div', FileDiv, { extends: 'div' });
customElements.define('file-explorer-div', FileExplorerDiv, { extends: 'div' });
let div = document.getElementById("windowFileExpolorer");
let tabDiv = document.getElementById("windowMainView");
let headBarDiv = document.getElementById("headerBar");
let naviDiv = document.getElementById("navi");
let bar = document.getElementById("bar");
let baseTable = document.getElementById("basetable");
if (baseTable instanceof HTMLDivElement && bar instanceof HTMLDivElement && naviDiv instanceof HTMLDivElement && div instanceof HTMLDivElement && tabDiv instanceof HTMLDivElement && headBarDiv instanceof HTMLDivElement) {
    let baseTableManager = new BaseTableManager(baseTable, bar, naviDiv, div);
    let tabManager = new TabManager(tabDiv);
    let editor = new EditorControlerAdapter();
    let fileManager = new FileExplorerDiv(tabManager, editor);
    let headBar = new ViewTopBar(headBarDiv, fileManager, baseTableManager);
    let navi = new NaviMenu(naviDiv, div, [fileManager], baseTableManager);
    document.body.appendChild(FileLeftClickMenu.fileRightClickMenuDiv);
    document.body.appendChild(ContextMenu.contextMenuDiv);
    ContextMenu.contextMenuDiv.id = "TESTID";
    document.addEventListener("contextMenu", () => {
        FileLeftClickMenu.removeMenu();
    });
    document.addEventListener("click", (e) => {
        if (e.target instanceof HTMLDivElement && e.target.getAttribute("click") != "true") {
            FileLeftClickMenu.removeMenu();
        }
        ContextMenu.removeMenu();
    });
}
