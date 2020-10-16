import Engine from './engine';
import * as PIXI from 'pixi.js';

class PixiEngine extends Engine {
  constructor() {
    super();

    // support Hi-DPI
    this.canvasWidth = this.width * window.devicePixelRatio;
    this.canvasHeight = this.height * window.devicePixelRatio;
    this.rects = [];
    this.app = new PIXI.Application({
      width: this.canvasWidth,
      height: this.canvasHeight,
      backgroundColor: 0xFFFFFF,
      antialias: true,
    });
    this.content.appendChild(this.app.view);
    this.app.view.style.width = this.width + "px";
    this.app.view.style.height = this.height + "px";
  }

  onTick() {
    const rectsToRemove = [];

    for (let i = 0; i < this.count.value; i++) {
      const rect = this.rects[i];
      rect.x -= rect.speed;
      rect.el.position.x = rect.x;
      if (rect.x + rect.size / 2 < 0) rectsToRemove.push(i);
    }

    rectsToRemove.forEach(i => {
      this.rects[i].x = this.canvasWidth + this.rects[i].size / 2;
    });

    this.meter.tick();
  }

  render() {
    this.app.ticker.remove(this.onTick, this);
    this.app.stage.removeChildren();
    this.rects = {};
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.canvasWidth;
      const y = Math.random() * this.canvasHeight;
      const size = (10 + Math.random() * 40) * window.devicePixelRatio;
      const speed = 1 + Math.random();

      const rect = new PIXI.Graphics();
      rect.lineStyle(window.devicePixelRatio, 0x000000, 1);
      rect.beginFill(0xffffff);
      rect.drawRect(-size / 2, -size / 2, size, size);
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
