import Engine from './engine';
import scrawl from 'scrawl-canvas';

document.addEventListener("DOMContentLoaded", () => {

  // The "naive" approach
  // - create a thousand Block entitys, stamp them once each etc
  // ---------------------------------------------
  const engine = new Engine();
  const canvas = scrawl.library.canvas.mycanvas;
  const boxes = [];

  canvas.set({
    width: engine.width,
    height: engine.height,
    isComponent: true,
  });

  const updateBoxes = function () {

    if (boxes.length !== engine.count.value) buildBoxes(engine.count.value);

    const eWidth = engine.width;

    boxes.forEach(box => {

      let boxX = box.get('positionX'),
        boxWidth = box.get('width');

      if (boxX < -boxWidth) box.set({
        startX: boxX + eWidth + (boxWidth * 2),
      });
    });
  };

  const mybox = scrawl.makeBlock({
    name: `template-box`,
    fillStyle: 'white',
    strokeStyle: 'black',
    lineWidth: 2,
    method: 'drawThenFill',
    purge: 'all',
    noUserInteraction: true,
    noPositionDependencies: true,
    noFilters: true,
    noPathUpdates: true,
  });

  const buildBoxes = function (boxesRequired) {

    let { width, height } = engine;

    [...boxes].forEach(box => box.kill());
    boxes.length = 0;

    for (let i = 0; i < boxesRequired; i++) {

      let size = 10 + Math.random() * 40,
        halfSize = size / 2;

      boxes.push(mybox.clone({
        name: `b-${i}`,
        start: [Math.random() * (width + size) - halfSize, Math.random() * (height + size) - halfSize,],
        dimensions: [size, size],
        delta: {
          startX: -1 - Math.random(),
        },
        visibility: true,
        sharedState: true,
        noCanvasEngineUpdates: true,
      }));
    }
  };

  scrawl.makeRender({
      name: 'demo-animation',
      target: canvas,
      commence: updateBoxes,
      afterShow: () => engine.meter.tick(),
      afterCreated: () => mybox.set({ visibility: false })
  });


  // The "in-theory-more-efficient" approach
  // - create a single Block, stamp it a thousand times etc
  // ---------------------------------------------
  /*
  const engine = new Engine();
  const canvas = scrawl.library.canvas.mycanvas;
  const boxes = [];

  canvas.set({
    width: engine.width,
    height: engine.height,
    isComponent: true,
  }).render().catch((err) => console.log(err));

  const mybox = scrawl.makeBlock({
    name: `template-box`,
    fillStyle: 'white',
    strokeStyle: 'black',
    lineWidth: 2,
    method: 'drawThenFill',
    purge: 'all',
    noUserInteraction: true,
    noPositionDependencies: true,
    noFilters: true,
    noDeltaUpdates: true,
  });

  const buildBoxes = function (boxesRequired) {

    let { width, height } = engine;
    let size, x, y, dx;

    boxes.length = 0;

    for (let i = 0; i < boxesRequired; i++) {
      size = 10 + Math.random() * 40;
      x = Math.random() * width;
      y = Math.random() * height;
      dx = -1 - Math.random();
      boxes.push([x, y, dx, size, size]);
    }
  };

  const drawBoxes = function () {

    const engineWidth = engine.width,
      base = canvas.base;

    let box, startX, startY, deltaX, width, height,
      firstRun = true;

    return function () {

      for (let i = 0, iz = boxes.length; i < iz; i++) {
        box = boxes[i];
        [startX, startY, deltaX, width, height] = box;

        mybox.simpleStamp(base, { startX, startY, width, height });

        startX += deltaX;
        if (startX < -width) startX += engineWidth + (width * 2);
        box[0] = startX;
      }

      if (firstRun) {
        mybox.set({
          visibility: false,
          noCanvasEngineUpdates: true,
        });
        firstRun = false;
      }
    }
  }();

  scrawl.makeAnimation({

    name: 'demo-animation',
    fn: () => {
      return new Promise((resolve, reject) => {

        if (boxes.length !== engine.count.value) buildBoxes(engine.count.value);

        Promise.resolve(canvas.clear())
        .then(() => Promise.resolve(drawBoxes()))
        .then(() => canvas.show())
        .then(() => {
          engine.meter.tick();
          resolve(true);
        })
        .catch(err => reject(err));
      });
    },
  });
  */



  // The "cheat-by-using-native-functionality" approach
  // - draw directly on the canvas, bypassing the Scrawl-canvas artefact system
  // ---------------------------------------------
  /*
  const engine = new Engine();
  const canvas = scrawl.library.canvas.mycanvas;
  const boxes = [];

  canvas.set({
    width: engine.width,
    height: engine.height,
    isComponent: true,
  }).render().catch((err) => console.log(err));

  const buildBoxes = function (boxesRequired) {

    let { width, height } = engine,
      size, x, y, dx;

    boxes.length = 0;

    for (let i = 0; i < boxesRequired; i++) {

      size = 10 + Math.random() * 40;
      x = Math.random() * width;
      y = Math.random() * height;
      dx = -1 - Math.random();

      boxes.push([x - (size / 2), y - (size / 2), dx, size, size]);
    }
  };

  const drawBoxes = function () {

    const engineWidth = engine.width,
      ctx = canvas.base.engine;

    let box, x, y, deltaX, width, height;

    return function () {

      ctx.lineWidth = 2;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';

      for (let i = 0, iz = boxes.length; i < iz; i++) {

        box = boxes[i];
        [x, y, deltaX, width, height] = box;

        ctx.strokeRect(x, y, width, height);
        ctx.fillRect(x, y, width, height);

        x += deltaX;
        if (x < -width) x += engineWidth + (width * 2);
        box[0] = x;
      }
    }
  }();

  scrawl.makeAnimation({

    name: 'demo-animation',
    
    fn: () => {

      return new Promise((resolve, reject) => {

        if (boxes.length !== engine.count.value) buildBoxes(engine.count.value);

        Promise.resolve(canvas.clear())
        .then(() => Promise.resolve(drawBoxes()))
        .then(() => canvas.show())
        .then(() => {
          engine.meter.tick();
          resolve(true);
        })
        .catch(err => reject(err));
      });
    },
  });
  */
});
