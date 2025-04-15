import { EditorControlerAdapter_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import {ObservableI, ObserverI } from "../tecnicalServices/oberserver.js";

export class StorageDiv extends HTMLDivElement {

    protected editor : EditorControlerAdapter_EXC_I
    protected storageNode : StorageNode2_EXC_I
    protected isCut : boolean
    constructor(editor : EditorControlerAdapter_EXC_I,storageNode : StorageNode2_EXC_I){
        super()
        this.editor = editor
        this.storageNode = storageNode
        this.isCut = false


    }


    refreshStorageRekursiv() : Promise<void>{
        throw new Error("Method not implemented.");
    }

    exists() : boolean{
        return true
    }
    getName(){
        return this.innerText
    }

    setName(name : string){
        this.innerText = name
        return
    }
    setEditable(state : string){
        this.contentEditable = state
    }

    updateThisDiv(): void {
        throw new Error("Method not implemented.");
    }

    createFolder(): void {
        
        this.editor.createFolder(this.storageNode).then((bool) => {
            this.refreshStorageRekursiv()
        }
        ).catch((error) => {
            console.log("create error")
        }
        )
    }

    copyStorage():void{
        this.editor.copyStorage(this.storageNode)
    }

    cutStorage():void{
        if(this.isManipulable()){
            this.isCut = true
            this.editor.cutStorage(this.storageNode)
            this.updateThisDiv()
        }
        else alert("Please close the File")
    }
    isManipulable() : boolean{
        return true
    }

    insertStorage():void{
        this.isCut = false
        this.editor.insertStorage(this.storageNode).then(() => {
            this.refreshStorageRekursiv()
            
        }
        ).catch((error) => {
            console.log("insert error")
        })
    }

    
    createFile(): void {
        
        this.editor.createFile(this.storageNode).then((bool) => {
            this.refreshStorageRekursiv()
        }
        ).catch((error) => {
            console.log("create error")
        }
        )
    }

    isCutStorage(): boolean {
        return this.isCut   
    }

    deleteFileOrFolder(): Promise<void>{
        return new Promise((resolve) => {
            if(confirm("delete" + this.editor.getStorageUrl(this.storageNode)))this.editor.deleteFileOrFolder(this.storageNode).
            then(() => {
                resolve()
                this.refreshStorageRekursiv()
            }).
            catch((error) => {
                console.log("delete error")
                resolve()
            })
        })
    }

    setFocus(){
        this.focus()
    }

    rename() {
        this.setEditable("true")  
        this.classList.remove("selectable")
        this.classList.add("writeable")

        let self = this
        this.setFocus()
        this.waitingKeypress().then(
            () => {
                console.log(self.getName())
                self.editor.renameFileOrFolder(self.storageNode,self.getName()).then(() => {
                self.setEditable("false")  
                self.updateThisDiv() 
                self.classList.remove("writeable")
                self.classList.add("selectable")
                })
        } 
    )
    }

    private waitingKeypress() {
        return new Promise((resolve) => {
          document.addEventListener('keydown', onKeyHandler);
          function onKeyHandler(e) {
            if (e.keyCode === 13) {
              document.removeEventListener('keydown', onKeyHandler);
              console.log("Enter")
              resolve("");
            }
          }
        });
      }
}