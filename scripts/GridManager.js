import { Item } from "./Item.js";
import ItemManager from "./ItemManager.js";
import { getBlockSize } from "./ui.js";

// startup params
const ROWS = 4 //8
const COLS = 2 //12
const MARGIN = 5

// ROWS === HEIGHT
// COLS === WIDTH

let _margin = 5

class _GridManager {
    constructor () {
        this.grid = null
        this.element = null
        // default values get overwritten by reset
        this.rows = ROWS
        this.cols = COLS
        this.currentBlockSize = 64
    }

    init (element) {
        this.element = element
        this.grid = new Muuri(element, {
            dragEnabled: true,
            items: ".item",
            dragPlaceholder: {
                enabled: true
            },
            dragStartPredicate: {
                delay: 0
            },
            dragSortPredicate: {
                action: "move"
            },
            layout: {
                fillGaps: true
            }
        })

        this.grid.on("dragStart", evt => {
            globalThis.dragging = true
        })

        this.grid.on("dragEnd", evt => {
            globalThis.dragging = false
        })

        this.reset()
    }

    getLayout () {
        return {
            rows: this.rows,
            cols: this.cols,
            blockSize: this.currentBlockSize,
            margin: _margin
        }
    }

    getContainer () {
        return this.element
    }

    async reset () {
        this.rows = ROWS
        this.cols = COLS
        this.currentBlockSize = getBlockSize()

        this.resetMargin()
        this.removeAllItems()
        const items = ROWS * COLS
        for (let i = 0; i < items; i++) {
            const item = new Item()
            await ItemManager.addItem(item, -1)
        }

        this.updateContainerSize()
        this.updateLayout()
    }

    removeAllItems() {
        const items = this.grid.getItems()
        this.grid.remove(items, { layout: false, removeElements: true })
        ItemManager.reset()
    }

    setDraggable (value) {
        this.grid.updateSettings({ //todo dev version
            dragEnabled: !!value
        })
    }

    async extendRows (count) {
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < GridManager.cols; j++) {
                const item = new Item()
                await ItemManager.addItem(item, -1)
            }
            this.rows += 1
        }
    }

    async extendColumns (count) {
        for (let i = 0; i < count; i++) {
            const indexList = await GridManager._getColumnIndexList()
            for (let i = 0; i < indexList.length; i++) {
                const item = new Item()
                await ItemManager.addItem(item, i)
            }
            this.cols += 1
        }
    }

    async _getColumnIndexList () {
        // we need to fix the layout first
        // otherwise the map is broken
        await this.fixLayout()

        const map = this._getItemMap()
        return new Array(this.rows).fill(0).map((value, index) => {
            return map[this.cols - 1][index].index + 1 + index
        })
    }

    getImageInsertIndex () {

    }

    async fixLayout () {
        const calcSize = this.getCalculatedSize()
        const size = this.getActualSize()

        // The layout is somehow broken
        // TODO it might be safer to work with the area instead of the rows
        if (calcSize.size !== size.size) {
            const missingCount = size.size - calcSize.size

            for (let i = 0; i < missingCount; i++) {
                const item = new Item()
                await ItemManager.addItem(item, -1)
            }

            this.cols = size.cols
            this.rows = size.rows

            this.updateLayout(true)
        }
    }

    _getItemMap () {
        const map = {}
        for (let x = 0; x < this.cols; x++) {
            map[x] = {}
            for (let y = 0; y < this.rows; y++) {
                map[x][y] = {
                    index: null,
                    item: null
                }
            }
        }

        const items = this.grid.getItems();
        items.forEach((item, index) => {
            this._getIndexList(item).forEach(pos => {
                map[pos.x][pos.y].index = index
                map[pos.x][pos.y].item = item
            })
        });
        return map
    }

    _getIndexList (item) {
        const indexList = []

        // top/left index
        const blockSize = this.getBlockSize()
        const corner = {
            x: Math.round(item.left) / blockSize,
            y: Math.round(item.top) / blockSize,
        }
        indexList.push(corner)

        // area size
        const cols = Math.round(item.width) / this.currentBlockSize
        const rows = Math.round(item.height) / this.currentBlockSize

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (x === 0 && y === 0) {
                    continue
                }
                const point = {
                    x: corner.x + x,
                    y: corner.y + y
                }
                indexList.push(point)
            }
        }

        return indexList
    }

    removeItems (items) {
        this.grid.remove(items, { layout: false, removeElements: true });
    }

    /**
     *
     * @param {Item} item
     * @param {*} index
     */
    addItem (item, index) {
        return this.grid.add(item.domRef, { layout: false, index: index })[0]
    }

    getItemSize (item) {
        const width = Math.round(item.width) / this.currentBlockSize
        const height = Math.round(item.height) / this.currentBlockSize
        return {
            width: width,
            height: height,
            size: Math.round(width * height)
        }
    }

    updateContainerSize () {
        const size = this.getCalculatedSize()
        this.element.style.width = size.width + "px"
        this.element.style.height = size.height + "px"
    }

    /**
     * The calculated size represents the size how it should be
     * theoretically
     */
    getCalculatedSize () {
        let blocks = 0;
        this.grid.getItems().forEach(item => {
            blocks += this.getItemSize(item).size
        })
        const blockSize = this.getBlockSize()
        return {
            width: this.cols * blockSize,
            height: this.rows * blockSize,
            cols: this.cols,
            rows: this.rows,
            size: Math.round(blocks)
        }
    }

    /**
     * The calculated size represents the size how it currently is
     */
    getActualSize () {
        const blockSize = this.getBlockSize()
        const width = this.element.offsetWidth
        const height = this.element.offsetHeight
        const rows = height / blockSize
        const cols = width / blockSize
        return {
            width: width,
            height: height,
            cols: cols,
            rows: rows,
            size: cols * rows
        }
    }

    getBlockSize () {
        return parseInt(_margin, 10) * 2 + parseInt(this.currentBlockSize, 10)
    }

    updateLayout (instant = false) {
        this.grid.layout({ instant: !!instant })
    }

    refreshAll () {
        const items = this.grid.getItems()

        this.grid.hide(items, { instant: true })
        this.grid.show(items, { instant: true, layout: "instant" })
    }

    setMargin (value) {
        _margin = value
    }

    resetMargin () {
        _margin = MARGIN
    }
}

globalThis.GridManager = new _GridManager()
export default globalThis.GridManager
