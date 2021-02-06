import { addColumn, addRow, updateSize } from "./grid.js";

export function initUi () {
    document.getElementById("addRow").addEventListener("click", evt => {
        addRow()
    })

    document.getElementById("addColumn").addEventListener("click", evt => {
        addColumn()
    })

    document.getElementById("blockSize").addEventListener("change", evt => {
        updateSize()
    })
}

export function getBlockSize () {
    return document.getElementById("blockSize").value;
}