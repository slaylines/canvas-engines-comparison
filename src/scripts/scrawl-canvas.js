import Engine from "./engine";
import * as scrawl from "scrawl-canvas";

class SCEngine extends Engine {
  constructor() {
    super();
  }

  render() {

    // Namespacing boilerplate (to prevent memory leaks)
    const namespace = 'vanilla';
    const name = n => `${namespace}-${n}`;

    // Handle pixelRatio edge case where user drags browser between screens of different pixel densities
    let pixRatio = scrawl.getPixelRatio();

    scrawl.setPixelRatioChangeAction(() => {
      pixRatio = scrawl.getPixelRatio();
      buildCanvas();
      buildBoxes(boxes, count.value);
    });

    // Render variables
    let { meter, count, width, height } = this;

    let canvas, ctx;

    const boxes = [];

    // Create the canvas element; import it into the SC library; set up its context engine; create the animation loop
    const buildCanvas = () => {

      if (scrawl.library.canvas[namespace]) scrawl.library.purge(namespace);

      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.id = namespace;
      this.content.appendChild(this.canvas);

      canvas = scrawl.getCanvas(namespace);
      ctx = canvas.base.engine;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1 / pixRatio;

      scrawl.makeAnimation({
        name: name('demo'),
        fn: () => {
          if (boxes.length !== count.value) buildBoxes(boxes, count.value);

          canvas.clear();
          drawBoxes();
          canvas.show();
          meter.tick();
        },
      });
    };

    // Create the array of box data used in the animation
    function buildBoxes(boxes, boxesRequired) {
      let size, x, y, dx;

      boxes.length = 0;

      for (let i = 0; i < boxesRequired; i++) {
        size = Math.floor(10 + Math.random() * 40) / pixRatio;
        x = Math.random() * width;
        y = (Math.random() * height) - (size / 2);
        dx = -1 - Math.random();

        boxes.push([x, y, dx, size]);
      }
    }

    // Draw the boxes onto the canvas; update each box's position
    const drawBoxes = () => {

      let box, x, y, dX, w;

      for (let i = 0, iz = boxes.length; i < iz; i++) {
        box = boxes[i];
        [x, y, dX, w] = box;

        ctx.fillRect(x, y, w, w);
        ctx.strokeRect(x, y, w, w);

        x += dX;
        if (x < -w) x += width + w * 2;
        box[0] = x;
      }
    };

    // Initialize and start the canvas scene
    buildCanvas();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new SCEngine();
  engine.render();
});
