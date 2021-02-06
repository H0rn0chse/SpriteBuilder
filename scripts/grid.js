import { getBlockSize } from "./ui.js";

const MARGIN = 5

let grid = null
let element = null
let rows = 4
let columns = 4
let itemCount = 1

export function initGrid (container) {
    element = container
    grid = new Muuri(container, {
        dragEnabled: true,
        items: '.item',
        dragPlaceholder: {
            enabled: true
        }
    })

    updateSize()
    addItems(16)
}

function customLayout () {

}

export function addRow () {
    rows += 1
    updateSize()
    addItems(columns)
}

function addItems (items) {
    for(let i = 0; i < items; i++) {
        const item = document.createElement("div")
        const itemContent = document.createElement("div")
        itemContent.classList.add("item-content")
        itemContent.innerText = i + itemCount
        item.appendChild(itemContent)
        item.classList.add("empty-item")
        item.classList.add("item")
        grid.add(item, {
            layout: false
        })
    }
    itemCount += items
    grid.layout()
}

export function addColumn () {
    columns += 1
    updateSize()
    addItems(rows)
}

export function updateSize () {
    const size = getBlockSize()
    element.style.width = size * columns + MARGIN * 2 * columns + "px"
    element.style.height = size * rows + MARGIN * 2 * rows + "px"
}