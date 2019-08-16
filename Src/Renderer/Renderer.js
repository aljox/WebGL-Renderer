class Renderer{
  constructor(rendererID){
    this.rendererID = rendererID;
    this.count = 0;
    this.clearColor = [1, 1, 1, 1];
  }

  render(canvas, program, vertexArray, uniformArray){
    this.updateClearColour();
    this.clear();
    this.updateViewPort(canvas);
    this.updateCount(vertexArray);

    // Turn on culling
    gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program.getProgram());
    program.setProgramParameters(vertexArray, uniformArray);

    if(vertexArray.getIndexBuffer() === null){
      gl.drawArrays(gl.TRIANGLES, 0, this.count);
    } else {
      vertexArray.getIndexBuffer().bind();
      gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }

  }

  updateClearColour(){
    let colour = this.clearColor;
    gl.clearColor(colour[0], colour[1], colour[2], colour[3]);
  }

  clear(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  updateViewPort(canvas){
    //Resize canvas
    //Lookup the size the browser is displaying the canvas.
    let displayWidth  = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;

    //Check if the canvas is not the same size.
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {

      //Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  updateCount(vertexArray){
    if(vertexArray.getIndexBuffer() === null){
      let bufferSpec = vertexArray.getElemetVertexBufferArray(0);
      this.count = bufferSpec.getAttributeBuffer().getData().length / bufferSpec.getNumOfComponents();
    } else {
      this.count = vertexArray.getIndexBuffer().getData().length;
    }
  }

  setRendererID(id){this.rendererID = id;}
  setCount(count){this.count = count;}
  setClearColour(clearColor){this.clearColor = clearColor;}

  getRendererID(){return this.rendererID;}
  getCount(){return this.count;}
  getClearColor(){return this.clearColor;}
}
