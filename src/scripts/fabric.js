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
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.content.appendChild(this.canvas);
  }

  init() {
    fabric.Object.prototype.objectCaching = false;
    fabric.Object.prototype.originX = 'center';
    fabric.Object.prototype.originY = 'center';
    this.fabricCanvas = new fabric.StaticCanvas(this.canvas, { enableRetinaScaling: false, renderOnAddRemove: false })
    window.canvas = this.fabricCanvas;
  }

  requestAnimFrame() {
    const rects = this.rects;
    for (let i = 0; i < this.count.value; i++) {
      const r = rects[i];
      r.x -= r.speed;
      r.el.left = r.x;
      if (r.x + r.size < 0) {
        r.x = this.width + r.size;
      }
    }
    this.fabricCanvas.renderAll();
    this.meter.tick();

    this.request = fabric.util.requestAnimFrame(() => {
      this.requestAnimFrame();
    });
  }

  render() {
    // clear the canvas
    this.fabricCanvas.clear();
    window.cancelRequestAnimFrame(this.request);

    // rectangle creation
    const rects = new Array(this.count);
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const fRect = new fabric.Rect({
        width: size,
        height: size,
        fill: 'white',
        stroke: 'black',
        top: y,
        left: x,
      });
      rects[i] = { x, y, size: size / 2, speed, el: fRect };
    }
    this.rects = rects;
    this.fabricCanvas.add(...rects.map(rect => rect.el));

    this.request = fabric.util.requestAnimFrame(() => {
      this.requestAnimFrame();
    });
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new FabricEngine();
  engine.init();
  engine.render();
});
