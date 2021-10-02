import Engine from "./engine";
import scrawl from "scrawl-canvas";

class SCEngine extends Engine {
  constructor() {
    super();
  }

  render() {
    if (scrawl.library.animation["demo"])
      scrawl.library.animation["demo"].kill();
    if (scrawl.library.canvas["my-canvas"])
      scrawl.library.canvas["my-canvas"].kill();
    if (scrawl.library.cell["cache"]) scrawl.library.cell["cache"].kill();

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.id = "my-canvas";
    this.content.appendChild(this.canvas);
    const canvas = scrawl.getCanvas("#my-canvas");

    let { meter, count, width, height } = this;

    const boxes = [];

    canvas.buildCell({
      name: "cache",
      width: 50 * 40,
      height: 50,
      cleared: false,
      compiled: false,
      shown: false,
    });

    const source = scrawl.library.cell.cache.element;
    const sourceEngine = scrawl.library.cell.cache.engine;

    sourceEngine.fillStyle = "white";
    sourceEngine.strokeStyle = "black";
    sourceEngine.lineWidth = 1;

    for (let i = 0; i < 40; i++) {
      let size = 10 + i,
        delta = size / 2;

      sourceEngine.setTransform(1, 0, 0, 1, 50 * i + 25, 25);
      sourceEngine.fillRect(-delta, -delta, size, size);
      sourceEngine.strokeRect(-delta, -delta, size, size);
    }

    function buildBoxes(boxes, boxesRequired) {
      let size, x, y, dx;

      boxes.length = 0;

      for (let i = 0; i < boxesRequired; i++) {
        size = 10 + Math.random() * 40;
        x = Math.random() * width;
        y = Math.random() * height;
        dx = -1 - Math.random();

        boxes.push([x, y, dx, Math.floor(size - 10)]);
      }
    }

    const drawBoxes = (function () {
      const engineWidth = width,
        ctx = canvas.base.engine;

      let box, x, y, deltaX, boxpos, boxwidth;

      return function (B) {
        for (let i = 0, iz = B.length; i < iz; i++) {
          box = B[i];
          [x, y, deltaX, boxpos] = box;
          boxwidth = boxpos + 10;

          ctx.drawImage(source, boxpos * 50, 0, 50, 50, x - 25, y - 25, 50, 50);

          x += deltaX;
          if (x < -boxwidth) x += engineWidth + boxwidth * 2;
          box[0] = x;
        }
      };
    })();

    scrawl.makeAnimation({
      name: "demo",

      fn: () => {
        if (boxes.length !== count.value) buildBoxes(boxes, count.value);

        canvas.clear();
        drawBoxes(boxes);
        canvas.show();
        meter.tick();
      },
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new SCEngine();
  engine.render();
});
