import { Grid } from "./Grid.js";

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
        Grid.save()
    })
}

export function getBlockSize () {
    return document.querySelector("#blockSize").value;
}