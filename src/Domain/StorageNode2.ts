import { StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js"
import { Observable, Observer } from "../tecnicalServices/oberserver.js"
import { FileNode } from "./FileNode.js"





export abstract class StorageNode2 extends Observable implements Observer,StorageNode2_EXC_I{

    name : string
    rootStorageNode : StorageNode2 | null
    spaceLeft : number
    deleteState : boolean
    constructor(rootStorageNode : StorageNode2 | null, name : string){
            super()
            this.rootStorageNode = rootStorageNode
            this.name = name
            this.deleteState = false
            // muss gelötsht werden versuch bessere Ordnerstrukturaktuallisierung
            // nicht gelöscht damit ich die Versuche noch weis
//            if(rootStorageNode != null)this.rootStorageNode.addObserver(this)
    }
    oberverUpdate(){
    }
    
        setRoot(rootStorageNode : StorageNode2){
            this.rootStorageNode = rootStorageNode
        }
    
        setName(name : string){
            this.name = name
            this.observerUpdated()
        }

        delete(){
            let self = this
            self.deleteState = true
            globalThis.electron.deleteFileOrFolder(self.getUrl()).then(()=>
            self.observerUpdated())    
        }

        moveStorage(source: StorageNode2){
            let self = this
            console.log("copy Storage")
            globalThis.electron.copyFolderOrFile(source.getUrl(),self.getUrl()).then((state)=>{
                // if filename exist try 
                if(source instanceof FileNode && state === false){
                    console.log("file exist or error")
                    let dest: string = self.getUrl()+"\\"+source.name + "copy"
                    globalThis.electron.copyFolderOrFile(source.getUrl(),dest).then((state)=>{
                        if(state === true){
                            source.rootStorageNode = self
                            self.oberverUpdate()
                            source.oberverUpdate();
                            source.delete
                        }
                    })               
                }
                else{
                    if(state === true){
                    self.oberverUpdate()
                    source.oberverUpdate();
                    source.delete
                    }
                }
            })
        }

        copyStorage(source: StorageNode2){
            let self = this
            console.log("copy Storage")
            globalThis.electron.copyFolderOrFile(source.getUrl(),self.getUrl()).then((state)=>{
                if(source instanceof FileNode && state === false){
                    let dest: string = self.getUrl()+"\\"+source.name + "copy"
                    console.log("file exist or error")
                    globalThis.electron.copyFolderOrFile(source.getUrl(),dest).then(()=>{
                        self.oberverUpdate();
                        source.oberverUpdate();
                    })               
                }
                else{
                    self.oberverUpdate()
                    self.rootStorageNode.oberverUpdate();
                }
            })
        }

        getUrl(): any {
            return this.rootStorageNode.getUrl()+"\\"+this.name
        }
    
        abstract createNewFolder(rootDirectory : StorageNode2)

        protected createFolder(url : string) :Promise<boolean | unknown>{
            let ret = new Promise((resolve, reject) => {
                globalThis.electron.getFilesInFolder(url).then((files) =>{
                    let newRootFileName = "TEST2"
                    let newFileName = newRootFileName
                    for(let i = 0;i<10;i++){
                        if(!checkContains(files,(newFileName + ""))){
                            globalThis.electron.createFolder(url+"\\"+ newFileName).then(
                            ()=>{
                                this.rootStorageNode.observerUpdated()
                                resolve(true)
                            })
                            break
                        }
                        newFileName = newRootFileName+String(i)
                        if(i > 9)reject(false)
                    }
                })    
            })
            return ret
        }

        abstract createNewFile(file :  StorageNode2) :Promise<boolean | unknown>

        protected createFile(url  : string) :Promise<boolean | unknown>{
            console.log("Storage Node2 createFile" + url)
            let self = this
            let ret = new Promise((resolve, reject) => {
                    globalThis.electron.getFilesInFolder(url).then((files) =>{
                        let newRootFileName = "new File"
                        let newFileName = newRootFileName
                        for(let i = 0;i<10;i++){
                            if(!checkContains(files,(newFileName + ".txt"))){
                                globalThis.electron.saveFile(url+"\\"+ newFileName+".txt","").then(
                                    ()=>{
                                        console.log("file Creates")
                                        self.rootStorageNode.observerUpdated()
                                        resolve(true)
                                    })
                                break
                            }                        
                            if(i > 9)reject(false)
                            newFileName = newRootFileName+String(i)
                        }
                    })
            })
            return ret
        }
        renameFileOrFolder(storageNode2: StorageNode2,newName : String):Promise<boolean | unknown>{
            let ret = new Promise((resolve, reject) => {
            globalThis.electron.renameFileOrFolder(storageNode2.getUrl(),storageNode2.rootStorageNode.getUrl()+"\\"+newName).then(
                function(filePath){
                    let filename = filePath.split("\\").at(-1)
                    if(filePath.indexOf("\\") > 0){
                        filePath = filePath.substring(0,filePath.lastIndexOf("\\"))
                    }
                    storageNode2.setName(filename)
                    storageNode2.observerUpdated()
                    resolve(true)
                }).catch(()=> {
                    storageNode2.observerUpdated()
                    resolve(true)                    
                })
            })
            return ret
        }
    
    }

    function checkContains(files: any, arg1: string) {
        for (var i = 0; i < files.length; i++) {
            if (files[i].name === arg1) {
                return true;
            }
        }
        return false;
    }
    