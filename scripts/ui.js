import { addColumn, addRow, resetGrid } from "./grid.js";

export function initUi () {
    document.querySelector("#addRow").addEventListener("click", evt => {
        addRow()
    })

    document.querySelector("#addColumn").addEventListener("click", evt => {
        addColumn()
    })

    document.querySelector("#reset").addEventListener("click", evt => {
        resetGrid()
    })
}

export function getBlockSize () {
    return document.querySelector("#blockSize").value;
}