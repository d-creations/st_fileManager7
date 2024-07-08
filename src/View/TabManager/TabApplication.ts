import { ApplicationCreator_I } from "../../Applications/Application_I.js"


export class ApplciationIndex{
    url : string
    constructor(url : string){
        this.url = url
    }
}


export interface TABApplication{
    
    setText(arg0: string): void
    saveText():void
    closeApplication():void
}

export class FrameAppCreator implements ApplicationCreator_I{

    createApplication(div : HTMLDivElement,text : string, app : ApplciationIndex,storeMessage : Function): TABApplication {
        return new TABApplicationFrame(div ,text ,app.url, storeMessage)
    }
    
}

export class ApplicationMessage{

    command : string
    textValue : string

    constructor(command : string , textValue : string){
        this.command = command
        this.textValue = textValue
    }
}

export class TABApplicationFrame implements TABApplication{

    private frame : HTMLIFrameElement
    private messageCanal : MessageChannel

    constructor(div : HTMLDivElement,text : string, url , storeMessage : Function){
        this.messageCanal = new MessageChannel()
        this.messageCanal.port1.onmessage = (message)=>{
            storeMessage(message.data)
            return
        }
//"../../src/Applications/TestPage/index.html"
        this.frame= document.createElement("iframe");
        this.frame.setAttribute("src", url);
        this.frame.style.width = "100%";
        this.frame.style.height = "100%";
        this.frame.addEventListener("load", () => {
            console.log("load message Canal")
            let data = new ApplicationMessage("init","")
            this.frame.contentWindow.postMessage(data, '*', [this.messageCanal.port2])
          });
        
        div.appendChild(this.frame)
    }


    setText(arg0: string): void{
        try {
            let data = new ApplicationMessage("setText",arg0)
            this.frame.contentWindow.postMessage(data, '*', [this.messageCanal.port2])
        } catch (error) {
            
        }
        
    }

    saveText(): void{ 
        try {
            let data = new ApplicationMessage("saveText","")
            this.frame.contentWindow.postMessage(data, '*', [this.messageCanal.port2])
        } catch (error) {
            
        }
 
    }

    closeApplication():void{
        try {
            let data = new ApplicationMessage("saveText","")
            this.frame.contentWindow.postMessage(data, '*', [this.messageCanal.port2])
        } catch (error) {
            
        }finally{
            this.messageCanal.port1.close()
            this.messageCanal.port2.close()

        }
        
    }

    


}