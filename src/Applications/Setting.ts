
import { FileDiv } from "../View/FileDiv.js"
import { TABApplication } from "../View/TabManager/TabApplication"
import { ApplicationCreator_I } from "./Application_I"


export class SettingCreator implements ApplicationCreator_I{
    createApplication(div: HTMLDivElement): TABApplication {
        return new Setting(div)
    }
    
}

export class SettingFileNode extends FileDiv{


    constructor(){
        super(null,null,null)
    }
    public getUrl() {
        return "setting"
    }

}




export class Setting implements TABApplication{

    constructor( parentDiv : HTMLDivElement ) {
        parentDiv.innerText = "SETTING TEXT"

    }
    setText(arg0: string): void {
        throw new Error("Method not implemented.")
    }
    getText(): string {
        throw new Error("Method not implemented.")
    }
}
