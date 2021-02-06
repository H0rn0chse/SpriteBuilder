export function init() {
    const element = document.querySelector('#scene')

    const pan = globalThis.panzoom(element, {
        zoomDoubleClickSpeed: 1, //disable double click zoom
        beforeMouseDown: evt => {
            return !evt.ctrlKey
        },
        beforeWheel: evt => {
            return !evt.ctrlKey
        }
    })

    var grid = new Muuri('.grid')

    addHandler()
}

function addHandler() {
    document.addEventListener("keydown", evt => {
        if (evt.ctrlKey && !globalThis.grabbing) {
            document.body.style.cursor = "grab"
        }
    })
    document.addEventListener("keyup", evt => {
        if (!evt.ctrlKey && !globalThis.grabbing) {
            document.body.style.cursor = ""
        }
    })
    document.addEventListener("mousedown", evt => {
        if (evt.ctrlKey) {
            globalThis.grabbing = true
            document.body.style.cursor = "grabbing"
        }
    })
    document.addEventListener("mouseup", evt => {
        globalThis.grabbing = false
        if (evt.ctrlKey) {
            document.body.style.cursor = "grab"
        } else {
            document.body.style.cursor = ""
        }
    })
}