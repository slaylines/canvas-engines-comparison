import Engine from "./engine";
import { RendererMain, MainRenderDriver } from "@lightningjs/renderer/dist/exports/main-api";

class Lightning extends Engine {
  constructor() {
    super();

    this.rects = [];
    this.renderer = new RendererMain(
      {
        appWidth: this.width,
        appHeight: this.height,
        clearColor: 0xffffffff,
      },
      this.content,
      new MainRenderDriver(),
    );

  }

  animate() {
    for (let i = 0; i < this.count.value; i++) {
      const r = this.rects[i];
      r.node.x -= r.speed;
      if (r.node.x + r.node.width < 0) {
        r.node.x = this.width + r.node.width;
      }
    }

    this.meter.tick();
    this.request = requestAnimationFrame(() => this.animate());
  }

  async render() {
    this.cancelAnimationFrame(this.request);
    await this.renderer.init();
    for (let i = 0; i < this.rects.length; i++) {
      this.renderer.destroyNode(this.rects[i].node);
    }

    this.rects = new Array(this.count);
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      
      const node = this.renderer.createNode({
        x,
        y,
        width: size,
        height: size,
        parent: this.renderer.root,
        color: 0xffffffff,
        shader: this.renderer.createShader('DynamicShader', {
          effects: [
            {
              type: 'border',
              props: {
                width: 1,
                color: 0x000000ff,
              },
            },
          ],
        }),
      });

      this.rects[i] = { node, speed };
    }

    this.request = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new Lightning();
  engine.render();
});
