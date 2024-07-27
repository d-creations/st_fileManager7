import { FileDiv_I } from "../View/FileDiv.js";
import { ApplciationIndex, TABApplication } from "../View/TabManager/TabApplication.js";
import { TabCreator } from "../View/TabManager/TabCreator.js";
import { Observer } from "../tecnicalServices/oberserver.js";






export class InfoFileDiv implements FileDiv_I{

    private tabCreator : TabCreator
    private fileTabOpenState : boolean
    
    constructor(tabCreator: TabCreator){
        this.tabCreator = tabCreator
        this.fileTabOpenState = false
    }
    openTabFileState(): void {
        this.fileTabOpenState = true
    }
    closeTabFileState(): void {
        this.fileTabOpenState = true
    }
    getUrl() {
        return "infoText"
    }
    saveText(text: string) {
        return
    }

    public openFile(createApplication : ApplciationIndex) {
        this.tabCreator.createTab(this , createApplication)
    }
    setEditable(state: string) {
        return
    }
    oberverUpdate(): void {
        return
    }
    getFileText(): Promise<String | unknown> {
        return new Promise((resolve)=>{
//            let fetchPromise = fetch("../../res/info.txt");
//            fetchPromise.then(response => {
//                let text = response.text()
//              resolve(text)
//              })
            resolve("")
            })
    }
    getName(): string {
        return "info"
    }
    getFileIsDeleted(): boolean {
        return false
    }
    addObserver(observer: Observer) {
        return
    }
}
