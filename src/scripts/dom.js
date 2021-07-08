import Engine from './engine';
import { fabric } from 'fabric';

window.cancelRequestAnimFrame = (() => {
  return window.cancelAnimationFrame ||
         window.webkitCancelRequestAnimationFrame ||
         window.mozCancelRequestAnimationFrame ||
         window.oCancelRequestAnimationFrame ||
         window.msCancelRequestAnimationFrame ||
         clearTimeout;
})();

class FabricEngine extends Engine {
  constructor() {
    super();
    this.canvas = document.createElement('div');
    this.canvas.className = 'canvas'
    this.canvas.style.width = this.width;
    this.canvas.style.height = this.height;
    this.content.appendChild(this.canvas);
  }

  init() {
  }

  requestAnimFrame() {
    const rects = this.rects;
    for (let i = 0; i < this.count.value; i++) {
      const r = rects[i];
      r.x -= r.speed;
      r.el.style.left = r.x;
      if (r.x + r.size < 0) {
        r.x = this.width + r.size;
      }
    }
    this.meter.tick();

    this.request = requestAnimationFrame(() => this.requestAnimFrame());
  }

  render() {
    // clear the canvas
    this.canvas.innerHTML = "";
    window.cancelRequestAnimFrame(this.request);

    // rectangle creation
    const rects = new Array(this.count);
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      let rect = document.createElement("div");
      rect.className = "rectangle";
      rect.style.position = "absolute";
      rect.style.border = "1px solid black";
      rect.style.left = x + "px";
      rect.style.top = y + "px";
      rect.style.width = size + "px";
      rect.style.height = size + "px";
      rect.style.backgroundColor = "white";
      this.canvas.appendChild(rect);
      rects[i] = { x, y, size: size / 2, speed, el: rect };
    }
    this.rects = rects;

    this.request = requestAnimationFrame(() => this.requestAnimFrame());
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new FabricEngine();
  engine.init();
  engine.render();
});
