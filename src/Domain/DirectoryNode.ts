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
        let self = this
        let ret = new Promise((resolve, reject) => {
        let url = rootDirectory.getUrl()
        self.createFolder(url).then(()=>{
            self.updateTree().then(()=>{
                resolve(true)
            })
        })
        })
        return ret
    }

    createNewFile(rootDirectory: StorageNode2) :Promise<boolean | unknown>{
        let self = this
        let ret = new Promise((resolve, reject) => {
        let url = rootDirectory.getUrl()
        self.createFile(url).then(()=> {
            self.updateTree().then(
                    ()=> resolve(true)
                    )
                })
        })
        return ret
    }



    async oberverUpdate(): Promise<any> {
        let self = this
        let ret = new Promise((resolve,rejeted) => {
            let dirsU = self.dirs.filter((dir)=> !dir.isDeleted())
            let filesU = self.files.filter((dir)=> !dir.isDeleted())
            self.dirs = dirsU
            self.files = filesU
            self.updateTree().then(
                ()=>{resolve(true)                
                self.observerUpdated()
                }
            )
        })
    }

    async updateTree() {
        let self = this
        console.log("udpate Tree")
        await globalThis.electron.getFilesInFolder(this.getUrl()  ).then(async function(files){
            for(let file of files){
                if(file.type == 'file'){
                    if(self.notFileExist(self,file)){
                    let fileNode = new FileNode(self,file.name)
                    self.files.push(fileNode)
                    fileNode.addObserver(self)
                    }
                }
                if(file.type == 'directory'){
                    
                    if(self.notDivExist(self,file)){
                    let directory = new DirectoryNode(self ,file.name)
                    self.dirs.push(directory)
                    directory.addObserver(self)
                    }
                }
            }
        })
    }

     notFileExist(self: DirectoryNode, file: any) : boolean{
        for(let fileNodeI of self.files){
            if(fileNodeI.name === file.name)
                return false
        }
        return true
    }

     notDivExist(self: DirectoryNode, file: any) : boolean{
        for(let fileNodeI of self.dirs){
            if(fileNodeI.name === file.name)
                return false
        }
        return true
    }
    
}

