

export abstract class StorageNode{
    name : string
    path : string
    headDiv : HTMLDivElement
    bodyDiv : HTMLDivElement
    spaceLeft : number

    constructor(path : string, name : string){
        this.path = path
        this.name = name
    }

    abstract print(string)
    abstract createDivs(parentDiv : HTMLDivElement,spaceLeft  : number) 
    abstract update()

}