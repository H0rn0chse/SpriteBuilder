import { initGrid } from "./grid.js";
import { initUi } from "./ui.js";
import { initZoom } from "./zoom.js";

export function init() {
    initZoom(document.querySelector('#scene'))

    initGrid(document.querySelector('#grid'))

    initUi()
}