import { importImage, importImageHandler } from "./importFile.js";

let dragArea

export function initDrag (area, button) {
    dragArea = area
    dragArea.addEventListener("dragleave", setHoverClass.bind(this, false))
    dragArea.addEventListener("dragend", setHoverClass.bind(this, false))
    dragArea.addEventListener("drop", setHoverClass.bind(this, false))

    dragArea.addEventListener("dragover", setHoverClass.bind(this, true))
    dragArea.addEventListener("dragenter", setHoverClass.bind(this, true))

    dragArea.addEventListener("drop", handleDrop.bind(this))
    dragArea.addEventListener("dragover", handleDragOver.bind(this))

    button.addEventListener("click", importImage)
}

const lastHover = {}
function setHoverClass (isHovered) {
    // keep own timeout running
    if (lastHover.wasHovered === isHovered) {
        return
    }

    // clear enemy timeout
    if (lastHover.timeoutId && dragArea.classList.contains("light") === isHovered && lastHover.wasHovered !== isHovered) {
        clearTimeout(lastHover.timeoutId)
        lastHover.timeoutId = null
        lastHover.wasHovered = isHovered
    }

    if (dragArea.classList.contains("light") !== isHovered) {
        lastHover.wasHovered = isHovered
        lastHover.timeoutId = setTimeout(() => {
            lastHover.timeoutId = null

            if (isHovered) {
                dragArea.classList.add("light")
            } else {
                dragArea.classList.remove("light")
            }
        }, 200)
    }
}

function handleDragOver (evt) {
    evt.preventDefault()
    evt.stopPropagation()

    setHoverClass(true)
}

function handleDrop (evt) {
    evt.stopPropagation()
    evt.preventDefault()

    const eventOut = {
        target: {
            files: {}
        }
    }

    if (evt.dataTransfer.items) {
        for (var i = 0; i < evt.dataTransfer.items.length; i++) {
            if (evt.dataTransfer.items[i].kind === 'file') {
                eventOut.target.files[i] = evt.dataTransfer.items[i].getAsFile();
            }
          }
    } else {
        for (var i = 0; i < evt.dataTransfer.files.length; i++) {
            eventOut.target.files[i] = evt.dataTransfer.files[i]
        }
    }

    importImageHandler(eventOut)
}