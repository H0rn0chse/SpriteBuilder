import GridManager from "./GridManager.js";
import ItemManager from "./ItemManager.js";

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
    ItemManager.save()
}

export function getBlockSize () {
    return document.querySelector("#blockSize").value;
}