import Engine from './engine';
import * as zrender from 'zrender';
import 'zrender/lib/canvas/canvas';

class ZREngine extends Engine {
  constructor() {
    super();

    this.rects = [];
    this.app = zrender.init(document.querySelector('#main'), {
      renderer: 'canvas',
      devicePixelRatio: 1
    });
    this.app.resize({ width: this.width, height: this.height });
    this.root = new zrender.Group();
    this.app.add(this.root);
  }

  onTick() {
    const rectsToRemove = [];

    for (let i = 0; i < this.count.value; i++) {
      const rect = this.rects[i];
      rect.x -= rect.speed;
      rect.el.attr('x', rect.x);
      if (rect.x + rect.size / 2 < 0) rectsToRemove.push(i);
    }

    rectsToRemove.forEach(i => {
      this.rects[i].x = this.width + this.rects[i].size / 2;
    });

    this.meter.tick();
  }

  render() {
    this.app.animation.off('frame', this.onTick, this);
    this.root.removeAll();
    this.rects = [];
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const rect = new zrender.Rect({
        shape: {
          width: size,
          height: size,
        },
        style: {
          fill: 'white',
          stroke: 'black',
        },
        x,
        y
      });
      this.root.add(rect);
      this.rects[i] = { x, y, size, speed, el: rect };
    }

    this.app.animation.on('frame', this.onTick, this);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new ZREngine();
  engine.render();
});
