import Engine from "./engine";
/* Importing Konva as a minimal bundle does not influence the performance
   but decrease the size of dist/konva.[hash].js from 460K to 260K. */
import Konva from "konva/lib/Core";
import { Rect } from "konva/lib/shapes/Rect";

class KonvaEngine extends Engine {
  constructor() {
    super();

    const container = document.createElement("div");

    container.id = "konva";
    this.content.appendChild(container);

    this.stage = new Konva.Stage({
      container: "konva",
      width: this.width,
      height: this.height,
    });
  }

  render() {
    this.cancelAnimationFrame(this.request)
    this.stage.destroyChildren();
    const layer = new Konva.Layer({
      listening: false,
      draggable: false,
    });
    this.stage.add(layer);

    const template = new Konva.Rect({
      fill: "white",
      stroke: "black",
      strokeWidth: 1,
      listening: false,
      draggable: false,
      shadowForStrokeEnabled: false,
    });

    const rectangles = [];

    for (let i = 0; i < this.count.value; i++) {
      const size = 10 + Math.random() * 40;
      const x = Math.random() * this.width - size / 2;
      const y = Math.random() * this.height - size / 2;
      const rectangle = template.clone({
        width: size,
        height: size,
        x,
        y,
      });
      const speed = 1 + Math.random();
      rectangles.push({ speed, rectangle });
      layer.add(rectangle);
    }

    layer.draw();

    let draw = () => {
      this.request = requestAnimationFrame(draw);
      rectangles.map((element) => {
        let x = element.rectangle.x() - element.speed;
        if (x + element.rectangle.width() < 0) x = this.width;
        element.rectangle.setX(x);
      });
      layer.batchDraw();
      this.meter.tick();
    };

    this.request = requestAnimationFrame(draw);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new KonvaEngine();
  engine.render();
});
