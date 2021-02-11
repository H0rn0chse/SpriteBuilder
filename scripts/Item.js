import { Deferred } from "./Deferred.js";

globalThis.itemCount = 0

export class Item {
    constructor (src) {
        this.src = src
        this.rows = 1
        this.cols = 1
        this.margin = 0

        this.loaded = new Deferred()

        this.domRef = null
        this._createItem()

        this.imageRef = null
        this.contentRef = null
        this._createContent()
    }

    _createItem () {
        this.domRef = document.createElement("div")
        this.domRef.classList.add("item")
        if (!this.src) {
            this.domRef.classList.add("empty-item")
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
            this.contentRef.innerText = ++globalThis.itemCount
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

    getSize () {
        return this.rows * this.cols
    }

    updateDimensions () {
        const layout = GridManager.getLayout()

        this.domRef.style.marginBottom = this.rows * layout.margin + "px"
        this.domRef.style.marginTop = this.rows * layout.margin + "px"
        this.domRef.style.marginLeft = this.cols * layout.margin + "px"
        this.domRef.style.marginRight = this.cols * layout.margin + "px"
        this.domRef.style.width = this.cols * layout.blockSize + "px"
        this.domRef.style.height = this.rows * layout.blockSize + "px"
    }
}