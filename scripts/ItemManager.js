import { Grid } from "./Grid.js";

class _ItemManager {
    constructor () {
        this.items = new Map()
        this.emptyItems = new Map()
    }

    reset () {
        this.items.clear()
        this.emptyItems.clear()
    }

    addItem (src) {
        const item = this.createItem(src)
        const image = item.querySelector("img")

        image.onload = evt => {
            const layout = Grid.getLayout()
            const height = image.naturalHeight
            const width = image.naturalWidth
            const blockHeight = Math.ceil(height / layout.blockSize)
            const blockWidth = Math.ceil(width / layout.blockSize)
            const blockCount = blockWidth * blockHeight

            if (this.emptyItems.size > blockCount) {
                item.style.marginBottom = (blockHeight) * layout.margin + "px"
                item.style.marginTop = (blockHeight) * layout.margin + "px"
                item.style.marginLeft = (blockWidth) * layout.margin + "px"
                item.style.marginRight = (blockWidth) * layout.margin + "px"
                item.style.width = blockWidth * layout.blockSize + "px"
                item.style.height = blockHeight * layout.blockSize + "px"

                const placeholder = []
                this.emptyItems.forEach((val, item) => {
                    if (blockCount > 0) {
                        blockCount -= 1
                        placeholder.push(item)
                        this.emptyItems.delete(item)
                    }
                })

                Grid.removeItems(placeholder)
                Grid.addItem(item)
                Grid.updateLayout()
            } else {
                item.style.display = "none"
            }
        }
    }

    createItem (src) {
        const layout = Grid.getLayout()
        const item = document.createElement("div")
        const itemContent = this._createItemContent(src)

        item.appendChild(itemContent)
        item.classList.add("item")
        item.style.width = layout.blockSize + "px"
        item.style.height = layout.blockSize + "px"

        //Add to grid
        Grid.getContainer().appendChild(item)

        if (src) {
            this.items.set(item, true)
        } else {
            this.emptyItems.set(item, true)
        }

        return item
    }

    _createItemContent(src) {
        const itemContent = document.createElement("div")
        itemContent.classList.add("item-content")
        if (src) {
            const image = document.createElement("img")
            image.src = src
            itemContent.appendChild(image)
        }
        return itemContent
    }
}

export const ItemManager = new _ItemManager()