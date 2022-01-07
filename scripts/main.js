import CanvasManager from "./CanvasManager.js";
import { initDrag } from "./drop.js";
import GridManager from "./GridManager.js";
import { initImport } from "./importFile.js";
import { Item } from "./Item.js";
import { initUi } from "./ui.js";
import ZoomManager from "./ZoomManager.js";
import InspectorManager from "./InspectorManager.js";

initUi()
initImport()
initDrag(document.querySelector("#dropArea"), document.querySelector("#dropAddImage"))

ZoomManager.init()
GridManager.init()
CanvasManager.init()
InspectorManager.init()
feather.replace();

export async function addItem (src, name) {
    const item = new Item(src, name)

    await ItemManager.addItem(item)
    GridManager.updateContainerSize()
    GridManager.updateLayout()
}