import { ViewObjectCreator } from "../../tecnicalServices/ViewObjectCreator.js"
import { IBaseDivView } from "../BaseDivView/BaseDivView.js"
import { NaviMenu_I } from "./NaviMenu_I"
import { ITreeView } from "../TreeView/ITreeView.js"; // Import ITreeView

export class NaviPageContent {
    contentDiv: HTMLDivElement

    constructor(contentDiv: HTMLDivElement) {
        this.contentDiv = contentDiv
    }
}

export class NaviPage {
    naviPageContent: NaviPageContent
    headDiv: HTMLDivElement
    button: HTMLDivElement
    naviMenu: NaviMenu
    constructor(naviMenu: NaviMenu, naviPageContent: NaviPageContent) {
        this.naviPageContent = naviPageContent
        this.naviMenu = naviMenu
        let self = this
        self.naviMenu.display(naviPageContent.contentDiv)

        this.button = ViewObjectCreator.createNaviButton("Explorer", "../../image/folder.png")
        this.button.addEventListener(("click"), (e) => {
            self.naviMenu.display(naviPageContent.contentDiv)
        })
    }

    public getTab() {
        return this.naviPageContent.contentDiv

    }


}

import { createDecorator } from "../../tecnicalServices/instantiation/ServiceCollection.js";
export const  INaviMenu  = createDecorator<INaviMenu>('INaviMenu');


export interface INaviMenu {}

export class NaviMenu implements INaviMenu {

    tablist: HTMLDivElement[]
    naviTab: HTMLDivElement
    mainTab: HTMLDivElement
    baseTableManager: IBaseDivView
    treeViewElement: HTMLDivElement // Store the TreeView's DOM element

    constructor(
        naviTab: HTMLDivElement,
        mainTab: HTMLDivElement,
        treeViewElement: HTMLDivElement, // Expect the TreeView DOM element
        baseTableManager: IBaseDivView // No decorator - Inject IBaseDivView manually
    ) {
        this.tablist = []
        this.naviTab = naviTab
        this.mainTab = mainTab
        this.baseTableManager = baseTableManager // Assign manually passed instance
        this.treeViewElement = treeViewElement // Store the passed TreeView element
        let self = this

        // Use the passed treeViewElement to create the initial NaviPage
        let naviPage = new NaviPage(self, new NaviPageContent(this.treeViewElement))
        this.naviTab.appendChild(naviPage.button)
    }

    display(content: HTMLDivElement) {
        content = this.treeViewElement
        if (!this.mainTab) {
            console.error("NaviMenu: mainTab element is not valid.");
            return;
        }

        // Case 1: Content is already displayed in mainTab, so remove it (toggle off)
        if (this.mainTab.firstChild === content) {
            this.mainTab.removeChild(content); // Remove only the specific content
            this.baseTableManager.closeFileView();
        }
        // Case 2: Display new content in mainTab
        else {
            // Prevent appending if content is an ancestor of mainTab (causes HierarchyRequestError)
            if (content.contains(this.mainTab)) {
                console.error("NaviMenu: Attempted to append an ancestor element (%o) to its descendant (%o). Aborting.", content, this.mainTab);
                return; // Prevent the invalid operation
            }
            // Prevent appending if content is the same as mainTab
            if (content === this.mainTab) {
                console.error("NaviMenu: Attempted to append mainTab (%o) to itself. Aborting.", this.mainTab);
                return; // Prevent the invalid operation
            }

            // Clear existing content from mainTab
            while (this.mainTab.firstChild) {
                this.mainTab.removeChild(this.mainTab.firstChild);
            }

            // Append the new content
            try {
                this.mainTab.appendChild(content);
                this.baseTableManager.openFileView();
            } catch (error) {
                console.error("NaviMenu: Error appending content (%o) to mainTab (%o):", content, this.mainTab, error);
                // Optional: Add more specific error handling or recovery logic here
            }
        }
    }

}