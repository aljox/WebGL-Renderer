/*
* Performs rendering per object
*/
class Renderer{
  constructor(rendererID){
    this.rendererID = rendererID;
    this.count = 0;
    this.clearColor = [0, 0, 0, 1];
  }

  render(canvas, programs, objects, uniformArray){
    this.updateClearColour();
    this.clear();
    this.updateViewPort(canvas);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    for(let object of objects){
      uniformArray.clearPerObjectUniforms();
      this.updateCount(object.getVertexArray());

      if(object.getModelMatrixUpdate()){object.updateModelMatrix();}

      let objectUniforms = object.getUniforms();
      uniformArray.addObjectUniformArray(objectUniforms);

      let objTexture = object.getTexture();
      if(objTexture != null) {objTexture.bindToTextureUnit();}

      let program = this.determineProgram(object.getType(), programs);
      gl.useProgram(program.getProgram());
      program.setProgramParameters(object.getVertexArray(), uniformArray);

      if(object.getVertexArray().getIndexBuffer() === null){
        gl.drawArrays(gl.TRIANGLES, 0, this.count);
      } else {
        object.getVertexArray().getIndexBuffer().bind();
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
      }
    }
  }

  determineProgram(type, programs){
    for(let program of programs){
      if(program.getUse().search(type) != -1){
        return program;
      }
    }

    throw Error("Program for " + type + " was not found!");
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

  /*
  * Automatically caluculates number of primitives being rendered
  * Input: VertexArray vertexArray
  * Output: this.count
  */
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
