import { StorageNode2 } from "./StorageNode2.js"








export class RootStorageNode extends StorageNode2{

    private path
    constructor( path: string){
        super(null,path)
        this.path = path
    }

    getUrl(): any {
        return this.path
    }

    update() {
        throw new Error("Method not implemented.");
    }
    getName(): string {
        return this.name
    }
    print(string: any) {
        throw new Error("Method not implemented.");
    }
    createDivs(parentDiv: HTMLDivElement, spaceLeft: number) {
        throw new Error("Method not implemented.");
    }
}