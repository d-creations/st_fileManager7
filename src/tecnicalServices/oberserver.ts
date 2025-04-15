export interface ObserverI{
    oberverUpdate() : void
}

export type observerFunc = () => void;

export class ObserverFunction implements ObserverI{

    oberverUpdate : observerFunc
    constructor(func : observerFunc){
        this.oberverUpdate = func
    }
}


export interface ObservableI{
    addObserver( observer : ObserverI)
     
    observerUpdated() 
}


export class Observable implements ObservableI{
   private obervers: Array<ObserverI>

   constructor(){
       this.obervers = []
   }
   
   public addObserver( observer : ObserverI) {
   this.obervers.push(observer);
   }  

   public observerUpdated(){
       for(let observer of this.obervers){
           observer.oberverUpdate()
       }
   }

}

