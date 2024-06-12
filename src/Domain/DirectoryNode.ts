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

    getName(): string {
        return this.name
    }

    
    createNewFolder(rootDirectory  : StorageNode2) :Promise<boolean | unknown>{
        let url = rootDirectory.getUrl()
        return this.createFolder(url)
    }

    createNewFile(rootDirectory: StorageNode2) :Promise<boolean | unknown>{
        let url = rootDirectory.getUrl()
        return this.createFile(url)
    }



    async oberverUpdate(): Promise<any> {
        let dirsU = this.dirs.filter((dir)=> !dir.isDeleted())
        let filesU = this.files.filter((dir)=> !dir.isDeleted())
        this.dirs = dirsU
        this.files = filesU
        this.observerUpdated()
    }

    async updateTree() {
        let self = this
        console.log("udpate Tree")
        await globalThis.electron.getFilesInFolder(this.getUrl()  ).then(async function(files){
            for(let file of files){
                if(file.type == 'file'){
                    let fileNode = new FileNode(self,file.name)
                    self.files.push(fileNode)
                    fileNode.addObserver(self)
                }
                if(file.type == 'directory'){
                    let directory = new DirectoryNode(self ,file.name)
                    self.dirs.push(directory)
                    directory.addObserver(self)
                }
            }
        })
    }
}