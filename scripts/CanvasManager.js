import { Deferred } from "./Deferred.js";

class _CanvasManager {
    constructor () {
        this.canvas = null
        this.ctx = null
    }

    init (element) {
        this.canvas = element
        this.ctx = this.canvas.getContext('2d');
        this.setSize(200, 100)
    }

    reset () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setSize (width, height) {
        this.canvas.width = width
        this.canvas.height = height
    }

    drawImages (imageMap) {
        imageMap.forEach((metadata, img) => {
            this.ctx.drawImage(img, metadata.left + metadata.marginLeft, metadata.top + metadata.marginTop);
        });
    }

    async getData () {
        const blob = new Deferred()
        this.canvas.toBlob(blob.resolve, "image/png", 1);
        return blob.promise
    }
}

globalThis.CanvasManager = new _CanvasManager()
export default globalThis.CanvasManager