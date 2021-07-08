import Engine from './engine';
import Paper from 'paper/dist/paper-core';

class PaperEngine extends Engine {
  constructor() {
    super();

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.content.appendChild(this.canvas);
  }

  init() {
    Paper.setup(this.canvas);
  }

  render() {
    Paper.project.activeLayer.removeChildren();
    Paper.view.draw();

    const rects = {};
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const rect = new Paper.Rectangle(x - size / 2, y - size / 2, size, size);

      const path = new Paper.Path.Rectangle(rect);
      path.fillColor = 'white';
      path.strokeColor = 'black';

      rects[i] = { x, y, size, speed, el: path };
    }

    Paper.view.draw();

    // Paper.view.onFrame = () => {
    let onFrame = () => {
      requestAnimationFrame(onFrame);
      const rectsToRemove = [];

      for (let i = 0; i < this.count.value; i++) {
        const r = rects[i];
        r.x -= r.speed;
        r.el.position.x = r.x;

        if (r.x + r.size / 2 < 0) rectsToRemove.push(i);
      }

      rectsToRemove.forEach(i => {
        rects[i].x = this.width + rects[i].size / 2;
      });

      this.meter.tick();
    };
    requestAnimationFrame(onFrame);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new PaperEngine();

  engine.init();
  engine.render();
});
