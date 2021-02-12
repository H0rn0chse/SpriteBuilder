import GridManager from "./GridManager.js";
import ItemManager from "./ItemManager.js";
import CanvasManager from "./CanvasManager.js";
import { exportImage, exportJson } from "./exportFile.js";
import ZoomManager from "./ZoomManager.js";
import { getGuid } from "./utils.js";

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
        ZoomManager.reset()
    })

    document.querySelector("#saveSpritesheet").addEventListener("click", saveSpritesheet)
    document.querySelector("#saveLayout").addEventListener("click", saveLayout)
}

export function getBlockSize () {
    return document.querySelector("#blockSize").value;
}

function saveSpritesheet () {
    // set margins
    const margin = document.querySelector("#exportMargin").value
    GridManager.setMargin(margin)

    const gridSize = GridManager.getActualSize()
    const images = ItemManager.getImages()

    // reset margin
    GridManager.resetMargin()

    // reset canvas and draw images
    CanvasManager.reset()
    CanvasManager.setSize(gridSize.width, gridSize.height)
    CanvasManager.drawImages(images)
    const data = CanvasManager.getData()
    exportImage(data, "spritesheet.png")
}

function saveLayout () {
    // set margins
    const margin = document.querySelector("#exportMargin").value
    GridManager.setMargin(margin)

    const images = ItemManager.getImages()

    GridManager.resetMargin(margin)

    const layoutData = {
        images: {}
    }

    images.forEach((metadata, image) => {
        if (layoutData.images[metadata.name]) {
            metadata.name = getGuid()
        }
        layoutData.images[metadata.name] = {
            x: metadata.left + metadata.marginLeft,
            y: metadata.top + metadata.marginTop,
            w: metadata.width,
            h: metadata.height
        }
    })

    exportJson(layoutData, "layout.json")
}
