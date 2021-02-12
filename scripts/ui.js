import GridManager from "./GridManager.js";
import ItemManager from "./ItemManager.js";
import CanvasManager from "./CanvasManager.js";
import { exportImage } from "./exportFile.js";

export function initUi () {
    document.querySelector("#addRow").addEventListener("click", async evt => {
        await GridManager.extendRows(1)
        GridManager.updateContainerSize()
        GridManager.updateLayout()
    })

    document.querySelector("#addColumn").addEventListener("click", async evt => {
        await GridManager.extendColumns(1)
        GridManager.updateContainerSize()
        GridManager.updateLayout()
    })

    document.querySelector("#reset").addEventListener("click", evt => {
        globalThis.itemCount = 0
        GridManager.reset()
    })

    document.querySelector("#save").addEventListener("click", saveAsSpritesheet)
}

function saveAsSpritesheet () {
    // set margins
    GridManager.setMargin(50)

    const gridSize = GridManager.getActualSize()
    const images = ItemManager.getImages()
    debugger

    // reset margin
    GridManager.resetMargin()

    // reset canvas and draw images
    CanvasManager.reset()
    CanvasManager.setSize(gridSize.width, gridSize.height)
    CanvasManager.drawImages(images)
    const data = CanvasManager.getData()
    exportImage(data, "spritesheet.png")
}

export function getBlockSize () {
    return document.querySelector("#blockSize").value;
}