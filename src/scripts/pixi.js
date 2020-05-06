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
      antialias: true,
    });
    this.content.appendChild(this.app.view);
  }

  onTick() {
    const rectsToRemove = [];

    for (let i = 0; i < this.count.value; i++) {
      const rect = this.rects[i];
      rect.x -= rect.speed;
      rect.el.position.x = rect.x - rect.size / 2;
      if (rect.x + rect.size / 2 < 0) rectsToRemove.push(i);
    }

    rectsToRemove.forEach(i => {
      this.rects[i].x = this.width + this.rects[i].size;
    });

    this.meter.tick();
  }

  render() {
    this.app.ticker.remove(this.onTick, this);
    this.app.stage.removeChildren();
    this.rects = {};
    for (let i = 0; i < this.count.value; i++) {
      const size = 10 + Math.random() * 40;
      const x = Math.random() * this.width - size / 2;
      const y = Math.random() * this.height - size / 2;
      const speed = 1 + Math.random();

      const rect = new PIXI.Graphics();
      rect.lineStyle(1, 0x000000, 1);
      rect.beginFill(0xffffff);
      rect.drawRect(0, 0, size, size);
      rect.endFill();
      rect.position.set(x, y);
      this.app.stage.addChild(rect);
      this.rects[i] = { x, y, size, speed, el: rect };
    }

    this.app.ticker.add(this.onTick, this);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new PixiEngine();
  engine.render();
});
