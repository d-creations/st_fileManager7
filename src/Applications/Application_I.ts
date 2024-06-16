import { TABApplication } from "../View/TabManager/TabApplication";



export interface ApplicationCreator_I{
    createApplication(div: HTMLDivElement): TABApplication;
}