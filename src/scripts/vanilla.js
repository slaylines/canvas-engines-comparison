import Engine from "./engine";

class VanillaEngine extends Engine {
  constructor() {
    super();

    const {width, height} = this;

    const canvas = document.createElement("canvas");
    canvas.className = "canvas";
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(255 255 255 / 1)';
    ctx.strokeStyle = 'rgb(0 0 0 / 1)';
    this.ctx = ctx;

    this.content.appendChild(canvas);
  }

  animate() {
    const {rects, width, height, ctx} = this;

    ctx.clearRect(0, 0, width, height);

    let rect, x, y, size, speed, rx;

    for (let i = 0, iz = rects.length; i < iz; i++) {
      
      rect = rects[i];
      [x, y, size, speed] = rect;

      rx = ~~(x);

      ctx.fillRect(rx, y, size, size);
      ctx.strokeRect(rx, y, size, size);

      x += speed;
      if (x < -size) {
        x += width + size;
      }
      rect[0] = x;
    }
    this.meter.tick();

    this.request = requestAnimationFrame(() => this.animate());
  }

  render() {
    this.cancelAnimationFrame(this.request);

    const dpr = window.devicePixelRatio;
    const rnd = Math.random;
    const {count, width, height} = this;

    // rectangle creation
    const rects = [];
    for (let i = 0, iz = count.value; i < iz; i++) {
      const size = ~~(10 + rnd() * 40);
      const x = rnd() * width;
      const y = ~~(rnd() * height);
      const speed = -1 - rnd();

      rects.push([x, y, size, speed]);
    }
    this.rects = Object.freeze(rects);

    this.request = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new VanillaEngine();
  engine.render();
});
