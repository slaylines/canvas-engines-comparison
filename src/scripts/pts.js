import Engine from "./engine";
import {
  CanvasSpace,
  Rectangle,
} from "pts";

class PtsEngine extends Engine {
  constructor() {
    super();

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.content.appendChild(this.canvas);
  }

  init() {
    this.space = new CanvasSpace(this.canvas);
    this.space.setup({ bgcolor: "#fff" });
    this.form = this.space.getForm();
    this.space.add(this.animate.bind(this));
  }

  animate(time, ftime) {
    // fps meter
    this.meter.tick();

    this.form.fill("#fff").stroke("#000");

    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i];
      
      if (rect.el[0].x + rect.size < 0) {
        rect.el.moveTo( this.width + rect.size / 2, rect.el[0].y );
      } else {
        rect.el.subtract( rect.speed, 0 );
      }

      this.form.rect(rect.el);
    }
  }

  render() {
    const rects = [];
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      var rect = Rectangle.fromCenter([x, y], [size, size]);
      rects.push({ size, speed, el: rect });
    }
    this.rects = rects;

    this.space.play();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new PtsEngine();
  engine.init();
  engine.render();
});
