import Engine from './engine';
import scrawl from 'scrawl-canvas';

document.addEventListener("DOMContentLoaded", () => {

  const engine = new Engine();
  const canvas = scrawl.library.canvas.mycanvas;
  const boxes = [];

  canvas.set({
    width: engine.width,
    height: engine.height,
    isComponent: true,
  });

  // let boxes.length = 0;
  const updateBoxes = function () {

    if (boxes.length !== engine.count.value) buildBoxes(engine.count.value);

    boxes.forEach(box => {

      let pos = box.get('positionX');

      if (pos < -25) box.set({
        startX: engine.width + 40,
      });
    });
  };

  const buildBoxes = function (boxesRequired) {

    let { width, height } = engine;

    [...boxes].forEach(box => box.kill());
    boxes.length = 0;

    for (let i = 0; i < boxesRequired; i++) {

      let size = 10 + Math.random() * 40;

      boxes.push(scrawl.makeBlock({
        name: `b-${i}`,
        start: [Math.random() * width, Math.random() * width],
        handle: ['center', 'center'],
        dimensions: [size, size],
        fillStyle: 'white',
        method: 'drawThenFill',
        purge: 'all',
        delta: {
          startX: -1 - Math.random(),
        },
      }));
    }
  };

  scrawl.makeRender({
      name: 'demo-animation',
      target: canvas,
      commence: updateBoxes,
      afterShow: () => engine.meter.tick(),
  });
});
