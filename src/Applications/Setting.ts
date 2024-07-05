
import { FileDiv, FileDiv_I } from "../View/FileDiv.js"
import { TABApplication } from "../View/TabManager/TabApplication"
import { TabCreator } from "../View/TabManager/TabCreator.js"
import { FileNode_EXC_I } from "../ViewDomainI/Interfaces.js"
import { Observer } from "../tecnicalServices/oberserver.js"
import { ApplicationCreator_I } from "./Application_I"


export class SettingCreator implements ApplicationCreator_I{
    createApplication(div: HTMLDivElement): TABApplication {
        return new SpezialTab(div)
    }
    
}



export class SettingFileNode implements FileDiv_I{
    private obervers: Array<Observer>
    private tabCreator
    constructor(tabCreator : TabCreator){
        this.tabCreator = tabCreator
        this.obervers = []
    }
    getFileIsDeleted(): boolean {
        return false
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
        return
    }
    getName(): string {
        return "Setting"
    }
    public getUrl() {
        return "Setting"
    }
    getFileText() :Promise<String |unknown>{
        let self = this
        return new Promise((resolve)=>{
            let fetchPromise = fetch("../../res/setting.json");
            fetchPromise.then(response => {
              return response.json();
            }).then(obj => {
                resolve(self.parseJSON(obj))
            })
        })
    }

    parseJSON(text : SettingObj): string{
        return text.number
    }


    public saveText(text: string) {
        
    }
    public openFile(createApplication : ApplicationCreator_I) {
       this.tabCreator.createTab(this , createApplication)
    }
    setEditable(state : string){   
    }
}


type SettingObj = {
    number: string;
    knownFor: string[];
  };
  




export class SpezialTab implements TABApplication{

    
    private div
    constructor( parentDiv : HTMLDivElement ) {
        
        this.div = document.createElement('div') as HTMLDivElement
        parentDiv.appendChild(this.div)
        this.div.classList.add("specialTabDiv")    
    }
    setText(arg0: string): void {
        this.div.innerHTML = arg0
    }
    getText(): string {
        return 
    }




}
