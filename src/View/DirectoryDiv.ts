import { DirectoryNode } from "../Domain/DirectoryNode.js";
import { EditorControlerAdapter } from "../Domain/EditorContollerAdapter.js";
import { TabCreator } from "./TabManager/TabCreator.js";
import { ContextMenu } from "./ContextMenu.js";
import { FileDiv } from "./FileDiv.js";
import { StorageDiv } from "./StorageDiv.js";



export class DirectoryHeadDiv extends StorageDiv{

    public stateOpen : boolean
    private directoryNode : DirectoryNode
    constructor(directoryNode : DirectoryNode,editor : EditorControlerAdapter){
        super(editor,directoryNode)
        this.directoryNode = directoryNode
    }
    updateElement(){
        if(!this.stateOpen)this.innerText = ">  " +this.editor.getStorageName(this.directoryNode)
            else this.innerText = "V  " +this.editor.getStorageName(this.directoryNode)
    
    }

}


export class DirectoryDiv extends StorageDiv{
    
    private directoryHeadDiv : DirectoryHeadDiv
    private directoryBodyDiv : HTMLDivElement
    private directoryNode : DirectoryNode
    private spaceLeft : number
    private tabCreator : TabCreator
    open: boolean ;

    constructor(directoryNode : DirectoryNode,editor : EditorControlerAdapter,tabCreator : TabCreator,spaceLeft : number){
        super(editor,directoryNode)
        this.tabCreator = tabCreator
        this.directoryHeadDiv = new DirectoryHeadDiv(directoryNode,editor)
        this.directoryBodyDiv = document.createElement("div")
        this.directoryNode = directoryNode
        this.updateElement()
        this.spaceLeft = 1
        this.open = false
        this.spaceLeft = spaceLeft
        
        this.directoryHeadDiv.contentEditable == "false"
        this.directoryHeadDiv.setAttribute("divname" , "FOLDER HEADDIV" + this.editor.getStorageName(directoryNode))
        this.directoryHeadDiv.style.marginLeft = spaceLeft + "pt"
        this.directoryHeadDiv.classList.add("selectable")
        this.directoryBodyDiv = document.createElement("div")
        this.directoryBodyDiv.setAttribute("divname" , "FOLDER bodydiv" + this.editor.getStorageName(directoryNode))
        this.directoryBodyDiv.style.marginLeft = spaceLeft + "pt"
        this.oberverUpdate()
        this.directoryHeadDiv.addEventListener("click",(e) =>{
            if(this.directoryHeadDiv.stateOpen)this.directoryHeadDiv.stateOpen = false
            else this.directoryHeadDiv.stateOpen = true
            this.oberverUpdate()        
        })

        let test = this
        this.directoryHeadDiv.addEventListener("contextmenu", (e) => {
           let fileContextMenu = new ContextMenu(this.directoryHeadDiv);
           fileContextMenu.showMenu(e);
        });


    }

    oberverUpdate(): void {
        while(this.firstChild){
            this.removeChild(this.firstChild)
        }
        while(this.directoryBodyDiv.firstChild){
            this.directoryBodyDiv.removeChild(this.directoryBodyDiv.firstChild)
        }
        this.appendChild(this.directoryHeadDiv)
        this.appendChild(this.directoryBodyDiv)
        this.directoryHeadDiv.updateElement()
        if(this.directoryHeadDiv.stateOpen){
            let addSpaceLeft = this.spaceLeft + 4
            let fileTree =  this.editor.getFileTree(this.directoryNode)
            for(let file of fileTree.files){
                let fileDiv = new FileDiv(file,this.editor,this.tabCreator,addSpaceLeft)
                this.directoryBodyDiv.appendChild(fileDiv)
                    file.addObserver(this)
            }
            for(let dir of fileTree.dirs){
                let fileDiv = new DirectoryDiv(dir,this.editor,this.tabCreator,addSpaceLeft)
                this.directoryBodyDiv.appendChild(fileDiv)
                dir.addObserver(this)

            }    
        }
    }

    

    

}