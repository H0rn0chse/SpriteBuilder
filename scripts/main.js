import { CanvasManager } from "./CanvasManager.js";
import { initDrag } from "./drop.js";
import { GridManager } from "./GridManager.js";
import { initImport } from "./importFile.js";
import { initUi } from "./ui.js";
import { initZoom } from "./zoom.js";

export function init() {
    initZoom(document.querySelector("#scene"))

    GridManager.init(document.querySelector("#grid"))

    initDrag(document.querySelector("#dropArea"), document.querySelector("#addImage"))

    CanvasManager.init(document.querySelector("#canvas"))

    initUi()

    initImport()
}