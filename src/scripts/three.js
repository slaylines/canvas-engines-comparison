import Engine from "./engine";
import * as THREE from "three";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial"
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

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
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(this.width, this.height);
    this.content.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");
  }

  makeRect(x, y, size) {
    const rect = new THREE.Shape();
    const points = [];
    points.push(new THREE.Vector3(- size / 2, - size / 2, 0));
    points.push(new THREE.Vector3( size / 2, - size / 2, 0));
    points.push(new THREE.Vector3(size / 2, size / 2, 0));
    points.push(new THREE.Vector3(- size / 2, size / 2, 0));
    points.push(new THREE.Vector3(- size / 2, - size / 2, 0));
    rect.moveTo(points[0].x, points[0].y);
    points.forEach((p) => {
      rect.lineTo(p.x, p.y);
    });
    const linePos = []
    points.forEach((p) => {
        linePos.push(p.x,p.y,p.z)
      });

    const geometry = new THREE.ShapeGeometry(rect);
    const fillMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setStyle("white"),
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, fillMat);

    const strokeMaterial = new LineMaterial({
      color:  new THREE.Color().setStyle("black"),
      linewidth: 0.002,
    });
    const lineGeometry = new LineGeometry().setPositions(linePos);
    const line = new Line2(lineGeometry, strokeMaterial);

    const rectThree = new THREE.Group();
    rectThree.add(mesh, line);
    rectThree.position.x = x
    rectThree.position.y = y

    return rectThree;
  }

  animate() {
    const rectsToRemove = [];
    for (let i = 0; i < this.count.value; i++) {
      const r = this.rects[i];
      r.el.position.x -= r.speed;

      if ( r.el.position.x + r.size / 2 < 0) rectsToRemove.push(i);
    }

    rectsToRemove.forEach((i) => {
      this.rects[i].el.position.x = this.width + this.rects[i].size / 2;
    });
    requestAnimationFrame(this.animate.bind(this), this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
    this.meter.tick();
  }

  render() {
    this.rects = {};
    this.scene.clear();
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = (1 + Math.random()) * 1;
      const rect = this.makeRect(x, y, size);
      this.scene.add(rect);
      this.rects[i] = {
        size,
        speed,
        el: rect,
      };
    }
    this.animate();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new ThreeEngine();
  engine.render();
});
