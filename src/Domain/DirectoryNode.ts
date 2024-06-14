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
            self.updateTree()
            })
        })
        return ret
    }



    oberverUpdate(){
        let self = this
        self.updateTree()
    }

    updateTree() {
        let self = this
        console.log("udpate Tree")
        let ret = new Promise((resolve,rejeted) => {        
        globalThis.electron.getFilesInFolder(this.getUrl()  ).then(function(files){
            let objectNames: Array<string>= []
            for(let file of files){
                objectNames.push(file.name)
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

            let newFilesList = []
            let newDirsList = []
            self.files.forEach((file)=> {
                if(objectNames.includes(file.name))newFilesList.push(file)
            })
            self.dirs.forEach((file)=> {
                if(objectNames.includes(file.name))newDirsList.push(file)
            })
            self.files = newFilesList
            self.dirs = newDirsList
            
            console.log("TreeStack Updated")
            self.observerUpdated()
            resolve(true)
        })
        })
        return ret
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

