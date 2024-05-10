export interface Observer{
    oberverUpdate() : void
}

export class Observable{
   private obervers: Array<Observer>

   constructor(){
       this.obervers = []
   }
   
   public addObserver( observer : Observer) {
   this.obervers.push(observer);
   }  

   public updated(){
       for(let observer of this.obervers){
           observer.oberverUpdate()
       }
   }

}