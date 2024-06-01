import { FileNode } from "./FileNode.js";
import { StorageNode2 } from "./StorageNode2.js";



export class DirectoryNode extends StorageNode2{


    
    public files : FileNode[]
    public dirs : DirectoryNode[]

    constructor(path : string, name : string){
        super(path,name)
        this.files = []
        this.dirs = []
    }

    update() {
        throw new Error("Method not implemented.");
    }
    getName(): string {
        return this.name
    }
    print(string: any) {
        throw new Error("Method not implemented.");
    }
    createDivs(parentDiv: HTMLDivElement, spaceLeft: number) {
        throw new Error("Method not implemented.");
    }
    public oberverUpdate(): void {
        this.updateTree()
    }

    async updateTree() {
        let path = this.path+"\\" + this.name 
        let thisDirectoryNode = this
        await globalThis.electron.getFilesInFolder(path  ).then(async function(files){
            for(let file of files){
                if(file.type == 'file'){
                    thisDirectoryNode.files.push(new FileNode(thisDirectoryNode.path +"\\" + thisDirectoryNode.name,file.name))
                }
                if(file.type == 'directory'){
                    let directory = new DirectoryNode(thisDirectoryNode.path +"\\" + thisDirectoryNode.name ,file.name)
                    await directory.updateTree()
                    thisDirectoryNode.dirs.push(directory)
                }
            }
        })
    }
}