import { Grid } from "./Grid.js/index.js";

class _ItemManager {
    constructor () {
        this.items = []
        this.emptyItems = []
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

            if (this.emptyItems.length > blockCount) {
                item.style.marginBottom = (blockHeight) * layout.margin + "px"
                item.style.marginTop = (blockHeight) * layout.margin + "px"
                item.style.marginLeft = (blockWidth) * layout.margin + "px"
                item.style.marginRight = (blockWidth) * layout.margin + "px"
                item.style.width = blockWidth * layout.blockSize + "px"
                item.style.height = blockHeight * layout.blockSize + "px"

                const placeholder = this.emptyItems.splice(0, blockCount)
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
            this.items.push(item)
        } else {
            this.emptyItems.push(item)
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