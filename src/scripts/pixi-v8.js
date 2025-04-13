import Engine from "./engine";
import { Application, Graphics } from "pixi-v8";

class PixiNowEngine extends Engine {
  constructor() {
    super();
    this.rects = [];
    this.tickerCallback = null;
  }

  async init() {
    // Create a new application
    this.app = new Application();

    // Initialize the application with proper options
    await this.app.init({
      width: this.width,
      height: this.height,
      backgroundColor: 0xffffff,
      antialias: true,
      resolution: window.devicePixelRatio,
      preference: 'webgl',
    });

    // Append the application canvas to the content div
    this.content.appendChild(this.app.canvas);
    this.app.canvas.style.width = this.width + "px";
    this.app.canvas.style.height = this.height + "px";

    // Initial render
    this.render();
  }

  onTick(time) {
    const rectsToRemove = [];

    for (let i = 0; i < this.count.value; i++) {
      const rect = this.rects[i];
      rect.x -= rect.speed * time.deltaTime;
      rect.el.position.x = rect.x;
      if (rect.x + rect.size / 2 < 0) rectsToRemove.push(i);
    }

    rectsToRemove.forEach((i) => {
      this.rects[i].x = this.width + this.rects[i].size / 2;
    });

    this.meter.tick();
  }

  render() {
    if (this.tickerCallback) {
      this.app.ticker.remove(this.tickerCallback);
    }

    // Clear the stage
    this.app.stage.removeChildren();
    this.rects = [];

    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      // Create rectangle using updated Graphics API
      const graphics = new Graphics()
      graphics
        .rect(x, y, size, size)
        .stroke({ color: '#000000', width: 1 })
        .fill('#fff')

      this.app.stage.addChild(graphics);
      this.rects[i] = { x, y, size, speed, el: graphics };
    }

    // Store the callback reference so we can remove it later
    this.tickerCallback = this.onTick.bind(this);
    this.app.ticker.add(this.tickerCallback);
  }

  destroy() {
    if (this.tickerCallback) {
      this.app.ticker.remove(this.tickerCallback);
    }
    this.app.destroy(true);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const engine = new PixiNowEngine();
  await engine.init();
});