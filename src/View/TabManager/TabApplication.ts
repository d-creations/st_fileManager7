import { ApplicationCreator_I } from "../../Applications/Application_I.js"



export interface TABApplication{
    setText(arg0: string|HTMLDivElement): void
    getText(): string
}

export class FrameAppCreator implements ApplicationCreator_I{
    createApplication(div: HTMLDivElement): TABApplication {
        return new TABApplicationFrame(div)
    }
    
}


export class TABApplicationFrame implements TABApplication{

    private frame : HTMLIFrameElement
    private messageCanal : MessageChannel
    constructor(div : HTMLDivElement){
        const messageCanal = new MessageChannel()
        messageCanal.port1.onmessage = (message)=>{
            console.log("reseve message from iframe = " + message)
            return
        }

        this.frame= document.createElement("iframe");
        this.frame.setAttribute("src", "https://star-ncplot.com/");
        this.frame.style.width = "100%";
        this.frame.style.height = "100%";
        this.frame.addEventListener("load", () => {
            this.frame.contentWindow.addEventListener("message",(event)=>{
                event.ports[0].postMessage("test")
            })
          });
        
        div.appendChild(this.frame)
    }
    getText(): string {
        return "TEST"
    }

    setText(arg0: string|HTMLDivElement): void{
        //this.frame.contentWindow.postMessage('setText', '*');
    }

    saveText(arg0: string|HTMLDivElement): void{ 
        this.frame.contentWindow.postMessage("saveFile", 'any', [this.messageCanal.port2])
 
    }

    


}