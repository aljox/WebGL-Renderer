"use strict";

let shaderList = ["LightVertex.vertex", "LightFragment.fragment", "ObjectVertex.vertex", "ObjectFragment.fragment"];
let modelList = ["Cube.obj", "CubeModel.obj"];

function main() {
  let renderEngine = new RenderEngine(shaderList, modelList);
  renderEngine.initialise();
  renderEngine.waitToSetRenderModels(test);
}

function test(renderEngine) {
  renderEngine.getProgram(0).setUse("Light");
  renderEngine.getProgram(1).setUse("Render_Model");

  // Initialise camera
  let perspectiveCamera = new PerspectiveCamera(45, 1, 2000);
  perspectiveCamera.setPosition(new Vec3f(0, 0, 100));
  perspectiveCamera.buildViewMatrixInverse();

  // Initialise light
  let cubeLight = new Light(renderEngine.getRenderModel(0), new Vec3f(1.0, 1.0, 1.0), 0.2, 0.5, 1.0);
  cubeLight.setPosition(new Vec3f(10, -2, -9));
  cubeLight.setRotation(new Vec3f(0, 0, 0));
  cubeLight.setScale(new Vec3f(2, 2, 2));
  cubeLight.updateModelMatrix();
  cubeLight.buildUniformLightShader();

  // Initialise model
  let model = renderEngine.getRenderModel(1);
  model.setPosition(new Vec3f(-10, 0, 0));
  model.setRotation(new Vec3f(20, -25, 0));
  model.setScale(new Vec3f(12, 12, 12));
  model.updateModelMatrix();

  model.setMaterial(new Material(new Vec3f(1.0, 0.5, 0.31), new Vec3f(1.0, 0.5, 0.31), new Vec3f(0.5, 0.5, 0.5), 128.0));

  // Light model uniforms
  let modelViewMatrixLight = Matrix44f.mulArray([cubeLight.getModelMatrix(),
                                    perspectiveCamera.getViewMatrixInverse()]);
  let modelViewTransoformL = new UniformMatrix("u_modelViewTransform", "4fv", modelViewMatrixLight);
  cubeLight.addUniform(modelViewTransoformL);

  // Model uniforms
  let modelViewMatrixModel = Matrix44f.mulArray([model.getModelMatrix(),
                                    perspectiveCamera.getViewMatrixInverse()]);
  let modelViewTransoformModel = new UniformMatrix("u_modelViewTransform", "4fv", modelViewMatrixModel);
  model.addUniform(modelViewTransoformModel);

  let normalMatrix = Matrix44f.transponse(Matrix44f.inverse(modelViewMatrixModel));
  let normalMatrixUniform = new UniformMatrix("u_normalMatrix", "4fv", normalMatrix);
  model.addUniform(normalMatrixUniform);

  let lightPosUniform = new Uniform("u_lightPos", "3f", cubeLight.getPosition().toArray());
  model.addUniform(lightPosUniform);

  let modelViewTransoformLight = new UniformMatrix("u_modelViewTransformLight", "4fv", modelViewMatrixLight);
  model.addUniform(modelViewTransoformLight);

  model.buildMaterialUniforms();
  cubeLight.buildUniformObjectShader(model);

  // Global uniform
  let projectionTransform = new UniformMatrix("u_projection", "4fv", perspectiveCamera.getProjectionMatrix());
  let uniformArray = new UniformArray([projectionTransform], []);

  // Render
  let renderer = new Renderer(1);
  renderer.render(gl.canvas, renderEngine.getProgramArray(), [cubeLight, model], uniformArray);
}

main();