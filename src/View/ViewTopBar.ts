import { ViewObjectCreator } from "../tecnicalServices/ViewObjectCreator.js";

export class ViewTopBar{

    private parentDiv : HTMLDivElement
    private fileManager : FileManager_I
    constructor(parentDiv : HTMLDivElement,fileManager : FileManager_I){
        this.parentDiv  = parentDiv
        let openFileButton = ViewObjectCreator.createMenuBarButton("FILE",".\\..\\..\\image\\opendocument.png")
        parentDiv.appendChild(openFileButton);
        this.fileManager = fileManager
        openFileButton.addEventListener('click', function(e) {
            fileManager.openFile()
        })

        let openDirButton = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\openfolder.png")
        parentDiv.appendChild(openDirButton);
        openDirButton.addEventListener('click', function(e) {
            fileManager.openFolder()
        })

        let saveFile = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\save.png")
        parentDiv.appendChild(saveFile);
        saveFile.addEventListener('click', function(e) {
            fileManager.saveCurrentFile()
        })
        let saveAllFile = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\saveAll.png")
        parentDiv.appendChild(saveAllFile);
        saveAllFile.addEventListener('click', function(e) {
            fileManager.saveAllFile()
        })

        let closeApplication = ViewObjectCreator.createMenuBarButton("FOLDER",".\\..\\..\\image\\close.png")
        parentDiv.appendChild(closeApplication);
        closeApplication.style.right ="0pt"
        closeApplication.style.position ="absolute"
        closeApplication.addEventListener('click', function(e) {
            fileManager.closeApplication()
        })
    }
}