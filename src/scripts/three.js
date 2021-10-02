import Engine from "./engine";
import * as THREE from "three";

class ThreeEngine extends Engine {
  constructor() {
    super();
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      1,
      1000
    );
    this.camera.position.set(this.width / 2, this.height / 2, 500);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, depth: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.sortObjects = false; // Allows squares to be drawn on top of each other
    this.content.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");
  }

  makeRect(x, y, size, speed) {
    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
      depthTest: false,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(x, y, 0);
    plane.userData["speed"] = speed;
    this.scene.add(plane);

    // Make the borders of the planes
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    line.position.set(x, y, 0);
    line.userData["speed"] = speed;
    this.scene.add(line);
  }

  animate() {
    let size;
    for (let child of this.scene.children) {
      child.position.x -= child.userData.speed;
      if (child.type === "Mesh") {
        // borders come directly after planes in the scene
        size = child.geometry.parameters.width;
      }
      if (child.position.x + size * 2 < 0) {
        child.position.x = this.width + size * 2;
      }
    }

    this.lastFrame = requestAnimationFrame(
      this.animate.bind(this),
      this.renderer.domElement
    );
    this.renderer.render(this.scene, this.camera);
    this.meter.tick();
  }

  render() {
    this.scene.clear();

    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = (1 + Math.random()) * 1;
      this.makeRect(x, y, size, speed);
    }

    if (this.lastFrame) {
      // Avoid overlapping animation requests to keep FPS meter working
      cancelAnimationFrame(this.lastFrame);
    }

    this.animate();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new ThreeEngine();
  engine.render();
});
