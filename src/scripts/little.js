import Engine from "./engine";
import * as little from "littlejsengine";

class LittleEngine extends Engine {
  constructor() {
    super();
    this.div = document.createElement("div");
    this.div.style.width = this.width;
    this.div.style.height = this.height;
    this.div.style.position = "relative";

    this.rootElement = document.createElement("div");
    little.engineInit(
      this.gameInit.bind(this),
      this.gameUpdate.bind(this),
      this.gameUpdatePost.bind(this),
      this.gameRender.bind(this),
      this.gameRenderPost.bind(this),
      [],
      this.rootElement
    );
    this.rootElement.style.width = "100%";
    this.rootElement.style.height = "100%";

    this.div.appendChild(this.rootElement);
    this.content.appendChild(this.div);

    this.rects = [];
  }

  gameInit() {
    // called once after the engine starts up
    // setup the game
    little.setCanvasFixedSize(little.vec2(this.width, this.height));
    little.setCameraScale(1);
    little.mainCanvas.style.background = "#FFF";

    const cameraSize = little.getCameraSize();
    this.maxX = cameraSize.x / 2;
    this.maxY = cameraSize.y / 2;
  }

  gameUpdate() {
    // called every frame at 60 frames per second
    // handle input and update the game state
    const diff = this.count.value - this.rects.length;

    for (let i = 0; i < diff; i++) {
      const size = little.vec2(little.randInt(11, 51));
      const start = little.vec2(
        little.randInt(-this.maxX, this.maxX),
        little.randInt(-this.maxY, this.maxY)
      );
      const speed = little.randInt(1, 6);
      this.rects.push({ pos: start, size, speed });
    }

    for (let i = 0; i > diff; i--) {
      this.rects.pop();
    }

    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i];

      rect.pos = rect.pos.subtract(little.vec2(rect.speed, 0));

      const maxVisibleX = rect.size.x + this.maxX;
      if (rect.pos.x < -maxVisibleX) {
        rect.pos.x = maxVisibleX;
      }
    }
  }

  gameUpdatePost() {
    // called after physics and objects are updated
    // setup camera and prepare for render
  }

  gameRender() {
    // called before objects are rendered
    // draw any background effects that appear behind objects
    this.meter.tick();
    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i];

      const outlineSize = rect.size.add(little.vec2(1));
      little.drawRect(rect.pos, outlineSize, little.rgb(0, 0, 0));
      little.drawRect(rect.pos, rect.size, little.rgb(1, 1, 1));
    }
  }

  gameRenderPost() {
    // called after objects are rendered
    // draw effects or hud that appear above all objects
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new LittleEngine();
  engine.render();
});
