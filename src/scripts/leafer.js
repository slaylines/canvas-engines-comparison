import Engine from "./engine";
import { Leafer, Rect } from "leafer-ui";

class LeaferEngine extends Engine {
	constructor() {
		super();
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.content.appendChild(this.canvas);
	}

	init() {
		this.leaferCanvas = new Leafer({
			view: this.canvas,
			width: this.width,
			height: this.height,
		})
		this.leaferCanvas.pixelRatio = window.devicePixelRatio;
		window.canvas = this.leaferCanvas;
	}

	animate() {

		for (let i = 0; i < this.count.value; i++) {
			const rect = this.rects[i];
			rect.x -= rect.speed;
			rect.el.x = rect.x;
			if (rect.x + rect.width < 0) {
				rect.x = this.width + rect.width;
			}
		}

		this.meter.tick();

		this.request = requestAnimationFrame(() => this.animate());
	}

	render() {
		// clear the canvas
		this.leaferCanvas.removeAll(true);
		this.cancelAnimationFrame(this.request);

		// rectangle creation
		const rects = new Array(this.count);
		for (let i = 0; i < this.count.value; i++) {
			const x = Math.random() * this.width;
			const y = Math.random() * this.height;
			const size = 10 + Math.random() * 40;
			const speed = 1 + Math.random();

			const fRect = new Rect({
				width: size,
				height: size,
				fill: "white",
				stroke: "black",
				y,
				x,
			});
			rects[i] = { x, y, width: size, height: size / 2, speed, el: fRect };
		}
		this.rects = rects;
		this.leaferCanvas.addMany(...rects.map((rect) => rect.el));

		this.request = requestAnimationFrame(() => this.animate());
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const engine = new LeaferEngine();
	engine.init();
	engine.render();
});
