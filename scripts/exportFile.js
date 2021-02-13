export function exportText (content, fileName) {
    const a = document.createElement("a")
    a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
    a.setAttribute("download", fileName);
    a.click()
}

export function exportBlob (content, fileName) {
    const a = document.createElement("a")
    a.setAttribute("href", URL.createObjectURL(content))
    a.setAttribute("download", fileName);
    a.click()
}
