import CanvasManager from "./CanvasManager.js";
import { exportImage } from "./exportFile.js";
import GridManager from "./GridManager.js";
import { Item } from "./Item.js";
import { getKeyByValue } from "./utils.js";

class _ItemManager {
    constructor () {
        this.items = new Map()
        this.placeholder = new Map()
    }

    reset () {
        this.items.clear()
        this.placeholder.clear()
    }

    /**
     * Adds an item to the grid. In case of an image item placeholder items get removed or added
     * The basic strategy is to extend the grid vertically where ever it is possible
     * @param {Item} item
     */
    async addItem (item, index = 0) {
        await item.loaded.promise

        if (item.src){
            const count = item.getSize()

            // Extend the minimum width
            const colDiff = item.cols - GridManager.cols
            await GridManager.extendColumns(colDiff)

            const countDiff = count - this.placeholder.size
            const rowDiff = Math.ceil(countDiff / GridManager.cols)
            await GridManager.extendRows(rowDiff)

            // now there should be enough placeholder available
            const elements = this._removePlaceholder(count)
            GridManager.removeItems(elements)
        }

        // add the item to the grid
        const element = GridManager.addItem(item, index)

        // save the muuri ref to the map
        if (!item.src) {
            this.placeholder.set(item, element)
        } else {
            this.items.set(item, element)
        }
    }

    _removePlaceholder (count) {
        const removedElements = []
        const elements = Array.from(this.placeholder.values()).sort((a, b) => {
            const valA = a.top + a.left
            const valB = b.top + b.left
            return valA > valB
        })

        for (let i = 0; i < count; i++) {
            const element = elements.splice(0, 1)[0]
            const key = getKeyByValue(this.placeholder, element)
            this.placeholder.delete(key)
            removedElements.push(element)
        }

        return removedElements
    }

    setSpacing () {
        this.items.forEach((val, item) => {
            item.updateDimensions()
        })
        this.placeholder.forEach((val, item) => {
            item.updateDimensions()
        })
    }

    save () {
        // remove margins
        GridManager.setMargin(0)
        this.setSpacing()
        GridManager.updateContainerSize()
        GridManager.refreshAll()

        const layout = GridManager.getLayout()
        const canvasWidth = layout.blockSize * layout.cols
        const canvasHeight = layout.blockSize * layout.rows

        const images = this._getImages()

        // reset grid
        GridManager.resetMargin()
        this.setSpacing()
        GridManager.updateContainerSize()
        GridManager.refreshAll()

        CanvasManager.reset()
        CanvasManager.setSize(canvasWidth, canvasHeight)
        CanvasManager.drawImages(images)
        const data = CanvasManager.getData()
        exportImage(data, "spritesheet.png")
    }

    _getImages () {
        const images = new Map()
        this.items.forEach((val, item) => {
            const position = {
                top: val.top,
                left: val.left
            }
            // item && item.getPosition() //todo dev version

            images.set(item.imageRef, position)
        })
        return images
    }
}

globalThis.ItemManager = new _ItemManager()
export default globalThis.ItemManager