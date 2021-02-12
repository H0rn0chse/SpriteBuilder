export function exportImage (content, fileName) {
    const a = document.createElement("a")
    a.setAttribute("href", content)
    a.setAttribute("download", fileName)
    a.click()
}

export function exportJson (object, fileName) {
    const content = JSON.stringify(object, null, 2) // spacing level = 2
    const a = document.createElement("a")
    a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    a.setAttribute("download", fileName);
    a.click()
}
