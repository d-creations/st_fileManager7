import { EditorControlerAdapter_EXC_I, FileNode_EXC_I } from "../ViewDomainI/Interfaces"
import { createDecorator } from './instantiation/ServiceCollection.js';

export const  ISettings  = createDecorator<ISettings>('ISettings');


export class ApplicationSettings {
    public name: string;
    public aktiv: string;
    public url: string;
}



export interface ISettings {
    reloadSettings(): void;
    updateSettings(): void;
    getApplications(): ApplicationSettings[];
    getName(): string;
    setName(name: string): void;
}


export class Settings {
    private name: string;
    private applications: ApplicationSettings[];
    private editor: EditorControlerAdapter_EXC_I;
    private settingFileNode: FileNode_EXC_I;
    private settings: any;

    constructor(editor: EditorControlerAdapter_EXC_I) {
        this.editor = editor;
        this.settingFileNode = editor.getSettingFileNode();
        this.updateSettings();
    }

    public reloadSettings(): void {
        this.updateSettings();
    }

    public updateSettings(): void {
        this.editor.getFileText(this.settingFileNode).then((text: string) => {
            try {
                this.settings = JSON.parse(text);
                this.applications = this.settings.applications || [];
            } catch (error) {
                console.error("Failed to parse settings file:", error);
                this.applications = [];
            }
        });
    }

    public getApplications(): ApplicationSettings[] {
        return this.applications;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
}

