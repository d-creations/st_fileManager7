



export class PdfFacade{

  toolBarContainer
  canvasContainer
  currPage
  numPage
  canvasList
  viewportS
  orientation
  
  constructor(canvasContainer,toolBarContainer){
    this.canvasContainer = canvasContainer
    this.toolBarContainer = toolBarContainer
    this.scale= 5
    this.orientation = 0
    this.canvasList = []
    this.createToolbar()
      // Loaded via <script> tag, create shortcut to access PDF.js exports.
      var { pdfjsLib } = globalThis;
      // The workerSrc property shall be specified.
      pdfjsLib.GlobalWorkerOptions.workerSrc = './build/pdf.worker.mjs';

      
  }

  createToolbar(){
    let pageNrElement = document.createElement( "input" ); 
    let zoomInButton = document.createElement( "button" ); 
    let zoomOutButton = document.createElement( "button" ); 
    let rotateCW = document.createElement( "button" ); 

    this.toolBarContainer.appendChild(pageNrElement)
    this.toolBarContainer.appendChild(zoomInButton)
    this.toolBarContainer.appendChild(zoomOutButton)
    this.toolBarContainer.appendChild(rotateCW)

    pageNrElement.value = "1"
    zoomInButton.innerText = "+"
    zoomOutButton.innerText = "-"
    rotateCW.innerText = "cw"
    zoomOutButton.addEventListener("click",()=> this.zoomOut())
    zoomInButton.addEventListener("click",()=> this.zoomIn())
    rotateCW.addEventListener("click",()=> this.rotateClockwise())

  }

  rotateClockwise(){
    this.orientation += 90
    for(let canva of this.canvasList){
      canva.style.transform= "rotate(" + this.orientation  + "deg)";
    }
  }

  zoomIn(){
    this.scale += 0.25
    console.log("zoom in")
    let that = this
    for(let canva of this.canvasList){
      
      let  outputScale = window.devicePixelRatio || 1;
      this.scaleCanva(canva, 1.1)
    }
  }

  zoomOut(){
    this.scale -= 0.25
    let that = this
    that.currPage = 1
    for(let canva of this.canvasList){
      
      let  outputScale = window.devicePixelRatio || 1;
      this.scaleCanva(canva, 0.9)
    }
  }
  setUp(){

  }

  setPDF(pdf){
    this.pdf = pdf
  }

loadPDF(binaryFile){
  let that = this
  var loadingTask = pdfjsLib.getDocument({data : binaryFile});
  loadingTask.promise.then(function(pdf) {
        that.setPDF(pdf)

        console.log('PDF loaded');
    
        // Fetch the first page
        that.currPage = 1;
        that.numPage = pdf.numPages;
        pdf.getPage(that.currPage).then((page) => {that.handlePage(page,that)}, function (reason) {
        // PDF loading error
        console.error(reason);
      });
    })

    }
  
    handlePage(page,that) {
      console.log('Page loaded');

      // Prepare canvas using PDF page dimensions
      
      var canvas = document.createElement( "canvas" );
      canvas.style.display = "block";
      var context = canvas.getContext('2d');
      that.canvasContainer.appendChild( canvas );
      that.canvasList.push(canvas)
      canvas.classList.add("PDFcanvas")
      let scale = that.scale;
      var viewport = page.getViewport({ scale: that.scale, });
      that.viewportS = viewport
// Support HiDPI-screens.
      let outputScale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * outputScale)
      canvas.height = Math.floor(viewport.height * outputScale)

    canvas.style.width = Math.floor(viewport.width / scale) + "px"
      canvas.style.height = Math.floor(viewport.height / scale) + "px"
      
var transform = outputScale !== 1
  ? [outputScale, 0, 0, outputScale, 0, 0]
  : null;

var renderContext = {
  canvasContext: context,
  transform: transform,
  viewport: viewport
};
      var renderTask = page.render(renderContext);
      renderTask.promise.then(function () {
        console.log('Page rendered');
      });

      
    //Move to next page
    that.currPage++;
    if ( that.pdf !== null && that.currPage <= that.numPage )
    {
        that.pdf.getPage( that.currPage ).then( (page) => that.handlePage(page,that) );
    }
  }

  scaleCanva(canvas,scale) {
    canvas.style.width = Math.floor(canvas.clientWidth * scale) + "px"
    canvas.style.height = Math.floor(canvas.clientHeight * scale)+ "px"
  }
}
