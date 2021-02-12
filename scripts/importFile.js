import { addItem } from "./main.js";
import { importConfiguration } from "./ui.js";

let fileHandler = null

export function initImport () {
	fileHandler = addLoadFile()
}

export function importFile () {
	fileHandler.value = ""
	fileHandler.setAttribute("accept", ".json")
	fileHandler.removeAttribute("multiple")
	fileHandler.onchange = importFileHandler
	fileHandler.click()
}

export function importImage () {
	fileHandler.value = ""
	fileHandler.setAttribute("accept", ".png")
	fileHandler.setAttribute("multiple", true)
	fileHandler.onchange = importImageHandler
	fileHandler.click()
}

function addLoadFile () {
	const fileHandler = document.createElement("input")
	fileHandler.setAttribute("id", "FileHandler")
	fileHandler.setAttribute("type", "file")

	document.getElementById("hidden").appendChild(fileHandler)

	return fileHandler
}

export function importFileHandler (event) {
	const file = event.target.files[0]

	if (file) {
		const fileName = file.name
		const reader = new FileReader()
		reader.onload = evt => {
			const json = evt.target.result;
			importConfiguration(json, fileName)
		}
		reader.readAsText(file)
	}
}

export function importImageHandler (event) {
	const files = event.target.files || {}

	Object.values(files).forEach(file => {
		if (file) {
			const fileName = file.name
			const reader = new FileReader()
			reader.onload = evt => {
				const src = evt.target.result;
				addItem(src, fileName)
			}
			reader.readAsDataURL(file)
		}
	})
}