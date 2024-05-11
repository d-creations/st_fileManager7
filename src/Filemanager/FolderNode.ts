import { FileContextMenu } from "./FileContextMenu.js"
import { FileNode } from "./FileNode.js"
import { FileStream } from "./LocalFileManager.js"
import { StorageNode } from "./StorageNode.js"



export class FolderNode extends StorageNode{

    private open : boolean
    private files : FileNode[]
    private dirs : FolderNode[]
    private fileStream : FileStream

    constructor(path : string, name : string,fileStrem : FileStream){        
        super(path,name)
        this.fileStream = fileStrem
        this.open = false
        this.files = []
        this.dirs = []
    }


    createDivs(parentDiv : HTMLDivElement, spaceLeft : number) {
        this.spaceLeft = spaceLeft
        this.headDiv = document.createElement("div")
        this.headDiv.setAttribute("divname" , "FOLDER HEADDIV" + this.name)
        this.headDiv.style.marginLeft = spaceLeft + "pt"
        this.headDiv.classList.add("selectable")
        parentDiv.appendChild(this.headDiv)
        this.bodyDiv = document.createElement("div")
        this.bodyDiv.setAttribute("divname" , "FOLDER bodydiv" + this.name)
        this.bodyDiv.style.marginLeft = spaceLeft + "pt"
        
        parentDiv.appendChild(this.bodyDiv)
        this.headDiv.addEventListener("click",(e) =>{
            if(this.open)this.open = false
            else this.open = true
            this.updateDivs()
        })

        this.headDiv.addEventListener("contextmenu", (e) => {
            FileContextMenu.showContextMenu(this.path,this.name,e)
        });
        this.updateDivs()
    }


    updateDivs(){        
        let addSpaceLeft = this.spaceLeft + 4
        while (this.bodyDiv instanceof HTMLDivElement && this.bodyDiv.firstChild) {
            this.bodyDiv.removeChild(this.bodyDiv.firstChild);
        }
        if(this.open){
            this.headDiv.innerText = "V  " + this.name
            for(let file of this.files){
                    file.createDivs(this.bodyDiv,addSpaceLeft )
            }
            for(let folders of this.dirs){
                folders.createDivs(this.bodyDiv,addSpaceLeft)
            }    
        }  
        else{
            this.headDiv.innerText = ">  " + this.name
        }
    }
    
    


    async update(){
        let path = this.path+"\\" + this.name 
        let files = await globalThis.electron.getFilesInFolder(path  )
        for(let file of files){
            if(file.type == 'file'){
                this.files.push(new FileNode(this.path +"\\" + this.name,file.name,this.fileStream))
            }
            if(file.type == 'directory'){
                let folder = new FolderNode(this.path +"\\" + this.name ,file.name,this.fileStream)
                await folder.update()
                this.dirs.push(folder)
            }
        }
        
    }

    public async print(space? : string){
        if( space === null) space = ""
        console.log( space+this.name)
        for(let folder of this.dirs){
            folder.print(space  + "  ")
        }
        for(let file of this.files){
            file.print(space  + "  ")
        }

    }
}