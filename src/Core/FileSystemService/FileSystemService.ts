import { DirectoryNode } from "./DirectoryNode.js";
import { StorageNode2 } from "./StorageNode2.js";
import { FileNode } from "./FileNode.js";
import { RootStorageNode } from "./RootStorageNode.js";
import { IAppForFileService } from "./IAppForFileService.js";
import { IuiEventService, APPUIEvent } from "../../UI/UIEventService/IuieventService.js";
import { IStorageService } from "../SystemStorageService/IStroageService.js";
import { cpObject, cutObject, objectManipulation } from "../Clipboard/CopyCut.js";
import { DirectoryNode_EXC_I, EditorControlerAdapter_EXC_ERROR, EditorControlerAdapter_EXC_TYPE_ERROR, FileNode_EXC_I, IFileSystemService, StorageNode2_EXC_I } from "../../Contracts/Interfaces.js";


export class FileSystemService implements IFileSystemService {
    clipboardStorage: objectManipulation;
    fileSystemService: IStorageService; // Declare the fileSystemService property    
    appForOpenService: IAppForFileService; // Declare the appForOpenService property
    uiEventService: IuiEventService; // Declare the uiEventService property
    // Inject the FileSystemService - Commented out @inject
    constructor( 
        @IStorageService fileSystemService: IStorageService,
        @IuiEventService uiEventService: IuiEventService
    ) {
        this.fileSystemService = fileSystemService;
        this.uiEventService = uiEventService;
        uiEventService.on(APPUIEvent.CloseApplication, () => this.closeApplication());
        uiEventService.on(APPUIEvent.openSetting, () => this.openFileWithAppInEditor(this.getSettingFileNode(),"../../src/Applications/SettingPage/index.html"));
        
    }

    undoFileOperation(): Promise<String | unknown> {
        return this.fileSystemService.undoFileOperation();
    }

    redoFileOperation(): Promise<String | unknown> {
        return this.fileSystemService.redoFileOperation();
    }

    getNCToolPath(NCcode: string): Promise<String | unknown> {
        return this.fileSystemService.getNCToolPath(NCcode);
    }

    async moveFileOrFolder(source: StorageNode2_EXC_I, rootDestination: StorageNode2_EXC_I): Promise<void> {
        if (source instanceof StorageNode2 && rootDestination instanceof StorageNode2) {
            const sourcePath = source.getUrl();
            const destinationPath = rootDestination.getUrl();
            await this.fileSystemService.moveFileOrFolder(sourcePath, destinationPath);
        } else {
            throw new EditorControlerAdapter_EXC_TYPE_ERROR("Move requires StorageNode2 instances");
        }
    }

    getSettingFileNode(): FileNode_EXC_I {
        // Pass the service to RootStorageNode constructor
        return new FileNode(new RootStorageNode("resources", this.fileSystemService), "setting.json", this.fileSystemService);
    }

    copyStorage(node: StorageNode2_EXC_I): Promise<void> {
        if (node instanceof StorageNode2) {
            this.clipboardStorage = new cpObject(node);
            return Promise.resolve();
        } else {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("Copy requires a StorageNode2 instance"));
        }
    }

    cutStorage(node: StorageNode2_EXC_I): void {
        if (node instanceof StorageNode2) {
            this.clipboardStorage = new cutObject(node);
        } else {
            throw new EditorControlerAdapter_EXC_TYPE_ERROR("Cut requires a StorageNode2 instance");
        }
    }

    insertStorage(rootDestination: StorageNode2_EXC_I): Promise<void> {
        if (!(rootDestination instanceof StorageNode2)) {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("Insert destination must be a StorageNode2"));
        }
        if (!this.clipboardStorage || !this.clipboardStorage.containsNode()) {
            return Promise.reject(new Error("Clipboard is empty or invalid"));
        }
        return this.clipboardStorage.insertStorage(rootDestination, this.fileSystemService);
    }

    saveFile(fileNode: FileNode_EXC_I, text: string): Promise<void> {
        if (fileNode instanceof FileNode) {
            return fileNode.saveFile(text);
        } else {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("saveFile requires a FileNode instance"));
        }
    }

    getStorageUrl(node: StorageNode2_EXC_I): string {
        if (node instanceof StorageNode2) return node.getUrl();
        else throw new EditorControlerAdapter_EXC_TYPE_ERROR("getStorageUrl requires a StorageNode2 instance");
    }

    getStorageName(node: StorageNode2_EXC_I): string {
        if (node instanceof StorageNode2) return node.getName();
        else throw new EditorControlerAdapter_EXC_TYPE_ERROR("getStorageName requires a StorageNode2 instance");
    }

    async openDirectory(): Promise<DirectoryNode_EXC_I | null | unknown> {
        try {
            const folderPath = await this.fileSystemService.openFolder();
            if (!folderPath) {
                console.log("Folder selection cancelled.");
                return null;
            }
            const folderName = folderPath.split("\\").pop() ; // Get the last part of the path
            //const parentPath = folderPath.substring(0, folderPath.lastIndexOf("/")); // Get the parent path
             const parentPath = folderPath.substring(0, folderPath.lastIndexOf("\\")); // For Windows paths   
            console.log("Parent path:", parentPath);
            console.log("Folder name:", folderName);
            // Pass the service to RootStorageNode constructor
            let rootStorageNode = new RootStorageNode(parentPath, this.fileSystemService);
            let directoryNode = new DirectoryNode(rootStorageNode, folderName, this.fileSystemService);

            await directoryNode.updateTree();
            return directoryNode;
        } catch (err) {
            console.error("Error opening directory:", err);
            throw new EditorControlerAdapter_EXC_ERROR(`Failed to open directory: ${err.message}`);
        }
    }

    openFileWithAppInEditor(fileNode: FileNode_EXC_I,urlToApp : string): void {
      //  this.appForOpenService.openFileInapp(fileNode, null); // Assuming TabCreator is a class responsible
      console.log("openFilewithApp triggered", fileNode.getUrl(), fileNode.getName());
      this.uiEventService.trigger(APPUIEvent.FileOpenWithSpezApplication,{fileNode : fileNode , urlToApp : urlToApp});

    }

    openFileInEditor(fileNode : FileNode_EXC_I):void {
        console.log("openFilewithApp triggered", fileNode.getUrl(), fileNode.getName());
        this.uiEventService.trigger(APPUIEvent.FileOpenInEditor,fileNode  );


    }


    async openFile(): Promise<FileNode_EXC_I | null | unknown> {
        console.log("openFile triggered");
        try {
            const filepath = await this.fileSystemService.openFile();
            if (!filepath) {
                console.log("File selection cancelled.");
                return null;
            }
            return await this.openFileByUrl(filepath);

        } catch (err) {
            console.error("Error opening file dialog:", err);
            throw new EditorControlerAdapter_EXC_ERROR(`Failed to open file dialog: ${err.message}`);
        }
    }

    public async openFileByUrl(url: string): Promise<FileNode_EXC_I | unknown> {
        try {
            const fileName = url.split("\\").pop() ; // Get the last part of the path
            //const parentPath = url.substring(0, url.lastIndexOf("/")); // Get the parent path
            const parentPath = url.substring(0, url.lastIndexOf("\\")); // For Windows paths
            // Pass the service to RootStorageNode constructor
            let rootStorageNode = new RootStorageNode(parentPath, this.fileSystemService);
            let fileNode = new FileNode(rootStorageNode, fileName, this.fileSystemService);
            return fileNode;
        } catch (error) {
            console.error("Error creating FileNode from URL:", error);
            throw new EditorControlerAdapter_EXC_ERROR(`Failed to process file URL: ${error.message}`);
        }
    }

    // Ensure getFileText returns Promise<string>
    getFileText(fileNode: FileNode_EXC_I): Promise<string> {
        if (fileNode instanceof FileNode) {
            // Type assertion might be needed if FileNode.getFileText returns Promise<unknown>
            return fileNode.getFileText() as Promise<string>;
        } else {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("getFileText requires a FileNode instance"));
        }
    }

    closeApplication() {
        this.fileSystemService.closeApplication();
    }

    createFolder(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown> {
        if (rootDirectory instanceof DirectoryNode) {
            return rootDirectory.createNewFolder();
        } else {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("createFolder requires a DirectoryNode instance to specify the parent location"));
        }
    }

    createFile(rootDirectory: StorageNode2_EXC_I): Promise<boolean | unknown> {
        if (rootDirectory instanceof DirectoryNode) {
            return rootDirectory.createNewFile();
        } else {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("createFile requires a DirectoryNode instance to specify the parent location"));
        }
    }

    deleteFileOrFolder(storageNode2: StorageNode2_EXC_I): Promise<void> {
        if (storageNode2 instanceof StorageNode2) {
            return storageNode2.delete();
        } else {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("deleteFileOrFolder requires a StorageNode2 instance"));
        }
    }

    renameFileOrFolder(storageNode2: StorageNode2_EXC_I, newName: string): Promise<boolean | unknown> {
        if (storageNode2 instanceof StorageNode2) {
            return storageNode2.renameFileOrFolder(newName);
        } else {
            return Promise.reject(new EditorControlerAdapter_EXC_TYPE_ERROR("renameFileOrFolder requires a StorageNode2 instance"));
        }
    }
}
