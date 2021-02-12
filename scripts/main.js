import CanvasManager from "./CanvasManager.js";
import { initDrag } from "./drop.js";
import GridManager from "./GridManager.js";
import { initImport } from "./importFile.js";
import { Item } from "./Item.js";
import { initUi } from "./ui.js";
import ZoomManager from "./ZoomManager.js";

export function init() {
    initUi()

    initImport()

    initDrag(document.querySelector("#dropArea"), document.querySelector("#addImage"))

    ZoomManager.init(document.querySelector("#scene"))
    GridManager.init(document.querySelector("#grid"))
    CanvasManager.init(document.querySelector("#canvas"))
}

export async function addItem (src, name) {
    const item = new Item(src, name)

    await ItemManager.addItem(item)
    GridManager.updateContainerSize()
    GridManager.updateLayout()
}