import { Deferred } from "./Deferred.js";
import { importImage, importDataURL } from "./importFile.js";
import { addItem } from "./main.js";

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

    button.addEventListener("click", async evt => {
        const images = await importImage(true)
        for (let i = 0; i < images.length; i++) {
            await addItem(images[i].content, images[i].name)
        }
    })
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

async function handleDrop (evt) {
    evt.stopPropagation()
    evt.preventDefault()

    const eventOut = {
        target: {
            files: {}
        }
    }

    let shouldImport = true

    if (evt.dataTransfer.items) {
        for (var i = 0; i < evt.dataTransfer.items.length; i++) {
            if (evt.dataTransfer.items[i].kind === 'file') {
                eventOut.target.files[i] = evt.dataTransfer.items[i].getAsFile();
                shouldImport = eventOut.target.files[i].name.endsWith(".png") ? shouldImport : false
            }
          }
    } else {
        for (var i = 0; i < evt.dataTransfer.files.length; i++) {
            eventOut.target.files[i] = evt.dataTransfer.files[i]
            shouldImport = eventOut.target.files[i].name.endsWith(".png") ? shouldImport : false
        }
    }

    if (shouldImport) {
        const deferred = new Deferred()
        importDataURL(deferred.resolve, deferred.reject, eventOut)
        const images = await deferred.promise
        for (let i = 0; i < images.length; i++) {
            await addItem(images[i].content, images[i].name)
        }
    }
}