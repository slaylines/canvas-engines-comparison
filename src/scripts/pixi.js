import Engine from './engine';
import * as PIXI from 'pixi.js';

class PixiEngine extends Engine {
  constructor() {
    super();

    this.rects = [];
    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      backgroundColor: 0xFFFFFF,
    });
    this.app.stage.interactive = true;

    this.content.appendChild(this.app.view);
  }

  renderRect(r) {
    r.el.lineStyle(1, 0x000000, 1);
    r.el.beginFill(0xFFFFFF);
    r.el.drawRect(r.x - r.size / 2, r.y - r.size / 2, r.size, r.size);
    r.el.endFill();
  }

  onTick() {
    const rectsToRemove = [];

    this.rects.forEach(r => {
      r.x -= r.speed;

      r.el.clear();
      this.renderRect(r);

      if (r.x + r.size / 2 < 0) rectsToRemove.push(r);
    });

    rectsToRemove.forEach(r => {
      const index = this.rects.indexOf(r);

      this.rects.splice(index, 1);
      this.rects.push({
        id: r.id,
        x: this.width + r.size / 2,
        y: r.y,
        size: r.size,
        speed: r.speed,
        el: r.el,
      });
    });

    this.meter.tick();
  }

  render() {
    this.app.ticker.remove(this.onTick, this);
    this.rects.forEach(r => {
      r.el.clear();
      this.app.stage.removeChild(r.el);
    });

    this.rects = [...Array(this.count.value).keys()].map(i => {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const rect = new PIXI.Graphics();
      this.app.stage.addChild(rect);
      this.renderRect({ x, y, size, el: rect });

      return { id: i, x, y, size, speed, el: rect };
    });

    this.app.ticker.add(this.onTick, this);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new PixiEngine();
  engine.render();
});
