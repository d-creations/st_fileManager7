import { RootStorageNode } from "./RootStorageNode";
import { StorageNode2 } from "./StorageNode2";


export class mvObject{
    source : StorageNode2
    constructor(source : StorageNode2){
        this.source = source
    }
    insertStorage(rootDestination : StorageNode2){
        rootDestination.insertStorage(this.source)
    }
}

export class cutObject extends mvObject{
    constructor(source : StorageNode2){
        super(source)
    }

    insertStorage(rootDestination : StorageNode2){
        rootDestination.insertStorage(this.source)
        rootDestination.delete()
    }
}
export class cpObject extends mvObject{

    constructor(source : StorageNode2){
        super(source)
    }

    insertStorage(rootDestination : StorageNode2){
        rootDestination.insertStorage(this.source)
    }
}


