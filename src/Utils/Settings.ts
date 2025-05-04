import { FileNode_EXC_I, IFileSystemService } from '../Contracts/Interfaces.js';
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
    private editor: IFileSystemService;
    private settingFileNode: FileNode_EXC_I;
    private settings: any;

    constructor(
        // Dependencies injected by InstantiationService
        @IFileSystemService editor: IFileSystemService
    ) 
    {
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

