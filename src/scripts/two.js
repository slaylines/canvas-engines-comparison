import Engine from './engine';
import Two from 'two.js';

class TwoEngine extends Engine {
  constructor() {
    super();
    this.two = null;
  }

  render() {
    if (this.two) {
      this.two.unbind('update');
      this.two.clear();
      Two.Utils.release(this.two);
      this.two.renderer.domElement.remove();
    }

    this.two = new Two({
      width: this.width,
      height: this.height,
      type: Two.Types['webgl'],
      autostart: true,
    }).appendTo(this.content);

    const rects = [...Array(this.count.value).keys()].reduce((res, i) => {
      const x = Math.random() * this.two.width;
      const y = Math.random() * this.two.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      res[i] = {
        x, y, size, speed,
        el: this.two.makeRectangle(x, y, size, size),
      };
      return res;
    }, {});

    this.two.bind('update', () => {
      const rectsToRemove = [];

      [...Array(this.count.value).keys()].forEach(i => {
        const r = rects[i];
        r.x -= r.speed;
        r.el.translation.set(r.x, r.y);

        if (r.x + r.size / 2 < 0) rectsToRemove.push(i);
      });

      rectsToRemove.forEach(i => {
        rects[i].x = this.two.width + rects[i].size / 2;
      });

      this.meter.tick();
    });
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new TwoEngine();
  engine.render();
});
