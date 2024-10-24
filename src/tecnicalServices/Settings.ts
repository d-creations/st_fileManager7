import { EditorControlerAdapter } from "../Domain/EditorContollerAdapter"
import { EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces"



export class ApplicationSettings{
    public name : string
    public aktiv : string
    public url :  string
}

export class Settings{
    reloadSettings() {
        this.updateSettings()
    }
    name : string
    applications : ApplicationSettings[]
    editor : EditorControlerAdapter_EXC_I
    settingFileNode : FileNode_EXC_I
    settings 
    constructor(editor : EditorControlerAdapter_EXC_I ){
        this.editor = editor
        this.settingFileNode = editor.getSettingFileNode()
        this.updateSettings()

    }

    public updateSettings(){        
        this.editor.getFileText(this.settingFileNode).then((text : string)=>{
            this.settings = JSON.parse(text)
            this.applications = this.settings.applications
        })
    }

    public getApplications(){
        return  this.applications
    }

}