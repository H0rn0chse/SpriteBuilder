import { initDrag } from "./drop.js";
import { initGrid } from "./grid.js";
import { initImport } from "./importFile.js";
import { initUi } from "./ui.js";
import { initZoom } from "./zoom.js";

export function init() {
    initZoom(document.querySelector('#scene'))

    initGrid(document.querySelector('#grid'))

    initDrag(document.querySelector('#dropArea'), document.querySelector('#addImage'))

    initUi()

    initImport()
}