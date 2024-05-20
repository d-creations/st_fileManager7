import { FileNode } from "./FileNode";
import { LocalFileManager } from "./LocalFileManager";
import { StorageNode } from "./StorageNode";



export class FileContextMenu{
    static contextMenuDiv = document.createElement("div")
    private storageNode : StorageNode;

    constructor(storageNode : StorageNode){
        this.storageNode = storageNode
    }
    public showContextMenu(e : Event){
        this.createMenu()
        FileContextMenu.contextMenuDiv.classList.remove("showConextMenu","hiddenConextMenu")
        FileContextMenu.contextMenuDiv.classList.add("showConextMenu")
        let pos = FileContextMenu.getPosition(e)
        FileContextMenu.contextMenuDiv.style.left = pos.x + "px";
        FileContextMenu.contextMenuDiv.style.top = pos.y + "px";
    }

    static removeContextMenu(){
        FileContextMenu.contextMenuDiv.classList.remove("showConextMenu","hiddenConextMenu")
        FileContextMenu.contextMenuDiv.classList.add("hiddenConextMenu")
        while(FileContextMenu.contextMenuDiv.firstChild){
            FileContextMenu.contextMenuDiv.removeChild(FileContextMenu.contextMenuDiv.firstChild)
        }
    }
    public createMenu(){
        FileContextMenu.contextMenuDiv.classList.remove("showConextMenu","hiddenConextMenu")
        let deleteDiv = document.createElement("div")
        let createFolderDiv = document.createElement("div")
        let createDocumentDiv = document.createElement("div")
        let renameDocumentDiv = document.createElement("div")
        let copyDocumentDiv = document.createElement("div")

        deleteDiv.classList.add("selectable","contextMenu")
        createFolderDiv.classList.add("selectable","contextMenu")
        createDocumentDiv.classList.add("selectable","contextMenu")
        renameDocumentDiv.classList.add("selectable","contextMenu")
        copyDocumentDiv.classList.add("selectable","contextMenu")

        deleteDiv.innerText = "delete"
        createFolderDiv.innerText = "create Folder"
        createDocumentDiv.innerText = "create File"
        renameDocumentDiv.innerText = "rename File"
        copyDocumentDiv.innerText = "copy File"

        FileContextMenu.contextMenuDiv.appendChild(deleteDiv)
        FileContextMenu.contextMenuDiv.appendChild(createFolderDiv)
        FileContextMenu.contextMenuDiv.appendChild(createDocumentDiv)
        FileContextMenu.contextMenuDiv.appendChild(renameDocumentDiv)

        let storageNode = this.storageNode

        deleteDiv.addEventListener("click", (e)=> {
            if(confirm("delete" + this.storageNode.getUrl()))globalThis.electron.deleteFileOrFolder(this.storageNode.getUrl())
        })

        renameDocumentDiv.addEventListener("click", (e)=> {
            console.log("rename" + this.storageNode.getUrl())
            storageNode.rename()
        })
        createFolderDiv.addEventListener("click", (e)=> {
            console.log("createFolder" + storageNode.getUrl())
            globalThis.electron.createFolder(storageNode.getUrl())
        })
        createDocumentDiv.addEventListener("click", (e)=> {
            console.log("createDoc" + storageNode.getUrl())
            globalThis.electron.getFilesInFolder(storageNode.getUrl()).then((files) =>{
                let newRootFileName = "new File"
                let newFileName = newRootFileName
                for(let i = 0;i<10;i++){
                    if(!files.contains(newFileName + ".txt")){
                        globalThis.electron.saveFile(storageNode.getUrl()+"\\"+ newFileName+".txt","")
                        storageNode.updated()
                        break
                    }
                    newFileName = newRootFileName+String(i)
                }

            })
        })
        copyDocumentDiv.addEventListener("click", (e)=> {
            console.log("createDoc" + storageNode.getUrl()+ "\\neu.text")
        })
   
    }

    static getPosition(e) {
        let posx = 0;
        let  posy = 0;
        if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
        } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
        }
        return {
        x: posx,
        y: posy
        }
        }
}