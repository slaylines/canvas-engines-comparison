import Engine from "./engine";
import { RendererMain, MainCoreDriver } from "@lightningjs/renderer/dist/exports/main-api";

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
      new MainCoreDriver(),
    );
  }

  animate() {
    this.meter.tick();
    this.request = requestAnimationFrame(() => this.animate());
  }

  async render() {
    this.cancelAnimationFrame(this.request);
    await this.renderer.init();
    for (let i = 0; i < this.rects.length; i++) {
      this.renderer.destroyNode(this.rects[i]);
    }

    this.rects = new Array(this.count);
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = Math.random() * 0.1 + 0.05;

      const node = this.renderer.createNode({
        x,
        y,
        width: size,
        height: size,
        parent: this.renderer.root,
        shader: this.renderer.createShader("DynamicShader", {
          effects: [
            {
              type: "border",
              props: {
                width: 1,
                color: 0x000000ff,
              },
            },
          ],
        }),
      });

      let animation;
      const firstDuration = (x + size) / speed;
      const secondDuration = (this.width + size) / speed;
      let init = true;

      (async () => {
        while (true) {
          animation = node
            .animate(
              {
                x: 0 - size,
              },
              {
                duration: init ? firstDuration : secondDuration,
              }
            )
            .start();
          await animation.waitUntilStopped();
          if (init) init = false;
          node.x = this.width;
        }
      })();

      this.rects[i] = node;
    }

    this.request = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new Lightning();
  engine.render();
});
