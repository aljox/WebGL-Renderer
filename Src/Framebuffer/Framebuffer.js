class Framebuffer {
  constuctor() {
    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  }

  attachTexture(texture, attachmentType){
    this.bind();
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl[attachmentType], gl.TEXTURE_2D, texture, 0);
  }

  bind() {
    //gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  }

  delete() {
    gl.deleteFramebuffer(this.framebuffer);
  }

  isComplete() {
    this.bind();
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE) {
      throw Error("Framebuffer is not complete!");
    }
  }

  // disableColorAndReadBuffer() {
  //   this.bind();
  //   gl.DrawBuffers(gl.NONE);
  //   gl.ReadBuffers(gl.NONE);
  // }

  setFramebuffer() {this.framebuffer = framebuffer;}

  getFramebuffer() {return this.framebuffer}
}
