import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_I } from "../ViewDomainI/Interfaces";
import { TabCreator } from "./TabManager/TabCreator.js";
import { ContextMenu } from "./ContextMenu.js";
import { FileDiv } from "./FileDiv.js";
import { StorageDiv } from "./StorageDiv.js";



export class DirectoryHeadDiv extends StorageDiv{

    public stateOpen : boolean
    private directoryNode : DirectoryNode_EXC_I
    private symbole : HTMLDivElement
    public nameDiv : HTMLDivElement
    constructor(directoryNode : DirectoryNode_EXC_I,editor : EditorControlerAdapter_EXC_I){
        super(editor,directoryNode)
        this.innerText = ""
        this.directoryNode = directoryNode
        this.symbole = document.createElement("div")
        this.appendChild(this.symbole)
        this.symbole.contentEditable == "false"
        this.symbole.innerText = "> "
        this.symbole.classList.add("inline")
        this.symbole.contentEditable == "false"

        this.nameDiv = document.createElement("div")
        this.appendChild(this.nameDiv)
        this.nameDiv.innerText = this.editor.getStorageName(this.directoryNode)
        this.nameDiv.classList.add("inline")
        this.directoryNode.addObserver(this)

    }
    updateElement(){
        if(!this.stateOpen){
            this.symbole.innerText = "> "
            }
        else{
            this.symbole.innerText = "v "
        }  
    }

    getName(){
        return this.nameDiv.innerText
    }

    
    setName(name : string){
        this.nameDiv.innerText = name
        return
    }
    setEditable(state : string){
        this.nameDiv.contentEditable = state
    }

    public oberverUpdate(): void {
        console.log("FS update")
        this.setName(this.editor.getStorageName(this.directoryNode));
    }

}



export class DirectoryDiv extends StorageDiv{
    
    private directoryHeadDiv : DirectoryHeadDiv
    private directoryBodyDiv : HTMLDivElement
    private directoryNode : DirectoryNode_EXC_I
    private tabCreator : TabCreator

    constructor(directoryNode : DirectoryNode_EXC_I,editor : EditorControlerAdapter_EXC_I,tabCreator : TabCreator){
        super(editor,directoryNode)
        this.tabCreator = tabCreator
        this.directoryHeadDiv = new DirectoryHeadDiv(directoryNode,editor)
        this.directoryBodyDiv = document.createElement("div")
        this.directoryNode = directoryNode
        this.directoryNode.addObserver(this)

        
        this.directoryHeadDiv.nameDiv.contentEditable = "false"
        this.directoryHeadDiv.setAttribute("divname" , "FOLDER HEADDIV" + this.editor.getStorageName(directoryNode))
        this.directoryHeadDiv.classList.add("selectable")
        this.directoryBodyDiv = document.createElement("div")
        this.directoryBodyDiv.setAttribute("divname" , "FOLDER bodydiv" + this.editor.getStorageName(directoryNode))

        
        this.directoryHeadDiv.addEventListener("click",(e) =>{
            if( e.target instanceof HTMLDivElement && e.target.contentEditable == "false"){
                if(this.directoryHeadDiv.stateOpen)this.closeDirectory()
                else this.openDirectory()
            }
        })
        this.directoryHeadDiv.addEventListener("contextmenu", (e) => {
           let fileContextMenu = new ContextMenu(this.directoryHeadDiv);
           fileContextMenu.showMenu(e);
        });
        this.createDiv()
    }

    openDirectory(){
        this.directoryHeadDiv.stateOpen = true
        this.createDiv()
    }
    closeDirectory(){
        this.directoryHeadDiv.stateOpen = false    
        this.createDiv()
    }

    getName(){
        return this.directoryHeadDiv.nameDiv.innerText
    }

    
    setName(name : string){
        this.directoryHeadDiv.nameDiv.innerText = name
        return
    }
    setEditable(state : string){
        this.directoryHeadDiv.nameDiv.contentEditable == state
    }
    oberverUpdate():void{
        this.createDiv()
    }

    createDiv(): void {        
        this.innerText = this.editor.getStorageName(this.directoryNode);
        console.log("directory div update")
        while(this.firstChild){
            this.removeChild(this.firstChild)
        }
        while(this.directoryBodyDiv.firstChild){
            this.directoryBodyDiv.removeChild(this.directoryBodyDiv.firstChild)
        }
        this.appendChild(this.directoryHeadDiv)
        this.appendChild(this.directoryBodyDiv)
        this.classList.add("directoryDiv")
        this.directoryHeadDiv.updateElement()
        if(this.directoryHeadDiv.stateOpen){
            let fileTree =  this.editor.getFileTree(this.directoryNode)
            for(let file of fileTree.files){
                let fileDiv = new FileDiv(file,this.editor,this.tabCreator)
                this.directoryBodyDiv.appendChild(fileDiv)
            }
            for(let dir of fileTree.dirs){
                let fileDiv = new DirectoryDiv(dir,this.editor,this.tabCreator)
                this.directoryBodyDiv.appendChild(fileDiv)
            }    
        }
    }

    

    

}