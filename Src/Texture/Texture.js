// Only for simple 2D textures
class Texture {
  constructor() {
    this.texture = gl.createTexture();

    this.filterMode = null;
    this.wrapMode = null;
    this.mipMap = false;
    this.textureUnit = 0;

    this.image = null;
  }

  applyImage(image) {
    this.image = image;
    this.bind();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);
  }

  createDepthTexture(width, height){
    this.bind();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT,
      width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
  }

  bind() {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  bindToTextureUnit() {
    gl.activeTexture(gl["TEXTURE" + this.textureUnit.toString()]);
    this.bind();
  }

  flipOrientation() {
    this.bind();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  }

  generateMipMap(minFilterMode) {
    this.bind();
    if(MathExt.isPowerOf2(this.image.width) && MathExt.isPowerOf2(this.image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[minFilterMode]);
      this.mipMap = true;
    } else {
      throw error("MipMap error - image is not power of 2!");
    }
  }

  setParameters(wrapMode, filterMode) {
    if(this.mipMap) {
      console.log("MipMap is generated. Parameters for texture cannot be set.");
      return;
    }

    this.wrapMode = wrapMode;
    this.filterMode = filterMode;

    this.bind();
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrapMode]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrapMode]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[filterMode]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[filterMode]);
  }

  setImage(image) {this.image = image;}
  setTexture(texture) {this.texture = texture;}

  setWrapMode(wrapMode) {
    this.wrapMode = wrapMode;
    if(this.filterMode != null) this.setParameters(this.wrapMode, this.filterMode);
  }

  setFilterMode(filterMode) {
    this.filterMode = filterMode;
    if(this.wrapMode != null) this.setParameters(this.wrapMode, this.filterMode);
  }
  setTextureUnit(textureUnit) {this.textureUnit = textureUnit;}

  getImage() {return this.image;}
  getTexture() {return this.texture;}
  getWrapMode() {return this.wrapMode;}
  getFilterMode() {return this.filterMode;}
  getTextureUnit() {return this.textureUnit;}
}
