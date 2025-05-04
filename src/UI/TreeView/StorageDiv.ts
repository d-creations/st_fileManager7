
// Potentially define an interface for StorageNode that includes EventEmitter methods if applicable

import { IFileSystemService, StorageNode2_EXC_I } from "../../Contracts/Interfaces";

// This helps ensure the storageNode passed in can actually emit events we listen for.
interface EventEmittingStorageNode extends StorageNode2_EXC_I {
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    off(eventName: string | symbol, listener: (...args: any[]) => void): this;
    // Add emit signature if needed elsewhere, though not directly used here
    // emit(eventName: string | symbol, ...args: any[]): boolean;
}

export class StorageDiv extends HTMLDivElement {

    protected fileSystemService : IFileSystemService
    public storageNode : StorageNode2_EXC_I // Changed to public
    protected isCut : boolean

    // Listener handlers - store references to remove them later
    protected _handleNodeRename: (details: { oldName?: string, newName: string }) => void; // Changed to protected
    protected _handleNodeDelete: () => void; // Changed to protected
    protected _handleNodeUpdate: (details?: any) => void; // Changed to protected

    constructor(fileSystemService : IFileSystemService, storageNode : StorageNode2_EXC_I){
        super()
        this.fileSystemService = fileSystemService
        this.storageNode = storageNode
        this.isCut = false
        this.attachNodeListeners(); // Attach listeners in constructor
    }

    // Centralized listener attachment
    protected attachNodeListeners(): void { // Changed to protected
        // Type guard to check if storageNode is an EventEmitter
        const eventNode = this.storageNode as EventEmittingStorageNode;
        if (!(typeof eventNode.on === 'function' && typeof eventNode.off === 'function')) {
            // console.warn(`StorageNode (${this.getName()}) provided to StorageDiv does not appear to be an EventEmitter. Cannot listen for node events.`);
            return;
        }

        this._handleNodeRename = ({ newName }) => {
            const oldName = this.getName(); // Get old name before updating
            console.log(`StorageDiv (${oldName}): Node renamed to ${newName}`);
            this.setName(newName); // Update the div's display name
        };

        this._handleNodeDelete = () => {
            console.log(`StorageDiv (${this.getName()}): Node deleted`);
            this.cleanupNodeListeners(); // Clean up listeners for this node
            this.remove(); // Remove the div itself
        };

        this._handleNodeUpdate = (details) => {
            console.log(`StorageDiv (${this.getName()}): Node updated`, details);
            // Optionally trigger a visual refresh if needed, e.g., this.updateThisDiv()
        };

        eventNode.on('renamed', this._handleNodeRename);
        eventNode.on('deleted', this._handleNodeDelete);
        eventNode.on('updated', this._handleNodeUpdate); // Listen for generic updates
    }

    // Centralized listener cleanup
    protected cleanupNodeListeners(): void { // Changed to protected
        const eventNode = this.storageNode as EventEmittingStorageNode;
        if (typeof eventNode.off === 'function') {
            if (this._handleNodeRename) eventNode.off('renamed', this._handleNodeRename);
            if (this._handleNodeDelete) eventNode.off('deleted', this._handleNodeDelete);
            if (this._handleNodeUpdate) eventNode.off('updated', this._handleNodeUpdate);
        }
    }

    // Override remove to ensure listeners are cleaned up
    remove(): void {
        this.cleanupNodeListeners();
        super.remove();
    }

    refreshStorageRekursiv() : Promise<void>{
        throw new Error("Method not implemented.");
    }

    exists() : boolean{
        return true
    }
    getName(){
        // Trim potential leading/trailing whitespace and newlines
        return this.innerText.trim();
    }

    setName(name : string){
        this.innerText = name
        return
    }
    setEditable(state : string){
        this.contentEditable = state
    }

    updateThisDiv(): void {
        console.log(`updateThisDiv called for ${this.getName()}`);
        this.setName(this.fileSystemService.getStorageName(this.storageNode));
    }

    createFolder(): void {
        
        this.fileSystemService.createFolder(this.storageNode).then((bool) => {
            this.refreshStorageRekursiv()
        }
        ).catch((error) => {
            console.log("create error")
        }
        )
    }

    copyStorage():void{
        this.fileSystemService.copyStorage(this.storageNode)
    }

    cutStorage():void{
        if(this.isManipulable()){
            this.isCut = true
            this.fileSystemService.cutStorage(this.storageNode)
            this.updateThisDiv()
        }
        else alert("Please close the File")
    }
    isManipulable() : boolean{
        return true
    }

    insertStorage():void{
        this.isCut = false
        this.fileSystemService.insertStorage(this.storageNode).then(() => {
            this.refreshStorageRekursiv()
            
        }
        ).catch((error) => {
            console.log("insert error")
        })
    }

    
    createFile(): void {
        
        this.fileSystemService.createFile(this.storageNode).then((bool) => {
            this.refreshStorageRekursiv()
        }
        ).catch((error) => {
            console.log("create error")
        }
        )
    }

    isCutStorage(): boolean {
        return this.isCut   
    }

    deleteFileOrFolder(): Promise<void>{
        return new Promise((resolve) => {
            if(confirm("delete" + this.fileSystemService.getStorageUrl(this.storageNode)))this.fileSystemService.deleteFileOrFolder(this.storageNode).
            then(() => {
                resolve()
                this.refreshStorageRekursiv()
            }).catch((error) => {
                console.log("delete error")
                resolve()
            })
        })
    }

    setFocus(){
        this.focus()
    }

    rename() {
        const originalName = this.getName(); // Store original name
        this.setEditable("true");
        this.classList.remove("selectable");
        this.classList.add("writeable");

        // Select the text within the element for easier editing
        const range = document.createRange();
        range.selectNodeContents(this);
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }

        this.setFocus(); // Focus the element

        this.waitingKeypressOrBlur().then(
            (status) => {
                const newName = this.getName(); // Get the potentially edited name

                // Always revert visual state
                this.setEditable("false");
                this.classList.remove("writeable");
                this.classList.add("selectable");

                if (status === "escape" || newName === originalName || !newName) {
                    // If Escape was pressed, name is unchanged, or name is empty, revert to original name visually
                    this.setName(originalName);
                    console.log("Rename cancelled or name unchanged/invalid.");
                    return; // Don't proceed with the rename operation
                }

                // If Enter was pressed or focus was lost (blur), and name is valid and changed
                if ((status === "enter" || status === "blur") && newName && newName !== originalName) {
                    this.fileSystemService.renameFileOrFolder(this.storageNode, newName).then(() => {
                        console.log(`Renamed to ${newName}`);
                        // The name is already visually updated by the edit
                    }).catch(error => {
                        console.error(`Rename failed for ${originalName}:`, error);
                        this.setName(originalName); // Revert visual name on failure
                        alert(`Failed to rename: ${error.message || error}`); // Inform user
                    });
                }
            }
        ).catch(error => {
             // Handle potential promise rejection (though not currently implemented in waitingKeypressOrBlur)
             console.error("Error during rename input handling:", error);
             this.setName(originalName); // Revert on error
             this.setEditable("false");
             this.classList.remove("writeable");
             this.classList.add("selectable");
        });
    }

    // Waits for Enter, Escape, or Blur on the element itself
    private waitingKeypressOrBlur(): Promise<'enter' | 'escape' | 'blur'> {
        return new Promise((resolve) => {
            const onKeyHandler = (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent newline on Enter
                    cleanupListeners();
                    resolve("enter");
                } else if (e.key === 'Escape') {
                    cleanupListeners();
                    resolve("escape");
                }
            };

            const onBlurHandler = () => {
                cleanupListeners();
                resolve("blur"); // Resolve when focus is lost
            };

            // Attach listeners directly to this element
            this.addEventListener('keydown', onKeyHandler);
            this.addEventListener('blur', onBlurHandler);

            // Helper to remove listeners
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const element = this;
            function cleanupListeners() {
                element.removeEventListener('keydown', onKeyHandler);
                element.removeEventListener('blur', onBlurHandler);
            }
        });
    }
}