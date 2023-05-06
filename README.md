# Canvas Engines Comparison

https://benchmarks.slaylines.io/

## Description

- Up to 32000 different rectangles moving on a canvas with various speed
- Different choice of libraries used to render the scene :

|                                                            | module kb                                                  |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| [PixiJS](https://www.pixijs.com)                           | ![](https://badgen.net/bundlephobia/min/pixi.js)           |
| [Mesh.js](https://github.com/mesh-js/mesh.js)              | ![](https://badgen.net/bundlephobia/min/@mesh.js/core)     |
| [P5.js](https://p5js.org)                                  | ![](https://badgen.net/bundlephobia/min/p5)                |
| [ZRender](https://github.com/ecomfe/zrender)               | ![](https://badgen.net/bundlephobia/min/zrender)           |
| [Two.js](https://two.js.org/)                              | ![](https://badgen.net/bundlephobia/min/two.js)            |
| [Konva.js](https://konvajs.org/)                           | ![](https://badgen.net/bundlephobia/min/konva)             |
| [CanvasKit](https://skia.org/docs/user/modules/canvaskit/) | ![](https://badgen.net/bundlephobia/min/canvaskit-wasm)    |
| [Pencil.js](https://pencil.js.org/)                        | ![](https://badgen.net/bundlephobia/min/pencil.js)         |
| [Paper.js](http://paperjs.org/)                            | ![](https://badgen.net/bundlephobia/min/paper)             |
| [Fabric.js](http://fabricjs.com/)                          | ![](https://badgen.net/bundlephobia/min/fabric)            |
| [Three JS](https://threejs.org/)                           | ![](https://badgen.net/bundlephobia/min/three)             |
| [Scrawl-canvas](https://scrawl-v8.rikweb.org.uk/)          | ![](https://badgen.net/bundlephobia/min/scrawl-canvas)     |
| [Pts](https://github.com/williamngan/pts)                  | ![](https://badgen.net/bundlephobia/min/pts)               |
| [EaselJS](https://github.com/CreateJS/EaselJS)             | ![](https://badgen.net/bundlephobia/min/@createjs/easeljs) |
| [SVG.js](https://github.com/svgdotjs/svg.js)               | ![](https://badgen.net/bundlephobia/min/@svgdotjs/svg.js)  |


Thanks to [KaliedaRik](https://github.com/KaliedaRik) for the (highly unscientific) comparison of the performance in different browsers (MacBook Pro 2019, 8k boxes):

| Library | Chrome | Firefox | Safari |
| --- | --- | --- | --- |
| Pixi | 60 | 48 | 24 |
| Scrawl-canvas | 56 | 60 | 40 |
| P5 | 15 | 4 | 44 |
| Mesh | 47 | 34 | 18 |
| ZRender | 13 | 4 | 28 |
| Two | 23 | 25 | 16 |
| Konva | 23 | 7 | 19 |
| CanvasKit | 17 | 19 | 22 |
| Paper | 16 | 6 | 16 |
| Easel | 11 | 4 | 28 |
| Pencil | 12 | 3 | 19 |
| Pts | 12 | 4 | 13 |
| Fabric | 9 | 4 | 9 |
| SVG | 10 | 7 | 10 |
| Three | 8 | 7 | 4 |
| DOM | 17 | 1 | 11 |
| Raw JS | 19 | 19 | 39 |


## Quick Start

```
$ yarn install
$ yarn build
$ yarn start
```

## Misc

A list of webgl libraries : https://gist.github.com/dmnsgn/76878ba6903cf15789b712464875cfdc
