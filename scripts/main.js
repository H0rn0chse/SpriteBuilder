import CanvasManager from "./CanvasManager.js";
import { initDrag } from "./drop.js";
import GridManager from "./GridManager.js";
import { initImport } from "./importFile.js";
import { Item } from "./Item.js";
import { initUi } from "./ui.js";
import ZoomManager from "./ZoomManager.js";

export function init() {
    initDrag(document.querySelector("#dropArea"), document.querySelector("#addImage"))

    initUi()

    initImport()

    ZoomManager.init(document.querySelector("#scene"))
    GridManager.init(document.querySelector("#grid"))
    CanvasManager.init(document.querySelector("#canvas"))
}

export async function addItem (src) {
    const item = new Item(src)

    await ItemManager.addItem(item)
    GridManager.updateContainerSize()
    GridManager.updateLayout()
}