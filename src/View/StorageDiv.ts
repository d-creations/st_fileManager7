import { EditorControlerAdapter_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { ObservableI, Observer } from "../tecnicalServices/oberserver.js";



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

    createFile(): void {
        this.editor.createFile(this.storageNode)
    }

    deleteFileOrFolder(): void{
        if(confirm("delete" + this.editor.getStorageUrl(this.storageNode)))this.editor.deleteFileOrFolder(this.storageNode)

    }

    rename() {
        let oldname = this.getName()
        this.setEditable("true")  
        let self = this
        this.focus()
        this.waitingKeypress().then(
            (emptyString) => {
                console.log(self.getName())
                this.editor.renameFileOrFolder(this.storageNode,self.getName()).catch(
                    ()=>{this.setName(oldname)})
                }).finally(
                    () =>{this.setEditable("false")  
                self.oberverUpdate()
               
        } )
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