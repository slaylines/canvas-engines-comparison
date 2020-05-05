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
    this.app.stage.interactive = true;
    this.graphics = new PIXI.Graphics();
    this.app.stage.addChild(this.graphics);

    this.content.appendChild(this.app.view);
  }

  renderRect(x, y, size) {
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.beginFill(0xFFFFFF);
    this.graphics.drawRect(x - size / 2, y - size / 2, size, size);
    this.graphics.endFill();
  }

  onTick() {
    this.graphics.clear();

    const rectsToRemove = [];

    for (let i = 0; i < this.count.value; i++) {
      const rect = this.rects[i];
      rect.x -= rect.speed;
      this.renderRect(rect.x, rect.y, rect.size);
      if (rect.x + rect.size / 2 < 0) rectsToRemove.push(i);
    }

    rectsToRemove.forEach(i => {
      this.rects[i].x = this.width + this.rects[i].size / 2;
    });

    this.meter.tick();
  }

  render() {
    this.app.ticker.remove(this.onTick, this);
    this.graphics.clear();

    this.rects = {};
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      this.renderRect(x, y, size);
      this.rects[i] = { x, y, size, speed };
    }

    this.app.ticker.add(this.onTick, this);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new PixiEngine();
  engine.render();
});
