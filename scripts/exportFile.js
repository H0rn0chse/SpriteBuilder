export function exportImage (content, fileName) {
    const a = document.createElement("a")
    a.href = content
    a.download = fileName
    a.click()
}
