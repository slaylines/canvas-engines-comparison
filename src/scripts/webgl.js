// Based on https://github.com/quidmonkey/particle_test/blob/master/webgl.v3.html
// and vanillia.js project file
import Engine from "./engine";

class WebGLEngine extends Engine {
  constructor() {
    super();
    this.initCanvas(this.width, this.height);
    this.initContextWebGL();
  }

  initCanvas(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "canvas";
    this.canvas.width = width;
    this.canvas.height = height;
    this.content.appendChild(this.canvas);
  }

  initContextWebGL() {
    const gl = this.canvas.getContext('webgl',
      { antialias: false }
    );
    if (!gl) throw '*** ERROR: WebGL Unsupported ***';
    gl.enable(gl.DEPTH_TEST);
    this.gl = gl;
  }

  initProgramWebGL(shaderStrings) {
    const gl = this.gl
    let { fragmentString, vertexString } = shaderStrings;
    const fragmentShader = initShader(gl, fragmentString, gl.FRAGMENT_SHADER);
    const vertexShader = initShader(gl, vertexString, gl.VERTEX_SHADER);
    this.prgGL = createProgramGL(gl, [fragmentShader, vertexShader], ['a_coords', 'a_sizes']);
    gl.useProgram(this.prgGL);
  }

  initLocations() {
    const gl = this.gl
    const prg = this.prgGL
    this.coordsLoc = gl.getAttribLocation(prg, 'a_coords');
    this.sizesLoc = gl.getAttribLocation(prg, 'a_sizes');

    let resolutionLoc = gl.getUniformLocation(prg, 'u_resolution');
    gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);

    this.timeLoc = gl.getUniformLocation(prg, 'u_time');

    this.baseColorLoc = gl.getUniformLocation(prg, "u_baseColor");
    this.borderColorLoc = gl.getUniformLocation(prg, "u_borderColor");
    gl.uniform4fv(this.baseColorLoc, [1, 1, 1, 1]);
    gl.uniform4fv(this.borderColorLoc, [0, 0, 0, 1]);

    this.borderSizeLoc = gl.getUniformLocation(prg, "u_borderSize");
    gl.uniform1f(this.borderSizeLoc, 1.);
  }

  bufferDataWebGL() {
    const gl = this.gl
    this.fillVertices();

    const sizesBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizesBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.sizes, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.sizesLoc);
    gl.vertexAttribPointer(this.sizesLoc, 1, gl.FLOAT,
      false, 0, 0);

    const coordsBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coordsBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.coords, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.coordsLoc);
    gl.vertexAttribPointer(this.coordsLoc, this.FLOATS_PER_VERT, gl.FLOAT,
      false, 0, 0);
    console.log('WebGL vertices to draw:', this.coords.length / this.FLOATS_PER_VERT)
  }

  fillVertices() {
    this.FLOATS_PER_VERT = 4  // x, y, z, vx
    this.coords = new Float32Array(this.FLOATS_PER_VERT * this.rects.length);
    this.sizes = new Float32Array(this.rects.length);
    for (var i = 0, len = this.rects.length; i < len; i++) {
      this.setVertex(i);
    }
  }

  setVertex(index) {
    const jj = index * this.FLOATS_PER_VERT;
    this.coords[jj] = ~~this.rects[index][0];     // pos.x
    this.coords[jj + 1] = ~~this.rects[index][1]; // pos.y
    this.coords[jj + 2] = this.rects[index][2];   // zOrder
    this.coords[jj + 3] = this.rects[index][3];   // vel.x
    this.sizes[index] = ~~this.rects[index][4];   // halfSize
  }

  spawnRectangles() {
    const { count, width, height } = this;
    const rnd = Math.random;
    const rects = [];
    const zStep = 0.8 / count.value;
    for (let i = 0, iz = count.value; i < iz; i++) {
      const x = rnd() * width;
      const y = rnd() * height;
      const speedX = -1 - rnd();
      const halfSize = (10 + rnd() * 40) / 2.;
      const zOrder = 0.1 + (i * zStep);
      rects.push([x, ~~y, zOrder, speedX, ~~halfSize]);
    }
    this.rects = Object.freeze(rects);
  }

  render() {
    this.cancelAnimationFrame(this.request);
    this.initProgramWebGL(this.getShaderStrings());
    this.initLocations();
    this.time = 0;
    this.spawnRectangles();
    this.bufferDataWebGL();
    this.request = requestAnimationFrame(() => this.step());
  }

  step() {
    ++this.time;
    this.setTime();
    this.draw();
    this.meter.tick();
    this.request = requestAnimationFrame(() => this.step());
  }

  setTime() {
    this.gl.uniform1f(this.timeLoc, this.time);
  }

  draw() {
    this.gl.drawArrays(this.gl.POINTS, 0, this.rects.length);
  }

  getShaderStrings() {
    // Use 'WebGL GLSL Editor' extension in VSCode for code highlight
    const vertexString = /*glsl*/`
      attribute vec4 a_coords;
      attribute float a_sizes;

      uniform float u_time;
      uniform vec2 u_resolution;

      varying vec2 v_pos;
      varying float v_size;

      // convert to clip space (normalized range of -1 to 1)
      vec2 clip(vec2 vertex) {
        return vertex / u_resolution * 2.0 - 1.0;
      }

      void main() {
        float delta = a_coords.w * u_time + a_coords.x;
        float x = mod(delta, u_resolution.x);
        v_pos = vec2(x, a_coords.y);
        gl_Position = vec4(clip(v_pos), a_coords.z, 1);
        gl_PointSize = a_sizes * 2.;
        v_size = a_sizes;
      }
      `  // end of vertexString

    const fragmentString = /*glsl*/`
      precision lowp float;

      varying vec2 v_pos;
      varying float v_size;

      uniform float u_borderSize;
      uniform vec4 u_baseColor;
      uniform vec4 u_borderColor;

      void main () {
        // canonic way is to use step() or smoothstep() instead of 'if'
        // see https://blog.scottlogic.com/2019/10/17/sculpting-shapes-with-webgl-fragment-shader.html
        // for more details of how it can be done (with nice anti-aliasing)
        if (
              gl_FragCoord.y>v_pos.y+v_size-u_borderSize
              ||
              gl_FragCoord.y<v_pos.y-v_size+u_borderSize
              ||
              gl_FragCoord.x>v_pos.x+v_size-u_borderSize
              ||
              gl_FragCoord.x<v_pos.x-v_size+u_borderSize
            ) 
          gl_FragColor = u_borderColor;
        else 
          gl_FragColor = u_baseColor;
      }
      `  // end of fragmentString
    return { fragmentString, vertexString }
  }

} // end of class WebGLEngine

document.addEventListener("DOMContentLoaded", () => {
  const engine = new WebGLEngine();
  engine.render();
});

function initShader(gl, source, type) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    console.log('Shader Source: ', source);
    throw ('*** Error compiling shader "' + type + '":' + gl.getShaderInfoLog(shader) + ' ***');
  }
  return shader;
}

function createProgramGL(gl, shaders, attributes, locations) {
  let program = gl.createProgram();
  let i, len;

  for (i = 0, len = shaders.length; i < len; i++) {
    gl.attachShader(program, shaders[i]);
  }

  if (attributes) {
    for (i = 0, len = attributes.length; i < len; i++) {
      gl.bindAttribLocation(
        program,
        locations ? locations[i] : i,
        attributes[i]
      );
    }
  }
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    throw ('*** Error in program linking:' + gl.getProgramInfoLog(program) + '***');
  }
  return program;
}
