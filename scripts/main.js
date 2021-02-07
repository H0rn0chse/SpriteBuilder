import { initDrag } from "./drop.js";
import { Grid } from "./Grid.js";
import { initImport } from "./importFile.js";
import { initUi } from "./ui.js";
import { initZoom } from "./zoom.js";

export function init() {
    initZoom(document.querySelector('#scene'))

    Grid.init(document.querySelector('#grid'))

    initDrag(document.querySelector('#dropArea'), document.querySelector('#addImage'))

    initUi()

    initImport()
}