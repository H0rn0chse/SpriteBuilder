import { Grid } from "./Grid2.js";

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
}

export function getBlockSize () {
    return document.querySelector("#blockSize").value;
}