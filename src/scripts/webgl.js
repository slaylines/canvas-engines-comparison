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
    this.gl = gl;
  }

  initProgramWebGL(shaderStrings) {
    let { fragmentString, vertexString } = shaderStrings;
    const fragmentShader = initShader(
      this.gl,
      fragmentString,
      this.gl.FRAGMENT_SHADER);
    const vertexShader = initShader(
      this.gl,
      vertexString,
      this.gl.VERTEX_SHADER);
    this.prg = createProgramGL(this.gl,
      [fragmentShader, vertexShader],
      [
        'a_coords',
        'a_sizes',
      ]);
    this.gl.useProgram(this.prg);
  }

  initLocations() {
    this.coordsLoc = this.gl.getAttribLocation(this.prg, 'a_coords');
    this.sizesLoc = this.gl.getAttribLocation(this.prg, 'a_sizes');

    let resolutionLoc = this.gl.getUniformLocation(this.prg, 'u_resolution');
    this.gl.uniform2f(resolutionLoc, this.gl.canvas.width, this.gl.canvas.height);

    this.timeLoc = this.gl.getUniformLocation(this.prg, 'u_time');

    this.baseColorLoc = this.gl.getUniformLocation(this.prg, "u_baseColor");
    this.borderColorLoc = this.gl.getUniformLocation(this.prg, "u_borderColor");
    this.borderSizeLoc = this.gl.getUniformLocation(this.prg, "u_borderSize");
    this.gl.uniform4fv(this.baseColorLoc, [0, 0, 0, 1]);
    this.gl.uniform4fv(this.borderColorLoc, [1, 1, 1, 1]);
    this.gl.uniform1f(this.borderSizeLoc, 1.);
  }

  spawnRectangles() {
    const { count, width, height } = this;
    const rnd = Math.random;
    const rects_tmp = [];
    for (let i = 0, iz = count.value; i < iz; i++) {
      const x = rnd() * width;
      const y = rnd() * height;
      const speed = -1 - rnd();
      const halfSize = (10 + rnd() * 40) / 2.;
      rects_tmp.push([x, ~~y, speed, ~~halfSize]);
    }
    this.rects = Object.freeze(rects_tmp);
  }

  bufferDataWebGL() {
    this.fillVertices();

    const sizesBuf = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sizesBuf);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.sizes, this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(this.sizesLoc);
    this.gl.vertexAttribPointer(this.sizesLoc, 1, this.gl.FLOAT, false, 0, 0);

    const coordsBuf = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, coordsBuf);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.coords, this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(this.coordsLoc);
    this.gl.vertexAttribPointer(this.coordsLoc, this.FLOATS_PER_VERT, this.gl.FLOAT,
      false, 0, 0);
    console.log('WebGL vertices to draw:', this.coords.length / this.FLOATS_PER_VERT)
  }

  fillVertices() {
    this.FLOATS_PER_VERT = 4  // x, y, vx, vy
    this.coords = new Float32Array(this.FLOATS_PER_VERT * this.rects.length);
    this.sizes = new Float32Array(this.rects.length);

    for (var i = 0, len = this.rects.length; i < len; i++) {
      this.setVertex(i);
    }
  }

  setVertex(index) {
    const jj = index * this.FLOATS_PER_VERT;
    this.coords[jj] = ~~this.rects[index][0]  // pos.x;
    this.coords[jj + 1] = ~~this.rects[index][1] // pos.y;
    this.coords[jj + 2] = this.rects[index][2] // vel.x;
    this.coords[jj + 3] = 0.  // vel.y;
    this.sizes[index] = ~~this.rects[index][3]  // halfSize
  }

  render() {
    this.cancelAnimationFrame(this.request);
    this.initProgramWebGL(this.getShaderStrings());
    this.initLocations();
    this.time = 0;
    this.spawnRectangles();
    this.bufferDataWebGL();
    // this.draw();
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

      uniform float u_pointSize;
      uniform float u_time;
      uniform vec2 u_resolution;

      varying vec2 v_pos;
      varying float v_size;

      // convert to clip space (normalized range of -1 to 1)
      vec2 clip(vec2 vertex) {
        return vertex / u_resolution * 2.0 - 1.0;
      }

      void main() {
        vec2 delta = a_coords.zw * u_time + a_coords.xy;

        float x = mod(delta.x, u_resolution.x);
        float y = mod(delta.y, u_resolution.y);
        vec2 clipSpaceXY = clip(vec2(x, y));
        v_pos = vec2(x, y);
        gl_Position = vec4(clipSpaceXY, 0, 1);
        gl_PointSize = a_sizes * 2.;
        v_size = a_sizes;
      }
      `
    const fragmentString = /*glsl*/`
      precision lowp float;

      varying vec2 v_pos;
      varying float v_size;

      uniform float u_borderSize;
      uniform vec4 u_baseColor;
      uniform vec4 u_borderColor;

      void main () {
        if (
              gl_FragCoord.y>v_pos.y+v_size-u_borderSize
              ||
              gl_FragCoord.y<v_pos.y-v_size+u_borderSize
              ||
              gl_FragCoord.x>v_pos.x+v_size-u_borderSize
              ||
              gl_FragCoord.x<v_pos.x-v_size+u_borderSize
            ) 
          gl_FragColor = u_baseColor;
        else gl_FragColor = u_borderColor;
      }
      `
    return { fragmentString, vertexString }
  }

  getBasicShaderStrings() {
    // Use 'WebGL GLSL Editor' extension in VSCode for code highlight
    const vertexString = /*glsl*/`
      attribute vec4 a_coords;
      void main() {
        gl_Position = a_coords;
      }
      `
    const fragmentString = /*glsl*/`
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1, 0, 0.5, 1); 
      } 
      `
    return { fragmentString, vertexString }
  }
}

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
