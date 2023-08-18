import Engine from "./engine";
import "@next2d/player";

class Next2DEngine extends Engine {
    constructor() {

        console.log("koko");

        super();

        const div = document.createElement("div");
        div.id = "canvas";
        div.style.width  = `${this.width}px`;
        div.style.height = `${this.height}px`;
        this.content.appendChild(div);

        this.root = null;
    }

    init() {
        if (!this.root) {
            next2d
                .createRootMovieClip(this.width, this.height, 60, {
                    "tagId": "canvas"
                })
                .then((root) =>
                {
                    this.root = root;
                    this.render();
                });
        }
    }

    animate() {
        this.meter.tick();

        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];

            if (rect.el.x + rect.size < 0) {
                rect.el.x = this.width + rect.size / 2;
            }

            rect.el.x -= rect.speed;
        }

        this.request = requestAnimationFrame(() => this.animate());
    }

    render() {

        cancelAnimationFrame(this.request);

        while (this.root.numChildren) {
            this.root.removeChild(this.root.getChildAt(0));
        }

        const { Shape } = next2d.display;

        const rects = [];
        for (let i = 0; i < this.count.value; i++) {

            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = 10 + Math.random() * 40;
            const speed = 1 + Math.random();

            var rect = new Shape();

            rect
                .graphics
                .beginFill("#fff")
                .lineStyle(1, "#000")
                .drawRect(0, 0, size, size);

            rect.x = x;
            rect.y = y;

            this.root.addChild(rect);

            rects.push({ size, speed, el: rect });
        }
        this.rects = rects;

        this.request = requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new Next2DEngine();
    engine.init();
});