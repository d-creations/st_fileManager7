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
            // muss gelötsht werden
//            if(rootStorageNode != null)this.rootStorageNode.addObserver(this)
    }
    async oberverUpdate(): Promise<any> {
    }
    
        setRoot(rootStorageNode : StorageNode2){
            this.rootStorageNode = rootStorageNode
        }
    
        setName(name : string){
            this.name = name
            this.observerUpdated()
        }

        isDeleted(){
            return this.deleteState
            // may include fs.access() // fs.stat()
        }

        delete(){
            this.deleteState = true
            this.observerUpdated()
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
            let self = this
            let ret = new Promise((resolve, reject) => {
                    globalThis.electron.getFilesInFolder(url).then((files) =>{
                        let newRootFileName = "new File"
                        let newFileName = newRootFileName
                        for(let i = 0;i<10;i++){
                            if(!checkContains(files,(newFileName + ".txt"))){
                                globalThis.electron.saveFile(url+"\\"+ newFileName+".txt","").then(
                                    ()=>{
                                        this.rootStorageNode.observerUpdated()
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
    