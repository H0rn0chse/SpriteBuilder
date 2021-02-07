import { Grid } from "./Grid.js";
import { ItemManager } from "./ItemManager.js";

export function initUi () {
    document.querySelector("#addRow").addEventListener("click", evt => {
        Grid.addRow()
    })

    document.querySelector("#addColumn").addEventListener("click", evt => {
        Grid.addColumn()
    })

    document.querySelector("#reset").addEventListener("click", evt => {
        Grid.reset()
    })

    document.querySelector("#save").addEventListener("click", evt => {
        ItemManager.save()
    })
}

export function getBlockSize () {
    return document.querySelector("#blockSize").value;
}