let fileHandler = null

export function initImport () {
	fileHandler = addLoadFile()
}

export function importFile () {
	fileHandler.value = ""
	fileHandler.click()
}

function addLoadFile () {
	const fileHandler = document.createElement("input")
	fileHandler.setAttribute("id", "FileHandler")
	fileHandler.setAttribute("type", "file")
	fileHandler.setAttribute("accept", ".png")
	fileHandler.setAttribute("multiple", true)
	fileHandler.onchange = importFileHandler

	document.getElementById("hidden").appendChild(fileHandler)

	return fileHandler
}


export function importFileHandler (event) {

	const files = event.target.files || {}
	console.error("DoStuff", files)
	return

	Object.values(files).forEach(file => {
		if (file) {
			const fileName = file.name
			const reader = new FileReader()
			reader.onload = function () {
				try {
					const text = reader.result
				}
				catch (error){
					console.log(error)
					// err handling
				}
			}
			reader.readAsText(file, "utf-8")
		}
	})
}