export function init () {
    // just grab a DOM element
    const element = document.querySelector('#scene')

    // And pass it to panzoom
    globalThis.panzoom(element, {
        beforeMouseDown: evt => {
            // allow panning only if ctrlKey is down
            return !evt.ctrlKey;
        },
        beforeWheel: evt => {
            // allow zooming only if ctrlKey is down
            return !evt.ctrlKey;
        },
    })
}