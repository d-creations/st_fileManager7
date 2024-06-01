export interface Observer{
    oberverUpdate() : void
}

export interface ObservableI{
    addObserver( observer : Observer)
     
    observerUpdated()
}

export class Observable implements ObservableI{
   private obervers: Array<Observer>

   constructor(){
       this.obervers = []
   }
   
   public addObserver( observer : Observer) {
   this.obervers.push(observer);
   }  

   public observerUpdated(){
       for(let observer of this.obervers){
           observer.oberverUpdate()
       }
   }

}

