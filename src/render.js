import { LocalFileManager } from "./Filemanager/LocalFileManager.js";
console.log("TEST");
let div = document.getElementById("fileExpolorer");
if (div instanceof HTMLDivElement) {
    let fileManager = new LocalFileManager(div);
}
