import Engine from "./engine";
import * as PIXI from "pixi.js";

class PixiEngine extends Engine {
  constructor() {
    super();

    // support Hi-DPI
    // PIXI.settings.RESOLUTION = window.devicePixelRatio
    this.rects = [];
    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      backgroundColor: 0xffffff,
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

    rectsToRemove.forEach((i) => {
      this.rects[i].x = this.width + this.rects[i].size / 2;
    });

    this.meter.tick();
  }

  render() {
    this.app.ticker.remove(this.onTick, this);
    this.app.stage.removeChildren();
    this.rects = {};
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const rect = new PIXI.Graphics();
      rect.lineStyle(1, 0x000000, 1);
      rect.beginFill(0xffffff);
      rect.drawRect(-size / 2, -size / 2, size, size);
      rect.endFill();
      rect.position.set(x, y);
      this.app.stage.addChild(rect);
      this.rects[i] = { x, y, size, speed, el: rect };
    }

    this.app.ticker.add(this.onTick, this);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new PixiEngine();
  engine.render();
});
