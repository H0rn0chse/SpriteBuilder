import GridManager from "./GridManager.js";
import ItemManager from "./ItemManager.js";
import CanvasManager from "./CanvasManager.js";
import { exportBlob } from "./exportFile.js";
import ZoomManager from "./ZoomManager.js";
import { importZip } from "./importFile.js";
import { Item } from "./Item.js";

let gridBlockSizeInput = null
let exportMarginInput = null

export function initUi () {
    /*=======================================================================================
    ||                                 Grid UI                                        ||
    =======================================================================================*/

    gridBlockSizeInput = document.querySelector("#gridBlockSize")

    document.querySelector("#gridReset").addEventListener("click", evt => {
        globalThis.itemCount = 0
        GridManager.reset()
        ZoomManager.reset()
    })

    document.querySelector("#gridAddRow").addEventListener("click", async evt => {
        await GridManager.extendRows(1)
        GridManager.updateContainerSize()
        GridManager.updateLayout()
    })

    document.querySelector("#gridAddColumn").addEventListener("click", async evt => {
        await GridManager.extendColumns(1)
        GridManager.updateContainerSize()
        GridManager.updateLayout()
    })

    document.querySelector("#gridFillGaps").addEventListener("click", GridManager.fixLayout.bind(GridManager))

    document.querySelector("#gridCropEdges").addEventListener("click", async evt => {
        await GridManager.cropEdges()
        GridManager.updateContainerSize()
        GridManager.updateLayout()
    })

    /*=======================================================================================
    ||                                 Export UI                                        ||
    =======================================================================================*/

    exportMarginInput = document.querySelector("#exportMargin")
    exportMarginInput.addEventListener("change", evt => {
        GridManager.updateExportSizeLabels()
    })

    document.querySelector("#exportSpritesheet").addEventListener("click", async evt => {
        const file = await getSpritesheetData()
        exportBlob(file.content, file.name)
    })

    document.querySelector("#exportZip").addEventListener("click", saveZip)

    document.querySelector("#importZip").addEventListener("click", async evt => {
        const zip = await importZip()
        const config = await zip.file("config.json").async("string")
        const layout = await zip.file("layout.json").async("string")
        debugger
        importConfig(config)
    })
}

export function getSpacing () {
    return exportMarginInput.value;
}

function setSpacing (value) {
    return exportMarginInput.value = value;
}

async function getSpritesheetData () {
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
    const data = await CanvasManager.getData()
    return {
        name: "spritesheet.png",
        content: data
    }
}

function getLayoutData (saveImageData = false) {
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
        layoutData.sprites[metadata.name] = {
            name: metadata.name,
            x: metadata.left + metadata.marginLeft,
            y: metadata.top + metadata.marginTop,
            w: metadata.width,
            h: metadata.height,
            metadata: metadata.metadata
        }
        if (saveImageData) {
            layoutData.sprites[metadata.name].src = image.src
            layoutData.sprites[metadata.name].index = metadata.index
            layoutData.sprites[metadata.name].originalName = metadata.originalName
        }
    })

    return {
        name: saveImageData ? "config.json" : "layout.json",
        content: JSON.stringify(layoutData, null, 2)
    }
}

async function saveZip () {
    const zip = new JSZip();

    const spritesheet = await getSpritesheetData()
    zip.file(spritesheet.name, spritesheet.content)

    const layoutData = getLayoutData()
    zip.file(layoutData.name, layoutData.content)

    const configData = getLayoutData(true)
    zip.file(configData.name, configData.content)

    const blob = await zip.generateAsync({
        type:"blob",
        compression: "DEFLATE"
    })
    exportBlob(blob, "SpriteBuilder.zip")
}

export async function importConfig (json) {
    let config = null
    try {
        config = JSON.parse(json)
    } catch (err) {
        console.error(err)
        return
    }

    const meta = config.metadata

    gridBlockSizeInput.value = meta.blockSize
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
        const item = new Item(images[i].src, images[i].name, images[i].originalName)
        await ItemManager.importItem(item, images[i].index)
    }

    GridManager.setDimensions(meta.rows, meta.cols)
    GridManager.updateContainerSize()
    GridManager.updateLayout()
    GridManager.updateContainerSize()
    await GridManager.fixLayout()
    ZoomManager.reset()
}
