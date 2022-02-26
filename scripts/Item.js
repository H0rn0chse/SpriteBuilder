import { Deferred } from "./Deferred.js";
import { getGuid } from "./utils.js";
import InspectorManager from "./InspectorManager.js";

globalThis.itemNameCache = []

export class Item {
    constructor (src, name = "", originalName = null) {
        this.loaded = new Deferred()

        this.src = src
        this.rows = 1
        this.cols = 1
        this.margin = 0

        this.metadata = {}
        this.originalName = originalName !== null ? originalName : name

        if (!name || globalThis.itemNameCache.includes(name)) {
            name = `${name}_${getGuid()}`
        }
        globalThis.itemNameCache.push(name)
        this.name = name

        this.domRef = null
        this._createItem()

        this.imageRef = null
        this.contentRef = null
        this._createContent()
    }

    setMetadata (metadata) {
        this.metadata = metadata
    }

    updateName (name) {
        const cache = globalThis.itemNameCache
        if (cache.includes(name)) {
            return false
        }

        const index = cache.indexOf(this.name)
        if (index > -1) {
            cache.splice(index, 1)
        }
        this.name = name
        cache.push(name)
        return true
    }

    updateSrc (src) {
        this.loaded = new Deferred()
        this.src = src
        this.imageRef.src = src
        this.imageRef.onload = this._onImageLoad.bind(this)
    }


    isPlaceholder () {
        return !this.src
    }

    _createItem () {
        this.domRef = document.createElement("div")
        this.domRef.classList.add("item")
        if (!this.src) {
            this.domRef.classList.add("empty-item")
        } else {
            this.domRef.addEventListener("dblclick", evt => {
                InspectorManager.show(true)
            })
            this.domRef.addEventListener("click", evt => {
                InspectorManager.load(this)
            })
        }
    }

    _createContent () {
        this.contentRef = document.createElement("div")
        this.contentRef.classList.add("item-content")

        if (this.src) {
            this.imageRef = document.createElement("img")
            this.imageRef.src = this.src
            this.imageRef.onload = this._onImageLoad.bind(this)

            this.contentRef.appendChild(this.imageRef)
        } else {
            // dev content
            //this.contentRef.innerText = ++globalThis.itemCount
            this.updateDimensions()
            this.loaded.resolve()
        }
        this.domRef.appendChild(this.contentRef)
    }

    _onImageLoad () {
        const layout = GridManager.getLayout()
        const image = this.contentRef.querySelector("img")

        const height = image.naturalHeight
        const width = image.naturalWidth

        this.rows = Math.ceil(height / layout.blockSize)
        this.cols = Math.ceil(width / layout.blockSize)

        this.updateDimensions()
        this.loaded.resolve()
    }

    setSelected (value) {
        if (value) {
            this.domRef.classList.add("selected")
        } else {
            this.domRef.classList.remove("selected")
        }
    }

    getSize () {
        return this.rows * this.cols
    }

    updateDimensions () {
        const layout = GridManager.getLayout()

        this.domRef.style.marginBottom = this.rows * layout.margin + "px"
        this.domRef.style.marginTop = this.rows * layout.margin + "px"
        this.domRef.style.marginRight = this.cols * layout.margin + "px"
        this.domRef.style.marginLeft = this.cols * layout.margin + "px"
        this.domRef.style.width = this.cols * layout.blockSize + "px"
        this.domRef.style.height = this.rows * layout.blockSize + "px"
    }

    destroy () {
        const cache = globalThis.itemNameCache
        const index = cache.indexOf(this.name)
        if (index > -1) {
            cache.splice(index, 1)
        }
    }
}