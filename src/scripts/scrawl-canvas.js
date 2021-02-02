import Engine from './engine';
import scrawl from 'scrawl-canvas';

document.addEventListener("DOMContentLoaded", () => {

  // The "naive" approach
  // - create a thousand Block entitys, stamp them once each etc
  // ---------------------------------------------
  // const engine = new Engine();
  // const canvas = scrawl.library.canvas.mycanvas;
  // const boxes = [];

  // canvas.set({
  //   width: engine.width,
  //   height: engine.height,
  //   isComponent: true,
  // });

  // const updateBoxes = function () {

  //   if (boxes.length !== engine.count.value) buildBoxes(engine.count.value);

  //   boxes.forEach(box => {

  //     let pos = box.get('positionX');

  //     if (pos < -25) box.set({
  //       startX: engine.width + 40,
  //     });
  //   });
  // };

  // const buildBoxes = function (boxesRequired) {

  //   let { width, height } = engine;

  //   [...boxes].forEach(box => box.kill());
  //   boxes.length = 0;

  //   for (let i = 0; i < boxesRequired; i++) {

  //     let size = 10 + Math.random() * 40;

  //     boxes.push(scrawl.makeBlock({
  //       name: `b-${i}`,
  //       start: [Math.random() * width, Math.random() * height],
  //       handle: ['center', 'center'],
  //       dimensions: [size, size],
  //       fillStyle: 'white',
  //       method: 'drawThenFill',
  //       purge: 'all',
  //       delta: {
  //         startX: -1 - Math.random(),
  //       },
  //     }));
  //   }
  // };

  // scrawl.makeRender({
  //     name: 'demo-animation',
  //     target: canvas,
  //     commence: updateBoxes,
  //     afterShow: () => engine.meter.tick(),
  // });


  // The "cheating" approach
  // - create a single Block, stamp it a thousand times etc
  // ---------------------------------------------
  const engine = new Engine();
  const canvas = scrawl.library.canvas.mycanvas;

  // The boxes array holds key data on each of our boxes
  const boxes = [];

  // Set the canvas to the required dimensions
  canvas.set({
    width: engine.width,
    height: engine.height,
    isComponent: true,
  });

  // Render the canvas once, to propogate the required dimensions
  canvas.render()
  .catch((err) => console.log(err));

  // We only need one Block entity when using this approach
  const mybox = scrawl.makeBlock({

    // We don't set the template's start coordinate or dimensions here as we'll be dynamically setting them later
    name: `template-box`,

    // Display options
    fillStyle: 'white',
    strokeStyle: 'black',
    lineWidth: 2,
    method: 'drawThenFill',

    // Add some timesaver flags 
    purge: 'all',
    noUserInteraction: true,
    noPositionDependencies: true,
    noFilters: true,
    noDeltaUpdates: true,
  });

  // We rebuild the boxes array each time the user updates the number of boxes to display
  const buildBoxes = function (boxesRequired) {

    console.log('building boxes');

    let { width, height } = engine,
      size, x, y, dx;

    boxes.length = 0;

    for (let i = 0; i < boxesRequired; i++) {

      size = 10 + Math.random() * 40;
      x = Math.random() * width;
      y = Math.random() * height;
      dx = -1 - Math.random();

      // Each 'box' now becomes an array of key data
      // - [xPosition, yPosition, deltaX, width, height]
      boxes.push([x, y, dx, size, size]);
    }
  };

  // The box drawing routine will be invoked once every display cycle
  const drawBoxes = function () {

    const engineWidth = engine.width,
      ctx = canvas.base;

    let box, startX, startY, deltaX, width, height;

    let firstRun = true;

    return function () {

      for (let i = 0, iz = boxes.length; i < iz; i++) {

        // Update the template with the box details, and stamp it onto the canvas
        box = boxes[i];

        [startX, startY, deltaX, width, height] = box;

        mybox.simpleStamp(ctx, {
          startX,
          startY,
          width,
          height, 
        });

        // Update the box's start coordinate, also checking to see if it has moved offscreen
        startX += deltaX;

        if (startX < -width) startX += engineWidth + (width * 2);

        box[0] = startX;
      }

      // The template Block needs to complete one Display cycle to set up the canvas context engine
      // - after that run completes, we can add some more timesaving flags to it.
      if (firstRun) {
        mybox.set({
          visibility: false,
          noCanvasEngineUpdates: true,
        });
        firstRun = false;
      }
    }
  }();

  // Build our own animation object
  scrawl.makeAnimation({

    name: 'demo-animation',
    
    // Every animation object needs a 'fn' function, which gets invoked on each tick of the Display cycle
    fn: () => {

      // The Scrawl-canvas Display cycle is, beneath the surface, driven by Promises
      return new Promise((resolve, reject) => {

        // Before we start, check to see if the user has changed the number of boxes to display
        if (boxes.length !== engine.count.value) buildBoxes(engine.count.value);

        // The Display cycle includes 3 key steps:
        // + `clear()` - to wipe the canvas's drawing areas clean
        // + `compile()` - which takes place on the Canvas wrapper object's `base` canvas. 
        // + `show()` - which copies over everything drawn on the base canvas and pastes it into the display canvas
        Promise.resolve(canvas.clear())

        // In this instance, we're using our `drawBoxes()` function instead of the built-in `compile` function
        .then(() => Promise.resolve(drawBoxes()))

        .then(() => canvas.show())

        // Always `resolve` the Display cycle!
        .then(() => {

          engine.meter.tick();
          resolve(true);
        })

        // Always catch errors - if something goes wrong the Promise chain needs to `reject`, not resolve
        .catch(err => reject(err));
      });
    },
  });
});
