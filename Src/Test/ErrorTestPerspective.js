"use strict";

let shaderList = ["3d-vertex-shader.vertex", "3d-fragment-shader.fragment"];
let modelList = ["modelF.obj"];

function main() {
  let renderEngine = new RenderEngine(shaderList, modelList);
  renderEngine.initialise();
  renderEngine.waitSetRenderModels(test);
}

function test(renderEngine) {
  let translation = [0, 0, 0];
  let rotation = [190, 40, 325];
  let scale = [1, 1, 1];

  let program = renderEngine.getPrograms()[0];

  let colorBuffer = new AttributeBuffer("ARRAY_BUFFER", setColors(), "STATIC_DRAW");
  colorBuffer = new Buffer("a_color", colorBuffer, 3, "UNSIGNED_BYTE", true);

  let renderModel = renderEngine.getRenderModels()[0];
  renderModel.addToVertexArray(colorBuffer);

  renderModel.setPosition(new Vec3f(translation[0], translation[1], translation[2]));
  renderModel.setRotation(new Vec3f(rotation[0], rotation[1], rotation[2]));
  renderModel.setScale(new Vec3f(scale[0], scale[1], scale[2]));
  renderModel.updateModelMatrix();

  let perspectiveCamera = new PerspectiveCamera(45, 1, 2000);
  perspectiveCamera.setPosition(new Vec3f(50, -30, 400));
  //perspectiveCamera.lookAt(renderModel);
  perspectiveCamera.buildViewMatrixInverse();

  let matrix = Matrix44f.mulArray([renderModel.getModelMatrix(),
                                    perspectiveCamera.getViewMatrixInverse(),
                                      perspectiveCamera.getProjectionMatrix()]);

  let matrixUniform = new UniformMatrix("u_matrix", "4fv", matrix);
  let uniformArray = new UniformArray([matrixUniform], null, null);

  let renderer = new Renderer(1);
  renderer.render(gl.canvas, program, renderModel.getVertexArray(), uniformArray);
}

// Fill the buffer with colors for the 'F'.
function setColors(gl) {
      return new Uint8Array([
          // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

          // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

          // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

          // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

          // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

          // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

          // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

          // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

          // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

          // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220]);
}

main();
