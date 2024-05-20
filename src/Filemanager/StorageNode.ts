import { TabManager_I } from "../TabManager/TabManager"
import { Observable } from "../tecnicalServices/oberserver.js"


export abstract class StorageNode extends Observable{
    updated() {
        this.name = this.headDiv.innerText
        this.observerUpdated()
    }
    rename() {
        let oldurl = this.getUrl()
        let oldname = this.headDiv.innerText

        let storageNode = this
        this.headDiv.contentEditable = "true"   
        this.headDiv.focus()
        this.waitingKeypress().then(
            (emptyString) => {
                console.log(storageNode.getUrl())
                
                globalThis.electron.getFilesInFolder(storageNode.path).then((files) =>{
                    if(files.contains(storageNode.getUrl())){
                        storageNode.headDiv.innerText = oldname
                    }
                
                    globalThis.electron.renameFileOrFolder(oldurl,storageNode.getUrl()).catch(
                    ()=>{
                        storageNode.headDiv.innerText = oldname
                    }
                )
            })
            }).finally(
            () =>{                    
                storageNode.headDiv.contentEditable = "false"
                storageNode.name = storageNode.headDiv.innerText
        } )
    }
    getUrl(): any {
        return this.path+"\\"+this.headDiv.innerText
    }
    name : string
    path : string
    headDiv : HTMLDivElement
    bodyDiv : HTMLDivElement
    spaceLeft : number

    constructor(path : string, name : string){
        super()
        this.path = path
        this.name = name
    }

    abstract print(string)
    abstract createDivs(parentDiv : HTMLDivElement,spaceLeft  : number) 
    abstract update()


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