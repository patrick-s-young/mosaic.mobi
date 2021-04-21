
const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 texCoords;
uniform vec2 translation;

void main() {
  gl_Position = vec4((position + translation) * vec2(1, -1) , 0, 1.0);
  texCoords = uv;
}`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 texCoords;
uniform sampler2D textureSampler;
uniform float opacity;

void main() {
  gl_FragColor = vec4(texture2D(textureSampler, texCoords).rgb, opacity);
  gl_FragColor.rgb *= gl_FragColor.a;
}`;


class UniformInfo {
  type: GLenum;
  location: WebGLUniformLocation;
}

export class GlTiles {
  canvas: HTMLCanvasElement;
  context: WebGLRenderingContext;
  translation: Float32Array;

  private positionArray: Float32Array;
  private elementArray: Uint16Array;
  private UVS: Float32Array;
  //private textureId: WebGLTexture;
  private textureIdArr: Array<WebGLTexture>;
  private numTiles: number;
  private programId: WebGLProgram;
  private vertShader: string;
  private fragShader: string;  
  private uniformLocations: Map<string, UniformInfo>;
  private dirtyProgram: boolean;

  ///////////////
  // CONSTRUCTOR
  constructor (
    canvas: HTMLCanvasElement, 
    uvs: Float32Array,
    positionArray: Float32Array,
    elementArray: Uint16Array,
    numTiles: number
    ) {
    this.UVS = uvs;
    this.canvas = canvas;
    this.positionArray = positionArray;
    this.elementArray = elementArray;
    this.numTiles = numTiles;

    const context = this.canvas.getContext('webgl');
    if (context === null) {
      throw new Error(`Couldn't get a WebGL context`);
    }
    const gl: WebGLRenderingContext = context as WebGLRenderingContext;
    this.context = gl;

    this.textureIdArr = new Array<WebGLTexture>();
    for (let tile = 0; tile < this.numTiles; tile++) {
      const textureId = gl.createTexture();
      if (textureId === null) {
        throw new Error('Error getting textureId_1');
      }
      this.textureIdArr.push(textureId);
    }

    this.programId = 0
    this.vertShader = VERTEX_SHADER;
    this.fragShader = FRAGMENT_SHADER;
    this.uniformLocations = new Map();
    this.bindBuffers(this.elementArray, this.positionArray, this.UVS);
    gl.clearColor(1, 1, 1, 0);
    this.dirtyProgram = true;
  }

  setNumTiles (
    numTiles: number,
    uvs: Float32Array,
    positionArray: Float32Array
    ) {
    console.log(`in setNumTiles`);
    this.positionArray = positionArray;
    this.UVS = uvs;

    for (let texIdx = 0; texIdx < this.numTiles; texIdx++) {
      this.context.deleteTexture(this.textureIdArr[texIdx]);
    }

    this.numTiles = numTiles;
    this.textureIdArr = new Array<WebGLTexture>();
    for (let texIdx = 0; texIdx < this.numTiles; texIdx++) {
      const textureId = this.context.createTexture();
      if (textureId === null) {
        throw new Error('Error getting textureId');
      }
      this.textureIdArr.push(textureId);
    }

    this.bindBuffers(this.elementArray, this.positionArray, this.UVS);
  }

  drawImage (
    video: HTMLVideoElement, 
    opacity: number, 
    translation: Array<number>,
    textureIndex: number
    ) {

    this.setUniform('opacity', opacity);
    this.setUniform('translation', new Float32Array(translation))
    this.setVideoFrame(video, textureIndex);
    this.render();
  }

  setVideoFrame (video: HTMLVideoElement, textureIndex: number) {
    const gl = this.context;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textureIdArr[textureIndex]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    // gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  }

  render() {
    const gl = this.context;

    if (this.dirtyProgram) {
      this.createProgram();
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.flush();
  }

  setVertexShader(source: string) {
    this.vertShader = source;
    this.dirtyProgram = true;
  }

  setFragmentShader (source: string) {
    this.fragShader = source;
    this.dirtyProgram = true;
  }

  setUniform (name: string, value: any) {
    const gl = this.context;

    if (this.dirtyProgram) {
      this.createProgram();
    }

    if (!this.uniformLocations.has(name)) {
      console.warn(`Tried to set unknown uniform ${name}`);
      return;
    }

    const info = this.uniformLocations.get(name)!;

    switch (info.type) {
      case gl.FLOAT:
        gl.uniform1fv(info.location, [value]);
        break;
      case gl.FLOAT_VEC2:
        gl.uniform2fv(info.location, value);
        break;
      case gl.FLOAT_VEC3:
        gl.uniform3fv(info.location, value);
        break;
      case gl.FLOAT_VEC4:
        gl.uniform4fv(info.location, value);
        break;
      case gl.BOOL:
      case gl.INT:
        gl.uniform1iv(info.location, [value]);
        break;
      case gl.BOOL_VEC2:
      case gl.INT_VEC2:
        gl.uniform2iv(info.location, value);
        break;
      case gl.BOOL_VEC3:
      case gl.INT_VEC3:
        gl.uniform3iv(info.location, value);
        break;
      case gl.BOOL_VEC4:
      case gl.INT_VEC4:
        gl.uniform4iv(info.location, value);
        break;
      default:
        console.error(`Couldn't set uniform, unsupported type`);
    }
  }



  private createProgram() {
    const gl = this.context;

    const vertexShaderId = this.compileShader(this.vertShader, gl.VERTEX_SHADER);
    const fragmentShaderId = this.compileShader(this.fragShader, gl.FRAGMENT_SHADER);
    const programId = gl.createProgram();
    if (programId === null) {
      throw new Error(`Couldn't get a program ID`);
    }
    this.programId = programId;
    gl.attachShader(programId, vertexShaderId);
    gl.attachShader(programId, fragmentShaderId);
    gl.linkProgram(programId);
    if (!gl.getProgramParameter(programId, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(programId);
      throw new Error('Could not link shader program. \n\n' + info);
    }
    gl.validateProgram(programId);
    if (!gl.getProgramParameter(programId, gl.VALIDATE_STATUS)) {
      const info = gl.getProgramInfoLog(programId);
      throw new Error('Could not validate shader program. \n\n' + info);
    }
    gl.useProgram(programId);
    this.uniformLocations = new Map();
    this.getUniformLocations();

    this.dirtyProgram = false;
  }

  private compileShader(source: string, type: number): WebGLShader {
    const gl = this.context;
    const shader = gl.createShader(type);

    if (shader === null) {
      throw new Error('Error creating shader');
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`Couldn't compiler shader: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  }

  private getUniformLocations() {
    const gl = this.context;
    const numUniforms = gl.getProgramParameter(this.programId, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(this.programId, i);
      if (info === null) {
        throw new Error(`Couldn't get uniform info`);
      }
      const location = gl.getUniformLocation(this.programId, info.name);
      if (location) {
        this.uniformLocations.set(info.name, {type: info.type, location});
      }
    }
  }

  private bindBuffers(index: Uint16Array, positions: Float32Array, uvs: Float32Array) {
    const gl = this.context;
    this.bindIndicesBuffer(index);
    this.bindAttributeBuffer(0, 2, positions);
    this.bindAttributeBuffer(1, 2, uvs);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
  }

  private bindAttributeBuffer(attributeNumber: number, size: number, data: Float32Array) {
    const gl = this.context;
    const id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, id);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attributeNumber, size, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  private bindIndicesBuffer(data: Uint16Array) {
    const gl = this.context;
    const id = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }
}

