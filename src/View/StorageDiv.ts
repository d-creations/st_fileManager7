import { EditorControlerAdapter_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import {Observer } from "../tecnicalServices/oberserver.js";



export class StorageDiv extends HTMLDivElement implements Observer{


    protected obervers: Array<Observer>
    protected editor : EditorControlerAdapter_EXC_I
    protected storageNode : StorageNode2_EXC_I
    constructor(editor : EditorControlerAdapter_EXC_I,storageNode : StorageNode2_EXC_I){
        super()
        this.obervers = []
        this.innerHTML = "StorageDiv"
        this.editor = editor
        this.storageNode = storageNode
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

    oberverUpdate(): void {
        throw new Error("Method not implemented.");
    }

    createFolder(): void {
        this.editor.createFolder(this.storageNode)
    }

    copyStorage():void{
        this.editor.copyStorage(this.storageNode)
    }

    cutStorage():void{
        this.editor.cutStorage(this.storageNode)
    }

    insertStorage():void{
        this.editor.insertStorage(this.storageNode)
    }

    createFile(): void {
        this.editor.createFile(this.storageNode)
    }

    deleteFileOrFolder(): void{
        if(confirm("delete" + this.editor.getStorageUrl(this.storageNode)))this.editor.deleteFileOrFolder(this.storageNode)

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
            (emptyString) => {
                console.log(self.getName())
                self.editor.renameFileOrFolder(self.storageNode,self.getName())
                self.setEditable("false")  
                self.oberverUpdate() 
                self.classList.remove("writeable")
                self.classList.add("selectable")
              
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