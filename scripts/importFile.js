import { addItem } from "./main.js";
import { importConfig } from "./ui.js";

let fileHandler = null

export function initImport () {
	fileHandler = addLoadFile()
}

export function importJson () {
	fileHandler.value = ""
	fileHandler.setAttribute("accept", ".json")
	fileHandler.removeAttribute("multiple")
	fileHandler.onchange = importJsonHandler
	fileHandler.click()
}

export function importZip () {
	fileHandler.value = ""
	fileHandler.setAttribute("accept", ".zip")
	fileHandler.removeAttribute("multiple")
	fileHandler.onchange = importZipHandler
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

	document.querySelector("#hidden").appendChild(fileHandler)

	return fileHandler
}

export function importJsonHandler (event) {
	const file = event.target.files[0]

	if (file) {
		const fileName = file.name
		const reader = new FileReader()
		reader.onload = evt => {
			const json = evt.target.result;
			importConfig(json, fileName)
		}
		reader.readAsText(file)
	}
}

export function importZipHandler (event) {
	const file = event.target.files[0]

	if (file) {
		const fileName = file.name
		const reader = new FileReader()
		reader.onload = async evt => {
			const data = evt.target.result;
			const zip = new JSZip();
			await zip.loadAsync(data)
			const json = await zip.file("config.json").async("string")
			importConfig(json, fileName)
		}
		reader.readAsArrayBuffer(file)
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