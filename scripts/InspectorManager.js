import ItemManager from "./ItemManager.js";
import GridManager from "./GridManager.js";
class _InspectorManager {
    constructor () {
        this.element = document.querySelector("#inspector")
        this.button = document.querySelector("#inspectorButton")
        this.visible = false
        // dev settings
        this.visible = true

        this.nameMsg = document.querySelector("#inspectorNameMsg")
        this.nameInput = document.querySelector("#inspectorName")
        this.metadataInput = document.querySelector("#inspectorMetadata")

        this.currentItem = null
    }

    init () {
        this.button.addEventListener("click", evt => {
            this.show(!this.visible)
        })
        document.querySelector("#inspectorUpdate").addEventListener("click", evt => {

        })
        document.querySelector("#inspectorDelete").addEventListener("click", evt => {
            this._removeCurrentItem()
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
                    this.nameMsg.innerText = "This name was alread used!"
                }
            } else {
                this.nameMsg.classList.add("success")
                this.nameMsg.innerText = "Saved"
            }
        })
    }

    reset () {
        this.currentItem = null
        this.nameInput.value = ""
        this.metadataInput.value = ""
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

    async _removeCurrentItem () {
        const item = this.currentItem
        if (!item) {
            return
        }
        this._selectCurrentItem(false)
        this.reset()

        ItemManager.removeItem(item, true)
        await GridManager.fixLayout()
    }

    load (item) {
        // unselect old item
        this._selectCurrentItem(false)

        // select new item
        this.currentItem = item
        this._selectCurrentItem(this.visible)

        this.nameInput.value = item.name
    }
}

globalThis.InspectorManager = new _InspectorManager()
export default globalThis.InspectorManager