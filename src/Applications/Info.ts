import { FileDiv_I } from "../View/FileDiv.js";
import { TABApplication } from "../View/TabManager/TabApplication.js";
import { TabCreator } from "../View/TabManager/TabCreator.js";
import { Observer } from "../tecnicalServices/oberserver.js";
import { ApplicationCreator_I } from "./Application_I.js";
import { SpezialTab } from "./Setting.js";




export class InfoCreator implements ApplicationCreator_I{
    createApplication(div: HTMLDivElement): TABApplication {
        return new SpezialTab(div)
    }
    
}


export class InfoFileNode implements FileDiv_I{
    private obervers: Array<Observer>
    private tabCreator : TabCreator
    constructor(tabCreator: TabCreator){
        this.obervers = []
        this.tabCreator = tabCreator
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
        return "Info"
    }
    public getUrl() {
        return "Info"
    }
    getFileText() :Promise<String |unknown>{
        let self = this
        return new Promise((resolve)=>{
            let fetchPromise = fetch("../../res/info.txt");
            fetchPromise.then(response => {
                let text = response.text()
              resolve(text)
            })
        })
    }


    public saveText(text: string) {
        
    }
    public openFile(createApplication : ApplicationCreator_I) {
        this.tabCreator.createTab(this , createApplication)
    }
    setEditable(state : string){   
    }
}
