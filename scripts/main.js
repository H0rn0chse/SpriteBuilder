export function init () {
    // just grab a DOM element
    const element = document.querySelector('#scene')

    // And pass it to panzoom
    globalThis.panzoom(element)
}