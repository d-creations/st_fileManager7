import { Observable, Observer } from "../tecnicalServices/oberserver.js"




export abstract class StorageNode2 extends Observable implements Observer{
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
    oberverUpdate(): void {
        this.updated()
    }
    
        abstract print(string)
        abstract createDivs(parentDiv : HTMLDivElement,spaceLeft  : number) 
        abstract update()
    
    

    
        updated() {
            this.name = this.headDiv.innerText
            this.observerUpdated()
        }

        getUrl(): any {
            return this.path+"\\"+this.name
        }
        
    }
