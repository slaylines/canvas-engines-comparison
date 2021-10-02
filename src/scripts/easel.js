import Engine from "./engine";
import { Stage, Shape, Ticker } from "@createjs/easeljs";

class EaselJSEngine extends Engine {
  constructor() {
    super();

    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.content.appendChild(this.canvas);
  }

  init() {
    this.stage = new Stage("canvas");
    Ticker.on("tick", this.animate.bind(this));
    Ticker.framerate = 60;
    // Ticker.timingMode = Ticker.RAF;
  }

  animate() {
    // fps meter
    this.meter.tick();

    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i];

      if (rect.el.x + rect.size < 0) {
        rect.el.x = this.width + rect.size / 2;
      }

      rect.el.x -= rect.speed;
    }
    this.stage.update();
  }

  render() {
    this.stage.removeAllChildren();
    const rects = [];
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      var rect = new Shape();
      rect.graphics
        .beginFill("#fff")
        .beginStroke("#000")
        .drawRect(0, 0, size, size);
      rect.x = x;
      rect.y = y;
      this.stage.addChild(rect);

      rects.push({ size, speed, el: rect });
    }
    this.rects = rects;

    this.stage.update();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new EaselJSEngine();
  engine.init();
  engine.render();
});
