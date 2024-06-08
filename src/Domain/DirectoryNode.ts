import { FileNode } from "./FileNode.js";
import { StorageNode2 } from "./StorageNode2.js";
import { DirectoryNode_EXC_I } from "../ViewDomainI/Interfaces";



export class DirectoryNode extends StorageNode2 implements DirectoryNode_EXC_I{


    
    public files : FileNode[]
    public dirs : DirectoryNode[]

    constructor(rootNode : StorageNode2, name : string){
        super(rootNode,name)
        this.files = []
        this.dirs = []
        this.updateTree()
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
    async oberverUpdate(): Promise<any> {
    }

    async updateTree() {
        let thisDirectoryNode = this
        console.log("udpate Tree")
        await globalThis.electron.getFilesInFolder(this.getUrl()  ).then(async function(files){
            for(let file of files){
                if(file.type == 'file'){
                    thisDirectoryNode.files.push(new FileNode(thisDirectoryNode,file.name))
                }
                if(file.type == 'directory'){
                    let directory = new DirectoryNode(thisDirectoryNode ,file.name)
                    thisDirectoryNode.dirs.push(directory)
                }
            }
        })
    }
}