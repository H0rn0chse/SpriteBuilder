import GridManager from "./GridManager.js";
import { Item } from "./Item.js";
import { getKeyByValue } from "./utils.js";

class _ItemManager {
    constructor () {
        // Item : MuuriItem
        this.items = new Map()
        // Item : MuuriItem
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
            index = GridManager.getNewItemIndex()
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

    isPlaceholder (element) {
        const item = getKeyByValue(this.placeholder, element)
        return !!item
    }

    updateAllItemDimensions () {
        this.items.forEach((val, item) => {
            item.updateDimensions()
        })
        this.placeholder.forEach((val, item) => {
            item.updateDimensions()
        })
    }

    getImages () {
        const images = new Map()
        this.items.forEach((element, item) => {
            const metadata = {
                index: GridManager.getItemIndex(item),
                name: item.name,
                top: element.top,
                left: element.left,
                marginTop: element.marginTop,
                marginLeft: element.marginLeft,
                width: item.imageRef.naturalWidth,
                height: item.imageRef.naturalHeight
            }
            // item && item.getPosition() //todo dev version

            images.set(item.imageRef, metadata)
        })
        return images
    }
}

globalThis.ItemManager = new _ItemManager()
export default globalThis.ItemManager