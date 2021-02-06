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

    grid.on("dragStart", evt => {
        globalThis.dragging = true
    })

    grid.on("dragEnd", evt => {
        globalThis.dragging = false
    })

    updateSize()
    addItems(16)
}

function customLayout () {

}

export function setDraggable (value) {
    grid.updateSettings({
        dragEnabled: !!value
    })
}

export function addRow () {
    rows += 1
    updateSize()
    addItems(columns)
}

export function addColumn () {
    const indexList = new Array(rows).fill(0).map((value, index, arr) => {
        return columns * (index + 1) + index
    })
    columns += 1
    updateSize()
    addItems(rows, indexList)
}

function addItems (items, indexList) {
    for(let i = 0; i < items; i++) {
        const item = document.createElement("div")
        const itemContent = document.createElement("div")
        itemContent.classList.add("item-content")
        itemContent.innerText = i + itemCount
        item.appendChild(itemContent)
        item.classList.add("empty-item")
        item.classList.add("item")

        const index = Array.isArray(indexList) ? indexList[i] : -1
        grid.add(item, {
            layout: false,
            index: index
        })
    }
    itemCount += items
    grid.layout()
}

export function updateSize () {
    const size = getBlockSize()
    element.style.width = size * columns + MARGIN * 2 * columns + "px"
    element.style.height = size * rows + MARGIN * 2 * rows + "px"
}