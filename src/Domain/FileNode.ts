import { StorageNode2 } from "./StorageNode2.js";



export class FileNode extends StorageNode2{
    saveFile(text: any) {
        globalThis.electron.saveFile(this.path+"\\"+this.name,text)
    }
    print(string: any) {
        throw new Error("Method not implemented.");
    }
    createDivs(parentDiv: HTMLDivElement, spaceLeft: number) {
        throw new Error("Method not implemented.");
    }
    update() {
        throw new Error("Method not implemented.");
    }
    constructor(path : string, name : string){
        super(path,name)
    }
}