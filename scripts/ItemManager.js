import GridManager from "./GridManager.js";
import { Item } from "./Item.js";
import { getKeyByValue } from "./utils.js";
import InspectorManager from "./InspectorManager.js";

/**
 * MuuriItem
 * @typedef {Object} MuuriItem
 */

/**
 * Item
 * @typedef {Object} Item
 */

globalThis.itemCount = 0

/**
 * @class
 * @constructor
 */
class _ItemManager {
    constructor () {
        /**
         * @type {Map<Item, MuuriItem>}
         */
        this.items = new Map()
        /**
         * @type {Map<Item, MuuriItem>}
         */
        this.placeholder = new Map()
    }

    reset () {
        this.items.clear()
        this.placeholder.clear()
        InspectorManager.reset()
        globalThis.itemNameCache = []
    }

    /**
     * Adds an item to the grid. In case of an image item placeholder items get removed or added
     * The basic strategy is to extend the grid vertically where ever it is possible
     * @param {Item} item
     * @param {number} [index]
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
            const muuriItems = this._removePlaceholders(count)
            GridManager.removeItems(muuriItems)
            index = GridManager.getNewItemIndex()
        }

        // add the item to the grid
        const muuriItem = GridManager.addItem(item, index)

        // save the muuri ref to the map
        if (!item.src) {
            this.placeholder.set(item, muuriItem)
        } else {
            this.items.set(item, muuriItem)
        }
    }

    /**
     * @param {Item} item
     * @param {number} [index]
     */
    async importItem (item, index = 0) {
        await item.loaded.promise

        const placeholderCount = index - (this.items.size + this.placeholder.size)
        if (placeholderCount > 0) {
            for (let i = 0; i < placeholderCount; i++) {
                const item = new Item()
                await this.addItem(item, -1)
            }
        }

        // add the item to the grid
        const muuriItem = GridManager.addItem(item, index)

        // save the muuri ref to the map
        if (!item.src) {
            this.placeholder.set(item, muuriItem)
        } else {
            this.items.set(item, muuriItem)
        }
    }

    /**
     * @param {MuuriItem | Item} vItem The MuuriItem or Item
     * @param {boolean} removeGrid
     */
    removeItem (vItem, removeGrid = false) {
        let item
        let muuriItem
        let isPlaceholder

        if (vItem instanceof Item) {
            item = vItem
            if (item.isPlaceholder()) {
                isPlaceholder = true
                muuriItem = this.placeholder.get(item)
            } else {
                isPlaceholder = false
                muuriItem = this.items.get(item)
            }
        } else {
            muuriItem = vItem

            isPlaceholder = true
            item = getKeyByValue(this.placeholder, muuriItem)
            if (!item) {
                isPlaceholder = false
                item = getKeyByValue(this.items, muuriItem)
            }
        }

        if (isPlaceholder) {
            this.placeholder.delete(item)
        } else {
            this.items.delete(item)
        }

        if (removeGrid) {
            GridManager.removeItems([muuriItem])
        }
        item.destroy()
    }

    /**
     * @param {number} count
     * @returns {MuuriItem[]}
     */
    _removePlaceholders (count) {
        const removedElements = []
        const muuriItems = Array.from(this.placeholder.values()).sort((a, b) => {
            const valA = a.top + a.left
            const valB = b.top + b.left
            return valA - valB
        })

        for (let i = 0; i < count; i++) {
            const muuriItem = muuriItems.splice(0, 1)[0]
            this.removeItem(muuriItem)
            removedElements.push(muuriItem)
        }

        return removedElements
    }

    getMuuriItem (item) {
        let muuriItem = this.items.get(item)
        if (!muuriItem) {
            muuriItem = this.placeholder.get(item)
        }
        return muuriItem
    }

    getItemIndex (item) {
        let muuriItem = this.getMuuriItem(item)
        return GridManager.getItemIndex(muuriItem)
    }

    /**
     * @param {MuuriItem} muuriItem The MuuriItem
     */
    isPlaceholder (muuriItem) {
        const item = getKeyByValue(this.placeholder, muuriItem)
        return !!item
    }

    updateAllItemDimensions () {
        this.items.forEach((muuriItem, item) => {
            item.updateDimensions()
        })
        this.placeholder.forEach((muuriItem, item) => {
            item.updateDimensions()
        })
    }

    getImages () {
        const images = new Map()
        this.items.forEach((muuriItem, item) => {
            const metadata = {
                index: GridManager.getItemIndex(muuriItem),
                name: item.name,
                originalName: item.originalName,
                top: muuriItem.top,
                left: muuriItem.left,
                marginTop: muuriItem.marginTop,
                marginLeft: muuriItem.marginLeft,
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