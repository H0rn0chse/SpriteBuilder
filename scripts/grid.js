import { getBlockSize } from "./ui.js";

const MARGIN = 5

let grid = null
let element = null
// default values get overwritten by reset
let rows = 4
let columns = 4
let itemCount = 1
let currentBlockSize = 32

export function initGrid (container) {
    element = container
    grid = new Muuri(container, {
        dragEnabled: true,
        items: ".item",
        dragPlaceholder: {
            enabled: true
        },
        dragSortPredicate: {
            action: "swap",
            migrateAction: "swap"
        }
    })

    grid.on("dragStart", evt => {
        globalThis.dragging = true
    })

    grid.on("dragEnd", evt => {
        globalThis.dragging = false
    })

    resetGrid()
}

export function resetGrid () {
    rows = 4
    columns = 4
    itemCount = 1
    currentBlockSize = getBlockSize()
    removeAllItems()
    updateGridSize()
    addItems(16)
}

function removeAllItems() {
    grid.remove(grid.getItems(), { layout: false, removeElements: true });
}

export function setDraggable (value) {
    grid.updateSettings({
        dragEnabled: !!value
    })
}

export function addRow () {
    rows += 1
    updateGridSize()
    addItems(columns)
}

export function addColumn () {
    const indexList = new Array(rows).fill(0).map((value, index, arr) => {
        return columns * (index + 1) + index
    })
    columns += 1
    updateGridSize()
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
        item.style.width = currentBlockSize + "px"
        item.style.height = currentBlockSize + "px"

        const index = Array.isArray(indexList) ? indexList[i] : -1
        grid.add(item, {
            layout: false,
            index: index
        })
    }
    itemCount += items
    grid.layout()
}

export function getCurrentBlockSize() {
    return currentBlockSize
}

export function updateGridSize () {
    element.style.width = currentBlockSize * columns + MARGIN * 2 * columns + "px"
    element.style.height = currentBlockSize * rows + MARGIN * 2 * rows + "px"
}