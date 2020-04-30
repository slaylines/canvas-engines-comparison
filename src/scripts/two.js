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
      type: Two.Types[this.rendered.name],
      autostart: true,
    }).appendTo(this.content);

    const rects = [...Array(this.count.value).keys()].map(i => {
      const x = Math.random() * this.two.width;
      const y = Math.random() * this.two.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      return {
        id: i, x, y, size, speed,
        el: this.two.makeRectangle(x, y, size, size),
      };
    });

    this.two.bind('update', () => {
      const rectsToRemove = [];

      rects.forEach(r => {
        r.x -= r.speed;
        r.el.translation.set(r.x, r.y);

        if (r.x + r.size / 2 < 0) rectsToRemove.push(r);
      });

      rectsToRemove.forEach(r => {
        const index = rects.indexOf(r);

        rects.splice(index, 1);
        rects.push({
          id: r.id,
          x: this.two.width + r.size / 2,
          y: r.y,
          size: r.size,
          speed: r.speed,
          el: r.el,
        });
      });

      this.meter.tick();
    });
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new TwoEngine();
  engine.render();
});
