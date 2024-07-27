import { StorageDiv } from "./StorageDiv.js";



export class ContextMenu{
    static contextMenuDiv = document.createElement("div")
    
    private pathDir = ""
    private nameFile = ""
    private fileNode : StorageDiv
    static target :HTMLDivElement;

    
    constructor (fileNode : StorageDiv){
        this.fileNode = fileNode
    }
    public showMenu(e : Event){
        if(e.target instanceof HTMLDivElement && e.target.contentEditable != "true"){
            e.target.setAttribute("click","true")
            ContextMenu.target = e.target
            
            let pos = this.getPosition(e)
            ContextMenu.removeMenu()
            ContextMenu.contextMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
            ContextMenu.contextMenuDiv.classList.add("showRightClickMenu")
            ContextMenu.contextMenuDiv.style.left = pos.x + "px";
            ContextMenu.contextMenuDiv.style.top = pos.y + "px";


            let createFolderButton = document.createElement("div")
            createFolderButton.innerText = "create Folder"
            createFolderButton.classList.add("selectable","rightClickMenu")
            ContextMenu.contextMenuDiv.appendChild(createFolderButton)
            createFolderButton.addEventListener("click", (e)=> {
                ContextMenu.removeMenu()
                console.log("createFolder")
                this.fileNode.createFolder()
            })


            let createFileButton = document.createElement("div")
            createFileButton.innerText = "create File"
            createFileButton.classList.add("selectable","rightClickMenu")
            ContextMenu.contextMenuDiv.appendChild(createFileButton)
            createFileButton.addEventListener("click", (e)=> {
                ContextMenu.removeMenu()
                console.log("create File")
                this.fileNode.createFile()
            })

            let deleteFolderButton = document.createElement("div")
            deleteFolderButton.innerText = "delete"
            deleteFolderButton.classList.add("selectable","rightClickMenu")
            ContextMenu.contextMenuDiv.appendChild(deleteFolderButton)
            deleteFolderButton.addEventListener("click", (e)=> {
                ContextMenu.removeMenu()
                console.log("delete")
                this.fileNode.deleteFileOrFolder()
            })

            let copyFolderButton = document.createElement("div")
            copyFolderButton.innerText = "copy"
            copyFolderButton.classList.add("selectable","rightClickMenu")
            ContextMenu.contextMenuDiv.appendChild(copyFolderButton)
            copyFolderButton.addEventListener("click", (e)=> {
                ContextMenu.removeMenu()
                console.log("copy")
                this.fileNode.copyStorage()
            })

            let cutFolderButton = document.createElement("div")
            cutFolderButton.innerText = "cut"
            cutFolderButton.classList.add("selectable","rightClickMenu")
            ContextMenu.contextMenuDiv.appendChild(cutFolderButton)
            cutFolderButton.addEventListener("click", (e)=> {
                ContextMenu.removeMenu()
                console.log("cut Storage")
                this.fileNode.cutStorage()
            })

            let insertFolderButton = document.createElement("div")
            insertFolderButton.innerText = "past"
            insertFolderButton.classList.add("selectable","rightClickMenu")
            ContextMenu.contextMenuDiv.appendChild(insertFolderButton)
            insertFolderButton.addEventListener("click", (e)=> {
                ContextMenu.removeMenu()
                console.log("insert Storage")
                this.fileNode.insertStorage()
            })

            let renameButton = document.createElement("div")
            renameButton.innerText ="rename"
            renameButton.classList.add("selectable","rightClickMenu")
            ContextMenu.contextMenuDiv.appendChild(renameButton)
            renameButton.addEventListener("click", (e)=> {
                ContextMenu.removeMenu()
                console.log("rename")
                this.fileNode.rename()
            })



            console.log("shoe Menu")
        }
    }

    static removeMenu(){
        if(ContextMenu.contextMenuDiv.classList.contains("showRightClickMenu")){
            ContextMenu.contextMenuDiv.classList.remove("showRightClickMenu","hiddenRightClickMenu")
            ContextMenu.contextMenuDiv.classList.add("hiddenRightClickMenu")
        while(ContextMenu.contextMenuDiv.firstChild){
            ContextMenu.contextMenuDiv.removeChild(ContextMenu.contextMenuDiv.firstChild)
        }
        ContextMenu.target.removeAttribute("click")
    }
    }

    public getPosition(e) {
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