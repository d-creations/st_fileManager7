import { ApplicationCreator_I } from "../../Contracts/Application_I"


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

    constructor(div : HTMLDivElement,text : string, url : string , storeMessage : Function){
        this.messageCanal = new MessageChannel()
        console.log("create messageCanal")
        this.messageCanal.port1.onmessage = (message)=>{
            let data = message.data
            if(data.command = "storeText"){
                console.log("Main store Message")
                storeMessage(data.textValue)
            }
            return
        }
        
        this.frame= document.createElement("iframe");
        this.frame.setAttribute("src", url);
        this.frame.classList.add("iframeApp")
        let loadFunction = () => {
            console.log("load message Canal")
            let data = new ApplicationMessage("init",text)
            console.log("SET TEXT")
            this.frame.contentWindow.postMessage(data, '*', [this.messageCanal.port2])
            
            this.setText(text)    
           this.frame.contentDocument.addEventListener("keydown", (event) => {
                if (event.ctrlKey && event.key === 's') {
                    event.preventDefault();
                    this.saveText();
                }
            });        
          }
        this.frame.addEventListener("load",loadFunction );
        
        div.appendChild(this.frame)

        // Add Ctrl+S listener

        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveText();
            }
        });
    }


    setText(arg0: string): void{
        try {
            let data = new ApplicationMessage("setText",arg0)
            console.log("SET TEXT")
            this.frame.contentWindow.postMessage(data, '*', [this.messageCanal.port2])
        } catch (error) {
            
        }
        
    }

    saveText(): void{ 
        try {
            let data = new ApplicationMessage("saveText","")
            this.messageCanal.port1.postMessage(data)
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