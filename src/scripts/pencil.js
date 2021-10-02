import Engine from "./engine";
import Pencil from "pencil.js";

class PencilEngine extends Engine {
  constructor() {
    super();

    this.canvas = Pencil.OffScreenCanvas.getDrawingContext(
      this.width,
      this.height
    ).canvas;
    this.content.appendChild(this.canvas);

    this.scene = new Pencil.Scene(this.canvas);
  }

  init() {
    this.scene.on("draw", this.onTick.bind(this), true).startLoop();
  }

  onTick() {
    const rectsToRemove = [];

    this.scene.children.forEach((r) => {
      r.position.x -= r.options.speed;

      if (r.position.x + r.size < 0) r.position.x = this.scene.width + r.size;
    });

    this.meter.tick();
  }

  render() {
    this.scene.empty();

    const rectOptions = {
      fill: "white",
      stroke: "black",
      strokeWidth: 1,
    };
    for (let i = 0; i < this.count.value; i++) {
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      this.scene.add(
        new Pencil.Square(this.scene.getRandomPosition(), size, {
          ...rectOptions,
          speed,
        })
      );
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new PencilEngine();
  engine.init();
  engine.render();
});
