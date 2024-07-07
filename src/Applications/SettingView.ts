
import { FileDiv, FileDiv_I } from "../View/FileDiv.js"
import { TABApplication } from "../View/TabManager/TabApplication.js"
import { TabCreator } from "../View/TabManager/TabCreator.js"
import { FileNode_EXC_I } from "../ViewDomainI/Interfaces.js"
import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js"
import { Observer } from "../tecnicalServices/oberserver.js"
import { ApplicationCreator_I } from "./Application_I.js"


export class SettingCreator implements ApplicationCreator_I{
    createApplication(div: HTMLDivElement): TABApplication {
        return new SettingTab(div)
    }
    
}


export class SettingTab implements TABApplication{

    private div
    constructor( parentDiv : HTMLDivElement ) {
        
        this.div = document.createElement('div') as HTMLDivElement
        parentDiv.appendChild(this.div)
        this.div.classList.add("specialTabDiv")    
    }
    setText(arg0: HTMLDivElement): void {
        this.div.appendChild(arg0)
    }
    getText(): string {
        return 
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



    parseJSON(text : SettingObj): HTMLDivElement{
        let retHTMLString = ""
        let that = this
        let frameDiv : HTMLDivElement= document.createElement("div") 
        for(let application  of text.Applikations){
            let labelSelection : HTMLLabelElement = document.createElement("label")   
            labelSelection.innerText = application.Name          
            let settingSelection : HTMLSelectElement = document.createElement("select") 
            settingSelection.size = 1
            settingSelection.name = "set"
            for(let option of application.aktivSelection){
                let optionElement : HTMLOptionElement = document.createElement("option") 
                optionElement.value = option
                optionElement.innerText = option  
                settingSelection.appendChild(optionElement) 
            }
            labelSelection.appendChild(settingSelection)
            labelSelection.appendChild(document.createElement("br"))
            settingSelection.value = String(application.aktiv)
            frameDiv.appendChild(labelSelection)
            
        }
        
        let saveButton = ViewObjectCreator.createButton("save")
        saveButton.addEventListener("click",()=>{
            that.saveSetting(frameDiv)
        })
        frameDiv.appendChild(saveButton)
        return frameDiv
    }

    public saveSetting(text: HTMLDivElement) {
        let fetchPromise = fetch("../../res/setting.json");
        fetchPromise.then(response => {
          return response.json();
        }).then(obj => {
        for(let chlid of text.childNodes){
            for(let labelChild of chlid.childNodes){
                    console.log(labelChild.nodeValue)
                }
            }
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


type ApplicationTyp = {
    "Name": "Editor",
    "aktiv": "true",
    "aktivSelection":["true","false"]    
}

type SettingObj = {
    name: string;
    Applikations: ApplicationTyp[]
  };

  




