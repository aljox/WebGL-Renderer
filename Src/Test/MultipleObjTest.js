"use strict";

let shaderList = ["3d-vertex-shader.vertex", "3d-fragment-shader.fragment"];
let modelList = ["modelF.obj", "modelF.obj"];

function main() {
  let renderEngine = new RenderEngine(shaderList, modelList);
  renderEngine.initialise();
  renderEngine.waitToSetRenderModels(test);
}

function test(renderEngine) {
  let translation = [0, 0, 0];
  let rotation = [190, 40, 325];
  let scale = [1, 1, 1];

  let program = renderEngine.getPrograms()[0];
  program.setUse("Render_Model");

  let colorBuffer = new AttributeBuffer("ARRAY_BUFFER", setColors(), "STATIC_DRAW");
  colorBuffer = new Buffer("a_color", colorBuffer, 3, "UNSIGNED_BYTE", true);

  // Initialise first render model
  let renderModel1 = renderEngine.getRenderModels()[0];
  renderModel1.addToVertexArray(colorBuffer);

  renderModel1.setPosition(new Vec3f(translation[0], translation[1], translation[2]));
  renderModel1.setRotation(new Vec3f(rotation[0], rotation[1], rotation[2]));
  renderModel1.setScale(new Vec3f(scale[0], scale[1], scale[2]));
  renderModel1.updateModelMatrix();

  // Initialise second render model
  let renderModel2 = renderEngine.getRenderModels()[1];
  renderModel2.addToVertexArray(colorBuffer);

  renderModel2.setPosition(new Vec3f(-50, 50, translation[2]));
  renderModel2.setRotation(new Vec3f(rotation[0], 90, rotation[2]));
  renderModel2.setScale(new Vec3f(scale[0], scale[1], scale[2]));
  renderModel2.updateModelMatrix();

  // Initialise camera
  let perspectiveCamera = new PerspectiveCamera(45, 1, 2000);
  perspectiveCamera.setPosition(new Vec3f(50, 50, 400));
  perspectiveCamera.lookAt(renderModel1);

  // Build matrix for first model
  let matrixModel1 = Matrix44f.mulArray([renderModel1.getModelMatrix(),
                                    perspectiveCamera.getViewMatrixInverse(),
                                      perspectiveCamera.getProjectionMatrix()]);

  let matrixUniformModel1 = new UniformMatrix("u_matrix", "4fv", matrixModel1);
  renderModel1.addUniform(matrixUniformModel1);

  // Build matrix for second model
  let matrixModel2 = Matrix44f.mulArray([renderModel2.getModelMatrix(),
                                    perspectiveCamera.getViewMatrixInverse(),
                                      perspectiveCamera.getProjectionMatrix()]);

  let matrixUniformModel2 = new UniformMatrix("u_matrix", "4fv", matrixModel2);
  renderModel2.addUniform(matrixUniformModel2);

  let uniformArray = new UniformArray([], [], []);

  let renderer = new Renderer(1);
  renderer.render(gl.canvas, [program], [renderModel1, renderModel2], uniformArray);
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
