import CanvasManager from "./CanvasManager.js";
import { initDrag } from "./drop.js";
import GridManager from "./GridManager.js";
import { initImport } from "./importFile.js";
import { Item } from "./Item.js";
import { initUi } from "./ui.js";
import { initZoom } from "./zoom.js";

export function init() {
    initZoom(document.querySelector("#scene"))

    initDrag(document.querySelector("#dropArea"), document.querySelector("#addImage"))

    initUi()

    initImport()

    GridManager.init(document.querySelector("#grid"))

    CanvasManager.init(document.querySelector("#canvas"))
}

export async function addItem (src) {
    const item = new Item(src)

    await ItemManager.addItem(item)
    GridManager.updateContainerSize()
    GridManager.updateLayout()
}