export function exportFile (content, fileName) {
    const a = document.createElement("a")
    const file = new Blob(content, {encoding: "utf-8", type:"utf-8"})
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
}
