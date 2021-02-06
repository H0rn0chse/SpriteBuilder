export function initGrid (containerClass) {
    var grid = new Muuri(containerClass, {
        dragEnabled: true,
        items: '.item',
        dragPlaceholder: {
            enabled: true
        }
    })
}