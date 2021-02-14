import ItemManager from "./ItemManager.js";
import GridManager from "./GridManager.js";
import { importImage } from "./importFile.js";
import { insertTextAtCaret } from "./utils.js"

class _InspectorManager {
    constructor () {
        this.element = document.querySelector("#inspector")
        this.button = document.querySelector("#inspectorButton")
        this.visible = false

        this.nameMsg = document.querySelector("#inspectorNameMsg")
        this.nameInput = document.querySelector("#inspectorName")
        this.metadataInput = document.querySelector("#inspectorMetadata")
        this.metadataBtn = document.querySelector("#inspectorMetadataSave")
        this.metadataMsg = document.querySelector("#inspectorMetadataMsg")

        this.currentItem = null
    }

    init () {
        document.querySelector("#inspectorNameLbl").addEventListener("click", evt => {
            this.nameInput.focus()
        })
        document.querySelector("#inspectorMetadataLbl").addEventListener("click", evt => {
            this.metadataInput.focus()
        })
        document.querySelector("#inspectorUpdate").addEventListener("click", evt => {
            if (!this.currentItem) {
                return
            }
            this._updateSprite()
        })
        document.querySelector("#inspectorDelete").addEventListener("click", evt => {
            if (!this.currentItem) {
                return
            }
            this._removeCurrentItem()
        })

        this.button.addEventListener("click", evt => {
            this.show(!this.visible)
        })

        this.nameInput.addEventListener("focusin", evt => {
            this.nameBackup = this.nameInput.value
            this.nameMsg.innerText = ""
        })

        this.nameInput.addEventListener("focusout", evt => {
            const newName = this.nameInput.value
            if (newName === this.nameBackup) {
                return
            }
            this.nameMsg.classList.remove("error")
            this.nameMsg.classList.remove("success")

            if (!this._updateName(newName)) {
                this.nameMsg.classList.add("error")
                this.nameInput.value = this.nameBackup

                if (!newName) {
                    this.nameMsg.innerText = "A name is required!"
                } else  if (this.currentItem !== null) {
                    this.nameMsg.innerText = "This name was already used!"
                }
            } else {
                this.nameMsg.classList.add("success")
                this.nameMsg.innerText = "Saved"
            }
        })

        this.metadataInput.addEventListener("focusin", evt => {
            this.metadataMsg.innerText = ""
        })

        this.metadataInput.addEventListener("focusout", evt => {
            if (!this.currentItem) {
                this.metadataInput.value = ""
            }
        })

        this.metadataBtn.addEventListener("click", evt => {
            this.metadataMsg.innerText = ""
            const metadata = this.metadataInput.value

            this.metadataMsg.classList.remove("error")
            this.metadataMsg.classList.remove("success")

            if (!this.currentItem) {
                return
            }
            if (this._updateMetadata(metadata)) {
                this.metadataMsg.classList.add("success")
                this.metadataMsg.innerText = "Saved"
            } else {
                this.metadataMsg.classList.add("error")
                this.metadataMsg.innerText = "An error occurred"
            }
        })

        this.metadataInput.addEventListener("keydown", evt => {
            if (evt.key === "Tab") {
                evt.preventDefault()
                insertTextAtCaret(this.metadataInput, "  ")
            }
        })

        document.addEventListener("keydown", evt => {
            if (evt.key === "Escape") {
                this.show(false)
            }
        })
    }

    reset () {
        this.currentItem = null
        this.nameInput.value = ""
        this.metadataInput.value = ""
        this.nameMsg.innerText = ""
        this.metadataMsg.innerText = ""
    }

    show (show) {
        if (show && !this.visible) {
            this.element.classList.remove("hide")
            this.element.classList.add("show")

            this.button.querySelector(".arrow.left").style.display = "none"
            this.button.querySelector(".arrow.right").style.display = "inherit"
        }
        if (!show && this.visible) {
            this.element.classList.remove("show")
            this.element.classList.add("hide")

            this.button.querySelector(".arrow.left").style.display = "inherit"
            this.button.querySelector(".arrow.right").style.display = "none"
        }
        this.visible = !!show
        this._selectCurrentItem(this.visible)
    }

    _selectCurrentItem (value) {
        if (this.currentItem && this.currentItem.setSelected) {
            this.currentItem.setSelected(!!value)
        }
    }

    _updateName (name) {
        if (name && this.currentItem && this.currentItem.updateName) {
            return this.currentItem.updateName(name)
        }
        return false
    }

    _updateMetadata (metadataJson) {
        let result = null
        try {
            result = JSON.parse(metadataJson)
        } catch (err) {
            console.error(err)
        }
        if (result !== null) {
            this.currentItem.setMetadata(result)
            this.metadataInput.value = JSON.stringify(result, null, 2)
            return true
        }
        return false
    }

    async _removeCurrentItem () {
        const item = this.currentItem
        this._selectCurrentItem(false)
        this.reset()

        ItemManager.removeItem(item, true)
        await GridManager.fixLayout()
    }

    async _updateSprite () {
        const response = await importImage(false)
        this.currentItem.updateSrc(response[0].content)
        await this.currentItem.loaded.promise

        GridManager.refreshAll()
        GridManager.updateContainerSize()
        await GridManager.fixLayout()
    }

    load (item) {
        // unselect old item and reset
        this._selectCurrentItem(false)
        this.reset()

        // select new item
        this.currentItem = item
        this._selectCurrentItem(this.visible)

        this.nameInput.value = item.name
        this.metadataInput.value = JSON.stringify(item.metadata, null, 2)
    }
}

globalThis.InspectorManager = new _InspectorManager()
export default globalThis.InspectorManager