import GridManager from "./GridManager.js";
import ItemManager from "./ItemManager.js";
import CanvasManager from "./CanvasManager.js";
import { exportImage, exportJson } from "./exportFile.js";
import ZoomManager from "./ZoomManager.js";
import { getGuid } from "./utils.js";
import { importFile } from "./importFile.js";
import { Item } from "./Item.js";

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
    document.querySelector("#export").addEventListener("click", saveLayout.bind(null, true))
    document.querySelector("#import").addEventListener("click", importFile)
}

export function getBlockSize () {
    return document.querySelector("#blockSize").value;
}

function setBlockSize (value) {
    return document.querySelector("#blockSize").value = value;
}

export function getSpacing () {
    return document.querySelector("#exportMargin").value;
}

function setSpacing (value) {
    return document.querySelector("#exportMargin").value = value;
}

function saveSpritesheet () {
    // set margins
    const margin = getSpacing()
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

function saveLayout (saveImageData = false) {
    // set margins
    const margin = getSpacing()
    GridManager.setMargin(margin)

    const images = ItemManager.getImages()

    GridManager.resetMargin(margin)

    const layoutData = {
        metadata: {},
        sprites: {}
    }

    if (saveImageData) {
        const layout = GridManager.getLayout()
        layoutData.metadata.margin = layout.margin
        layoutData.metadata.blockSize = layout.blockSize
        layoutData.metadata.spacing = getSpacing()
        layoutData.metadata.rows = layout.rows
        layoutData.metadata.cols = layout.cols
    }

    images.forEach((metadata, image) => {
        if (layoutData.sprites[metadata.name]) {
            metadata.name = getGuid()
        }
        layoutData.sprites[metadata.name] = {
            name: metadata.name,
            x: metadata.left + metadata.marginLeft,
            y: metadata.top + metadata.marginTop,
            w: metadata.width,
            h: metadata.height
        }
        if (saveImageData) {
            layoutData.sprites[metadata.name].src = image.src
            layoutData.sprites[metadata.name].index = metadata.index
        }
    })

    const fileName = saveImageData ? "config.json" : "layout.json"

    exportJson(layoutData, fileName)
}

export async function importConfiguration (json, fileName) {
    let config = null
    try {
        config = JSON.parse(json)
    } catch (err) {
        console.error(err)
        return
    }

    const meta = config.metadata

    setBlockSize(meta.blockSize)
    setSpacing(meta.spacing)

    ItemManager.reset()
    GridManager.removeAllItems()

    GridManager.updateBlockSize()
    GridManager.setBaseMargin(meta.margin)

    const images = Object.values(config.sprites)
    images.sort((a, b) => {
        return a.index - b.index
    })

    for (let i = 0; i < images.length; i++) {
        const item = new Item(images[i].src, images[i].name)
        await ItemManager.importItem(item, images[i].index)
    }

    GridManager.setDimensions(meta.rows, meta.cols)
    GridManager.updateContainerSize()
    GridManager.updateLayout()
    GridManager.updateContainerSize()
    GridManager.fixLayout()
}
