import { EditorControlerAdapter } from "../Domain/EditorContollerAdapter.js";
import { StorageNode2 } from "../Domain/StorageNode2.js";
import { ObservableI, Observer } from "../tecnicalServices/oberserver.js";



export class StorageDiv extends HTMLDivElement implements ObservableI,Observer{




    protected obervers: Array<Observer>
    protected editor : EditorControlerAdapter
    protected storageNode : StorageNode2
    constructor(editor : EditorControlerAdapter,storageNode : StorageNode2){
        super()
        this.obervers = []
        this.innerHTML = "StorageDiv"
        this.editor = editor
        this.storageNode = storageNode
    }

    updateElement() {
        this.oberverUpdate()
    }

    public addObserver( observer : Observer) {
        this.obervers.push(observer);
        }  
     
    public observerUpdated(){
        for(let observer of this.obervers){
            observer.oberverUpdate()
        }
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
        if(confirm("delete" + this.storageNode.getUrl()))this.editor.deleteFileOrFolder(this.storageNode)

    }

    rename() {
        let oldurl = this.editor.getStorageUrl(this.storageNode)
        let oldname = this.innerText

        this.contentEditable = "true"   
        let div = this
        this.focus()
        this.waitingKeypress().then(
            (emptyString) => {
                console.log(this.storageNode.getUrl())
                this.editor.renameFileOrFolder(this.storageNode,div.innerText).catch(
                    ()=>{
                        div.innerText = oldname
                    })
               
            }).finally(
            () =>{                    
                div.contentEditable = "false"
                div.updateElement()
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