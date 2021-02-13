import GridManager from "./GridManager.js";

class _ZoomManager {
    constructor () {
        this.pan = null
    }

    init (element) {
        this.pan = globalThis.panzoom(element, {
            zoomDoubleClickSpeed: 1, //disable double click zoom
            beforeMouseDown: evt => {
                return !this.isPanKeyPressed(evt)
            },
            beforeWheel: evt => { //zoom does not work in combination with muuri
                return true
            },
            filterKey: (e, dx, dy, dz) => {
                return true
            }
        })

        this.pan.moveTo(64, 32)

        this._addGrabbingHandler()
    }

    reset () {
        this.pan.moveTo(64, 32)
    }

    isPanKeyPressed (evt) {
        return evt.shiftKey || evt.ctrlKey
    }

    _addGrabbingHandler() {
        document.addEventListener("keydown", evt => {
            if (this.isPanKeyPressed(evt) && !globalThis.panning && !globalThis.dragging) {
                document.body.style.cursor = "grab"
            }
        })
        document.addEventListener("keyup", evt => {
            if (!this.isPanKeyPressed(evt) && !globalThis.panning) {
                document.body.style.cursor = ""
            }
        })
        document.addEventListener("mousedown", evt => {
            if (this.isPanKeyPressed(evt)) {
                globalThis.panning = true
                document.body.style.cursor = "grabbing"
                GridManager.setDraggable(false)
            }
        })
        document.addEventListener("mouseup", evt => {
            if (globalThis.panning){
                globalThis.panning = false
                GridManager.setDraggable(true)
            }

            if (this.isPanKeyPressed(evt)) {
                document.body.style.cursor = "grab"
            } else {
                document.body.style.cursor = ""
            }
        })
    }
}

globalThis.ZoomManager = new _ZoomManager()
export default globalThis.ZoomManager