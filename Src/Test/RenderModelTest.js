let shaderList = ["basicVertex.vertex", "basicFragment.fragment"];
let modelList = ["Test.obj"];

window.onload = function(){
  let renderEngine = new RenderEngine(shaderList, modelList);
  renderEngine.initialise();
  renderEngine.waitSetRenderModels(test);
}

function test(renderEngine){
  let model2 = renderEngine.getRenderModels()[0];
  let scale = Matrix44f.initScale(2, 3, 4);
  let scale2 = Matrix44f.initTranslation(40, 100, -50);
  model2.applyTransformation(scale);
  model2.applyTransformation(scale2);
  model2.updateModelMatrix();
  console.log(model2);

  let ortoMatrix = Matrix44f.initOrtographich(0, gl.canvas.width, 0, gl.canvas.height, -600, 600);

  let orto =  new UniformMatrix("u_matrix", "4fv", Matrix44f.mulArray([model2.getModelMatrix(), ortoMatrix]));
  let uniArray = new UniformArray([orto], null, null);

  // Tell WebGL how to convert from clip space to pixels
    gl.clearColor(0.5, 0.5, 0.5 , 1.0);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    //gl.enable(gl.DEPTH_TEST);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(renderEngine.getPrograms()[0].getProgram());
  renderEngine.getPrograms()[0].setProgramParameters(model2.getVertexArray(), uniArray);

  model2.getVertexArray().getIndexBuffer().bind();

  gl.drawElements(gl.TRIANGLES, model2.getVertexArray().getIndexBuffer().getData().length, gl.UNSIGNED_SHORT, 0);
}
