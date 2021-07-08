import Engine from './engine';
import { Renderer, Figure2D, Mesh2D } from '@mesh.js/core';


class MeshEngine extends Engine {
	constructor() {
		super();
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.content.appendChild(this.canvas);
	}

	async init() {
        this.renderer = new Renderer(this.canvas);
	}

	animate() {
		const rects = this.rects;
		for (let i = 0; i < this.count.value; i++) {
			const r = rects[i];
			if (r.x + r.mesh.transformMatrix[4] + r.size < 0) {
                r.mesh.translate(this.width + r.size, 0);
			} else {
                r.mesh.translate(-r.speed, 0);
            }
		}
        const meshes = rects.map(rect => rect.mesh);
		this.renderer.drawMeshes(meshes);
		this.meter.tick();

		this.request = window.requestAnimationFrame(() => this.animate());
	}

	render() {
		// clear the canvas
		this.renderer.clear();
		this.cancelAnimationFrame(this.request);

		// rectangle creation
		const rects = new Array(this.count);
		for (let i = 0; i < this.count.value; i++) {
			const x = Math.random() * this.width;
			const y = Math.random() * this.height;
			const size = 10 + Math.random() * 40;
			const speed = 1 + Math.random();
            const figure = new Figure2D();
            figure.rect(x, y, size, size);
            const mesh = new Mesh2D(figure, this.canvas);
            mesh.setFill({
            	color: [1, 1, 1, 1],
            });
            mesh.setStroke({
            	color: [0, 0, 0, 1],
            });
			rects[i] = { x, y, size, speed, mesh };
		}
		this.rects = rects;

		this.request = window.requestAnimationFrame(() => this.animate());
	};
}

document.addEventListener('DOMContentLoaded', async () => {
	const engine = new MeshEngine();
	await engine.init();
	engine.render();
});
