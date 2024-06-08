import { StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js"
import { Observable, Observer } from "../tecnicalServices/oberserver.js"




export abstract class StorageNode2 extends Observable implements Observer,StorageNode2_EXC_I{
    name : string
    rootStorageNode : StorageNode2 | null
    spaceLeft : number
    constructor(rootStorageNode : StorageNode2 | null, name : string){
            super()
            this.rootStorageNode = rootStorageNode
            this.name = name
            if(rootStorageNode != null)this.rootStorageNode.addObserver(this)
    }
    async oberverUpdate(): Promise<any> {
    }
    
        abstract print(string)
        abstract createDivs(parentDiv : HTMLDivElement,spaceLeft  : number) 
        abstract update()

        setRoot(rootStorageNode : StorageNode2){
            this.rootStorageNode = rootStorageNode
        }
    
        setName(name : string){
            this.name = name
            this.observerUpdated()
        }

    
        updated() {
        }

        getUrl(): any {
            return this.rootStorageNode.getUrl()+"\\"+this.name
        }
        
    }
