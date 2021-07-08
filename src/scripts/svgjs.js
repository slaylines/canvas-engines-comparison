import Engine from './engine';
import { SVG } from '@svgdotjs/svg.js';



class SVGjsEngine extends Engine {
  constructor() {
    super();

    this.draw = SVG().addTo(this.content)
    this.draw.attr('height', this.height)
    this.draw.attr('width', this.width)
  }

  init() {

  }

  animate() {
    // fps meter
    this.meter.tick();

    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i];

      if (rect.x + rect.size < 0) {
        rect.x = this.width + rect.size / 2;
      }
      rect.x -= rect.speed;

      rect.el.move(rect.x, rect.y)
    }

    this.request = requestAnimationFrame(this.animate.bind(this));
  }

  render() {
    this.cancelAnimationFrame(this.request)
    this.draw.clear()
    const rects = []

    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      let rect = this.draw.rect(size, size).attr({ fill: '#fff', stroke: '#000' }).move(x, y)
      rects.push({ x, y, size, speed, el: rect });
    }
    this.rects = rects;

    this.request = requestAnimationFrame(this.animate.bind(this));
  }

}


document.addEventListener('DOMContentLoaded', () => {
  const engine = new SVGjsEngine();
  engine.init();
  engine.render();
});
