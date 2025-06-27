import Engine from "./engine";
import { RendererMain } from '@lightningjs/renderer/dist/exports/index.js';
import { WebGlCoreRenderer, SdfTextRenderer } from '@lightningjs/renderer/dist/exports/webgl.js';

class Lightning extends Engine {
  constructor() {
    super();

    this.rects = [];
    this.animations = [];
    
    // Create and append the app div
    this.appDiv = document.createElement('div');
    this.appDiv.id = 'app';
    this.appDiv.style.width = this.width + 'px';
    this.appDiv.style.height = this.height + 'px';
    this.content.appendChild(this.appDiv);
    
    this.renderer = new RendererMain({
      appWidth: this.width,
      appHeight: this.height,
      clearColor: 0x00000000,
      numImageWorkers: 0, // Disable image workers for simplicity
      renderEngine: WebGlCoreRenderer,
      fontEngines: [ SdfTextRenderer ]
    }, 'app');

    this.renderer.on('frameTick', () => {
      this.meter.tick();
    });
  }

  async render() {
    // Stop any existing animations
    this.animations.forEach(animation => {
      if (animation) {
        animation.stop();
      }
    });
    this.animations = [];
    
    // Clean up existing nodes
    for (let i = 0; i < this.rects.length; i++) {
      this.renderer.destroyNode(this.rects[i]);
    }

    this.rects = new Array(this.count.value);
    this.animations = new Array(this.count.value);
    
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

      this.rects[i] = node;
      
      // Start the animation loop for this node
      this.startNodeAnimation(node, size, speed, i);
    }
  }

  startNodeAnimation(node, size, speed, index) {
    const firstDuration = (node.x + size) / speed;
    const secondDuration = (this.width + size) / speed;
    let isFirstAnimation = true;

    const animateToLeft = () => {
      const duration = isFirstAnimation ? firstDuration : secondDuration;
      
      const animation = node.animate(
        {
          x: 0 - size,
        },
        {
          duration: duration,
          easing: 'linear',
          loop: false,
        }
      );

      animation.start();
      this.animations[index] = animation;

      // When animation finishes, reset position and start again
      animation.waitUntilStopped().then(() => {
        if (this.animations[index] === animation) { // Check if this is still the current animation
          node.x = this.width;
          isFirstAnimation = false;
          animateToLeft(); // Start the next animation
        }
      }).catch(() => {
        // Animation was stopped/cancelled, don't continue
      });
    };

    animateToLeft();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new Lightning();
  engine.render();
});
