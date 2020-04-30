import Engine from './engine';
import Paper from 'paper/dist/paper-core';

class PaperEngine extends Engine {
  constructor() {
    super();
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  init() {
    Paper.setup(this.canvas);
  }

  render() {
    Paper.project.activeLayer.removeChildren();
    Paper.view.draw();

    const rects = [...Array(this.count.value).keys()].map(i => {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const rect = new Paper.Rectangle(
        new Paper.Point(x - size / 2, y - size / 2),
        new Paper.Size(size, size)
      );

      const path = new Paper.Path.Rectangle(rect);
      path.fillColor = 'white';
      path.strokeColor = 'black';

      return { id: i, x, y, size, speed, el: path };
    });

    Paper.view.draw();

    Paper.view.onFrame = () => {
      const rectsToRemove = [];

      rects.forEach(r => {
        r.x -= r.speed;
        r.el.position.x = r.x;

        if (r.x + r.size / 2 < 0) rectsToRemove.push(r);
      });

      rectsToRemove.forEach(r => {
        const index = rects.indexOf(r);

        rects.splice(index, 1);
        rects.push({
          id: r.id,
          x: this.width + r.size / 2,
          y: r.y,
          size: r.size,
          speed: r.speed,
          el: r.el,
        });
      });

      this.meter.tick();
    };
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new PaperEngine();

  engine.init();
  engine.render();
});
