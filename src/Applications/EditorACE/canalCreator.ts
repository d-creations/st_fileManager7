import { TABApplication } from "../../View/TabManager/TabApplication";
import { ApplicationCreator_I } from "../Application_I";
import { CanalAdapter } from "./canalAdapter.js";



export class CanalCreator implements ApplicationCreator_I{
    createApplication(div: HTMLDivElement): TABApplication {
        return new CanalAdapter(1,div,false,false)
    }
    
}