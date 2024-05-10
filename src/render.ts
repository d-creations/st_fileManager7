import { FileContextMenu } from "./Filemanager/FileContextMenu.js"
import { LocalFileManager } from "./Filemanager/LocalFileManager.js"


let div = document.getElementById("fileExpolorer")
if(div instanceof HTMLDivElement){
let fileManager = new LocalFileManager(div)
document.body.appendChild(FileContextMenu.contextMenuDiv)
FileContextMenu.createMenu() 

    // add an event listener for the click event on the document
    document.addEventListener("click", () => {
        // hide the menu element
        FileContextMenu.removeContextMenu() 
      });
}