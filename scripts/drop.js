let dragArea

export function initDrag (element) {
    dragArea = element
    dragArea.addEventListener("dragleave", setHoverClass.bind(this, false))
    dragArea.addEventListener("dragend", setHoverClass.bind(this, false))
    dragArea.addEventListener("drop", setHoverClass.bind(this, false))

    dragArea.addEventListener("dragover", setHoverClass.bind(this, true))
    dragArea.addEventListener("dragenter", setHoverClass.bind(this, true))

    dragArea.addEventListener("drop", handleDrop.bind(this))
    dragArea.addEventListener("dragover", handleDragOver.bind(this))
}

const lastHover = {};
function setHoverClass (isHovered) {
    // keep own timeout running
    if (lastHover.wasHovered === isHovered) {
        return;
    }

    // clear enemy timeout
    if (lastHover.timeoutId && dragArea.classList.contains("light") === isHovered && lastHover.wasHovered !== isHovered) {
        clearTimeout(lastHover.timeoutId);
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

function handleDragOver (event) {
    event.preventDefault()
    event.stopPropagation();

    setHoverClass(true)
}

function handleDrop (event) {
    event.stopPropagation();
    event.preventDefault()

    const eventOut = {
        target: {
            files: {}
        }
    }

    if (event.dataTransfer.items) {
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === 'file') {
                eventOut.target.files[i] = event.dataTransfer.items[i].getAsFile();
            }
          }
    } else {
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
            eventOut.target.files[i] = event.dataTransfer.files[i]
        }
    }
    console.error("do stuff")
    //window.handleFileSelect(eventOut)
}