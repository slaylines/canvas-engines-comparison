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

    const rects = [...Array(this.count.value).keys()].reduce((res, i) => {
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

      res[i] = { x, y, size, speed, el: path };
      return res;
    }, {});

    Paper.view.draw();

    Paper.view.onFrame = () => {
      const rectsToRemove = [];

      [...Array(this.count.value).keys()].forEach(i => {
        const r = rects[i];
        r.x -= r.speed;
        r.el.position.x = r.x;

        if (r.x + r.size / 2 < 0) rectsToRemove.push(i);
      });

      rectsToRemove.forEach(i => {
        rects[i].x = this.width + rects[i].size / 2;
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
