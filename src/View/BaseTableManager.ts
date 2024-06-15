
export interface BaseTableManager_I{
    closeFileView()
    openFileView()
}




type SuccessHandler = (event: MouseEvent) => void;
type endHandler = () => void;

export class BaseTableManager implements BaseTableManager_I{

    
    isLeftDragging = false;
    isRightDragging = false;
    baseTable : HTMLDivElement
    naviDiv : HTMLDivElement
    barDiv : HTMLDivElement
    fileDiv : HTMLDivElement
    mouseMovef :  SuccessHandler
    moseUpf : endHandler
    fileWidhTemp : number

    constructor(baseTable :HTMLDivElement,bar : HTMLDivElement,naviDiv : HTMLDivElement,fileDiv : HTMLDivElement){
        this.baseTable = baseTable
        this.barDiv = bar
        this.naviDiv = naviDiv
        this.fileDiv = fileDiv
        let self = this
        this.fileWidhTemp = fileDiv.clientWidth
          bar.addEventListener("mousedown",()=>{
            self.StartLeftDrag()
          })
          this.mouseMovef = function(event){
            self.OnDrag(event)
          }
          this.moseUpf= function(){
            self.EndDrag()
          }
        
    }
    closeFileView() {

        this.fileWidhTemp = this.fileDiv.clientWidth
        this.moveBar(0)
    }
    openFileView() {
        this.moveBar(this.fileWidhTemp)
    }





    




    public SetCursor(cursor) {
        this.baseTable.style.cursor = cursor;
    }

    public StartLeftDrag() {
        if(this.isLeftDragging == false){
            let self = this
            this.baseTable.addEventListener("mousemove",self.mouseMovef)
            this.baseTable.addEventListener("mouseup",self.moseUpf)
        }
        this.isLeftDragging = true;
        this.SetCursor("ew-resize");
    }


    public EndDrag() {
    	this.isLeftDragging = false;
	    this.isRightDragging = false;
    	this.SetCursor("auto");
        let self = this
        this.baseTable.removeEventListener("mousemove",self.mouseMovef)
          this.baseTable.removeEventListener("mouseup",self.moseUpf)
    }

        public OnDrag(event) {
            if(this.isLeftDragging ) {
                this.moveBar(event.clientX )
                event.preventDefault()
            }
        }

        public moveBar(x : number){
            let leftColWidth = x;
            let cols = [
                this.naviDiv.clientWidth,
                leftColWidth,
                this.barDiv.clientWidth,
                this.baseTable.clientWidth - this.barDiv.clientWidth - this.naviDiv.clientWidth - leftColWidth,
            ];
            
            let newColDefn = cols.map(c => c.toString() + "px").join(" ");
                
            console.log(newColDefn);
            this.baseTable.style.gridTemplateColumns = newColDefn;
            
        }

    }