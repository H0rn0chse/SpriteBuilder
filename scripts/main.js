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

const acknowledgements = document.querySelector("#acknowledgements");
acknowledgements.innerHTML = feather.icons["award"].toSvg({ color: "#e2b007" });
acknowledgements.addEventListener("click", evt => {
    window.open("./acknowledgements/third-party-licenses.html", '_blank')
}, { passive: true });

export async function addItem (src, name) {
    const item = new Item(src, name)

    await ItemManager.addItem(item)
    GridManager.updateContainerSize()
    GridManager.updateLayout()
}