import { StorageNode2 } from "./StorageNode2.js";

export interface objectManipulation{
    containsNode(): boolean;

    insertStorage(rootDestination : StorageNode2):void
}

export class mvObject implements objectManipulation{
    source : StorageNode2
    constructor(source : StorageNode2){
        this.source = source
    }
    containsNode(): boolean {
        return (this.source instanceof StorageNode2)
    }
    insertStorage(rootDestination : StorageNode2){
        return this.source.moveFileOrFolder(rootDestination )
    }
}

export class cutObject implements objectManipulation{
    source : StorageNode2

    constructor(source : StorageNode2){
        this.source = source
    }

    containsNode(): boolean {
        return (this.source instanceof StorageNode2)
    }
    insertStorage(rootDestination : StorageNode2){
        return this.source.moveFileOrFolder(rootDestination )
    }
}
export class cpObject implements objectManipulation{
    source : StorageNode2

    constructor(source : StorageNode2){
        this.source = source
    }

    insertStorage(rootDestination : StorageNode2){
        rootDestination.copyStorage(this.source)
    }
    containsNode(): boolean {
        return (this.source instanceof StorageNode2)
    }
}


