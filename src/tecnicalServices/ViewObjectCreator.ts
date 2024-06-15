

export class ViewObjectCreator{


    public static createPlayButton(parentDiv: HTMLElement): HTMLInputElement {
        let input_button = document.createElement('input');
        input_button.type = "image"
        input_button.src = "./image/play.png"
        input_button.alt = "1";
        input_button.classList.add("PlayButton");
       parentDiv.appendChild(input_button);
       return input_button;
    }
    public static createButton(text : string) : HTMLButtonElement{
        let button = document.createElement('button');
        button.name = text;
        button.innerText = text;
        return button;
    }

    public static createTabButton(name: string): HTMLDivElement {
        let button = document.createElement('div');
        button.innerText = name;
        button.classList.add("tabButton")
        return button;
    }

    public static createMenuBarButton(name: string,url : string): HTMLDivElement {
        let input_button = document.createElement('input');
        input_button.type = "image"
        input_button.src = url
        input_button.alt = name;
        input_button.classList.add("MenuBarButton");
        return input_button;
    }

    public static createTabBarButton(name: string,url : string): HTMLDivElement {
        let input_button = document.createElement('input');
        input_button.type = "image"
        input_button.src = url
        input_button.alt = name;
        input_button.classList.add("MenuBarButton");
        return input_button;
    }


    public static createNaviButton(name: string,url : string): HTMLDivElement {
        let input_button = document.createElement('input');
        input_button.type = "image"
        input_button.src = url
        input_button.alt = name;
        input_button.classList.add("NaviButton");
        return input_button;
    }


    public static openFileButton(): HTMLInputElement {
        let input_button = document.createElement('input');
        input_button.type = "file"
        input_button.accept = '*,*'
        input_button.alt = "1";
        input_button.textContent = "OPEN A FILE";
       return input_button;
    }

}