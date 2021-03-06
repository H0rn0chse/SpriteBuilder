import { Deferred } from "./Deferred.js";

let fileHandler = null

export function initImport () {
	fileHandler = addLoadFile()
}

function addLoadFile () {
	const fileHandler = document.createElement("input")
	fileHandler.setAttribute("id", "FileHandler")
	fileHandler.setAttribute("type", "file")

	document.querySelector("#hidden").appendChild(fileHandler)

	return fileHandler
}

export async function importZip () {
	const deferred = new Deferred()
	fileHandler.value = ""
	fileHandler.setAttribute("accept", ".zip")
	fileHandler.removeAttribute("multiple")
	fileHandler.onchange = importArrayBuffer.bind(null, deferred.resolve, deferred.reject)
	fileHandler.click()

	const response = await deferred.promise

	const zip = new JSZip();
	await zip.loadAsync(response[0].content)
	return zip
}

export async function importImage (multiple = false) {
	const deferred = new Deferred()
	fileHandler.value = ""
	fileHandler.setAttribute("accept", ".png")
	if (multiple) {
		fileHandler.setAttribute("multiple", true)
	} else {
		fileHandler.removeAttribute("multiple")
	}
	fileHandler.onchange = importDataURL.bind(null, deferred.resolve, deferred.reject)
	fileHandler.click()

	return deferred.promise
}

export function importArrayBuffer (resolve, reject, event) {
	const files = Object.values(event.target.files || {})
	const promises = files.map(file => {
		const deferred = new Deferred()
		const fileName = file.name
		const reader = new FileReader()
		reader.onload = evt => {
			deferred.resolve({
				content: evt.target.result,
				name: fileName
			})
		}
		reader.readAsArrayBuffer(file)
		return deferred.promise
	})
	resolve(Promise.all(promises))
}

export function importDataURL (resolve, reject, event) {
	const files = Object.values(event.target.files || {})
	const promises = files.map(file => {
		const deferred = new Deferred()
		const fileName = file.name
		const reader = new FileReader()
		reader.onload = evt => {
			deferred.resolve({
				content: evt.target.result,
				name: fileName
			})
		}
		reader.readAsDataURL(file)
		return deferred.promise
	})
	resolve(Promise.all(promises))
}
