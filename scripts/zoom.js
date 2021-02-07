import { Grid } from "./Grid2.js";

export function initZoom (element) {
    const pan = globalThis.panzoom(element, {
        zoomDoubleClickSpeed: 1, //disable double click zoom
        beforeMouseDown: evt => {
            return !evt.ctrlKey
        },
        beforeWheel: evt => { //zoom does not work in combination with muuri
            return true
        },
        filterKey: (e, dx, dy, dz) => {
            return true
        }
    })

    pan.moveTo(64, 32)

    addGrabbingHandler()
}

function addGrabbingHandler() {
    document.addEventListener("keydown", evt => {
        if (evt.ctrlKey && !globalThis.panning && !globalThis.dragging) {
            document.body.style.cursor = "grab"
        }
    })
    document.addEventListener("keyup", evt => {
        if (!evt.ctrlKey && !globalThis.panning) {
            document.body.style.cursor = ""
        }
    })
    document.addEventListener("mousedown", evt => {
        if (evt.ctrlKey) {
            globalThis.panning = true
            document.body.style.cursor = "panning"
            Grid.setDraggable(false)
        }
    })
    document.addEventListener("mouseup", evt => {
        if (globalThis.panning){
            globalThis.panning = false
            Grid.setDraggable(true)
        }

        if (evt.ctrlKey) {
            document.body.style.cursor = "grab"
        } else {
            document.body.style.cursor = ""
        }
    })
}