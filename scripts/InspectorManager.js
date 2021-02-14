class _InspectorManager {
    constructor () {
        this.element = document.querySelector("#inspector")
        this.button = document.querySelector("#inspectorButton")
        this.visible = false
        // dev settings
        //this.visible = true

        this.nameInput = document.querySelector("#inspectorName")
        this.metadataInput = document.querySelector("#inspectorMetadata")
    }

    init () {
        this.button.addEventListener("click", evt => {
            this.show(!this.visible)
        })
        document.querySelector("#inspectorUpdate").addEventListener("click", evt => {

        })
        document.querySelector("#inspectorDelete").addEventListener("click", evt => {

        })
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
    }
}

globalThis.InspectorManager = new _InspectorManager()
export default globalThis.InspectorManager