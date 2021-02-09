import { GridManager } from "./GridManager.js";
import { ItemManager } from "./ItemManager.js";

export function initUi () {
    document.querySelector("#addRow").addEventListener("click", evt => {
        GridManager.addRow()
    })

    document.querySelector("#addColumn").addEventListener("click", evt => {
        GridManager.addColumn()
    })

    document.querySelector("#reset").addEventListener("click", evt => {
        GridManager.reset()
    })

    document.querySelector("#save").addEventListener("click", evt => {
        ItemManager.save()
    })
}

export function getBlockSize () {
    return document.querySelector("#blockSize").value;
}