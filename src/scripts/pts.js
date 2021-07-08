import Engine from './engine';
import { CanvasSpace, Pt, Group, Line, quickStart, Rectangle, quickstart } from 'pts';



class PtsEngine extends Engine {
  constructor() {
    super();

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.content.appendChild(this.canvas);


  }

  init() {
    this.space = new CanvasSpace(this.canvas);
    this.space.setup({ bgcolor: "#fff" });
    this.form = this.space.getForm();
    this.space.add(this.animate.bind(this))
  }

  animate(time, ftime) {
    // fps meter
    this.meter.tick();


    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i];

      if (rect.x + rect.size < 0) {
        rect.x = this.width + rect.size / 2;
      }

      rect.x -= rect.speed;
      rect.el.moveTo([rect.x, rect.y])
      this.form.fillOnly("#fff").polygon(rect.el);
      this.form.strokeOnly("#000").polygon(rect.el);
    }
  }

  render() {
    const rects = []
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      var rect = Rectangle.fromCenter([x, y], [size, size]);
      var poly = Rectangle.corners(rect);
      rects.push({ x, y, size, speed, el: poly });
    }
    this.rects = rects;


    this.space.play().bindMouse();
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const engine = new PtsEngine();
  engine.init();
  engine.render();
});
