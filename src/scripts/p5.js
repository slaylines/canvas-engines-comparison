import Engine from "./engine";
import P5 from "p5";

class P5Engine extends Engine {
  constructor() {
    super();
  }

  render() {
    if (this.p5) this.p5.remove();

    const sketch = (p) => {
      this.rects = [];
      for (let i = 0; i < this.count.value; i++) {
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        const size = 10 + Math.random() * 40;
        const speed = 1 + Math.random();

        this.rects.push({ x, y, size, speed });
      }

      p.setup = () => {
        p.createCanvas(this.width, this.height);
      };

      p.draw = () => {
        p.background(255);
        const rectsToRemove = [];

        for (let i = 0; i < this.count.value; i++) {
          const rect = this.rects[i];
          rect.x -= rect.speed;
          p.rect(rect.x, rect.y, rect.size, rect.size);

          if (rect.x + rect.size < 0) rectsToRemove.push(i);
        }

        rectsToRemove.forEach((i) => {
          this.rects[i].x = this.width + this.rects[i].size / 2;
        });

        this.meter.tick();
      };
    };

    this.p5 = new P5(sketch, this.content);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new P5Engine();
  engine.render();
});
