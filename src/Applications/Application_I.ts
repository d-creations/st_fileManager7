import { ApplciationIndex, TABApplication } from "../View/TabManager/TabApplication.js";



export interface ApplicationCreator_I{
    createApplication(div : HTMLDivElement,text : string,url : ApplciationIndex, storeMessage : Function): TABApplication;
}