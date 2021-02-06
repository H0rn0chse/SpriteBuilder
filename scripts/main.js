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
    })
}