import { EditorControlerAdapter_EXC_I, StorageNode2_EXC_I } from "../ViewDomainI/Interfaces.js";
import { ObservableI, ObserverI } from "../tecnicalServices/oberserver.js";

// Potentially define an interface for StorageNode that includes EventEmitter methods if applicable
// This helps ensure the storageNode passed in can actually emit events we listen for.
interface EventEmittingStorageNode extends StorageNode2_EXC_I {
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    off(eventName: string | symbol, listener: (...args: any[]) => void): this;
    // Add emit signature if needed elsewhere, though not directly used here
    // emit(eventName: string | symbol, ...args: any[]): boolean;
}

export class StorageDiv extends HTMLDivElement {

    protected editor : EditorControlerAdapter_EXC_I
    public storageNode : StorageNode2_EXC_I // Changed to public
    protected isCut : boolean

    // Listener handlers - store references to remove them later
    protected _handleNodeRename: (details: { oldName?: string, newName: string }) => void; // Changed to protected
    protected _handleNodeDelete: () => void; // Changed to protected
    protected _handleNodeUpdate: (details?: any) => void; // Changed to protected

    constructor(editor : EditorControlerAdapter_EXC_I, storageNode : StorageNode2_EXC_I){
        super()
        this.editor = editor
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
        return this.innerText
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
        this.setName(this.editor.getStorageName(this.storageNode));
    }

    createFolder(): void {
        
        this.editor.createFolder(this.storageNode).then((bool) => {
            this.refreshStorageRekursiv()
        }
        ).catch((error) => {
            console.log("create error")
        }
        )
    }

    copyStorage():void{
        this.editor.copyStorage(this.storageNode)
    }

    cutStorage():void{
        if(this.isManipulable()){
            this.isCut = true
            this.editor.cutStorage(this.storageNode)
            this.updateThisDiv()
        }
        else alert("Please close the File")
    }
    isManipulable() : boolean{
        return true
    }

    insertStorage():void{
        this.isCut = false
        this.editor.insertStorage(this.storageNode).then(() => {
            this.refreshStorageRekursiv()
            
        }
        ).catch((error) => {
            console.log("insert error")
        })
    }

    
    createFile(): void {
        
        this.editor.createFile(this.storageNode).then((bool) => {
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
            if(confirm("delete" + this.editor.getStorageUrl(this.storageNode)))this.editor.deleteFileOrFolder(this.storageNode).
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
        this.setEditable("true")  
        this.classList.remove("selectable")
        this.classList.add("writeable")

        let self = this
        this.setFocus()
        this.waitingKeypress().then(
            () => {
                const newName = self.getName(); // Get the new name from the edited div
                self.editor.renameFileOrFolder(self.storageNode, newName).then(() => {
                    self.setEditable("false")
                    self.classList.remove("writeable")
                    self.classList.add("selectable")
                }).catch(error => {
                    console.error(`Rename failed for ${self.storageNode.getName()}:`, error);
                    self.setEditable("false")
                    self.classList.remove("writeable")
                    self.classList.add("selectable")
                })
            }
        )
    }

    private waitingKeypress() {
        return new Promise((resolve) => {
          document.addEventListener('keydown', onKeyHandler);
          function onKeyHandler(e) {
            if (e.keyCode === 13) {
              document.removeEventListener('keydown', onKeyHandler);
              console.log("Enter")
              resolve("");
            }
          }
        });
    }
}