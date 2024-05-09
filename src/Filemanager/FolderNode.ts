import { FileNode } from "./FileNode.js"



export class FolderNode{

    path : string
    name : string
    open : boolean
    files : FileNode[]
    dirs : FolderNode[]

    constructor(path : string){
        this.name = path
        this.path = path
        this.open = false
        this.files = []
        this.dirs = []

    }

    async update(){
        console.log(this.path)
        let files = await globalThis.electron.getFilesInFolder(this.path)
        for(let file of files){
            console.log(file.type)
            if(file.type == 'file')this.files.push(new FileNode(this.path+"\\"+file.name))
            if(file.type == 'directory')this.dirs.push(new FolderNode(this.path+"\\"+file.name))
        }
    }

    public async print(space? : string){
        await this.update()
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