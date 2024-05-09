
export class FileNode{
    print(space?: string) {
        if( space === null) space = ""
        console.log(space+this.name)
    }

    name : string
    path : string

    constructor(path : string){
        this.path = path
        this.name = path
    }
}