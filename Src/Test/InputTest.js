"use strict";

let shaderList = ["LightVertex.vertex", "LightFragment.fragment", "ObjectVertex.vertex", "ObjectFragment.fragment"];
let modelList = ["Cube.obj", "CubeModel.obj"];

function main() {
  let renderEngine = new RenderEngine(shaderList, modelList);
  renderEngine.initialise();
  renderEngine.waitToSetRenderModels(initialiseModels);
}

function initialiseModels(renderEngine) {
  renderEngine.getProgram(0).setUse("Light");
  renderEngine.getProgram(1).setUse("Render_Model");

  // Initialise camera
  let perspectiveCamera = new PerspectiveCamera(45, 1, 2000);
  perspectiveCamera.setPosition(new Vec3f(0, 0, 100));
  perspectiveCamera.buildViewMatrixInverse();

  // Initialise light
  let cubeLight = new Light(renderEngine.getRenderModel(0), new Vec3f(1.0, 1.0, 1.0), 0.2, 0.5, 1.0);
  cubeLight.setPosition(new Vec3f(10, -2, 0));
  cubeLight.setRotation(new Vec3f(0, 0, 0));
  cubeLight.setScale(new Vec3f(2, 2, 2));
  cubeLight.updateModelMatrix();

  // Initialise model
  let model = renderEngine.getRenderModel(1);
  model.setPosition(new Vec3f(-10, 0, 0));
  model.setRotation(new Vec3f(20, 45, 0));
  model.setScale(new Vec3f(12, 12, 12));
  model.updateModelMatrix();

  // Events
  let keyboardEvent = new KeyboardEvent(perspectiveCamera);

  model.setMaterial(new Material(new Vec3f(1.0, 0.5, 0.31), new Vec3f(1.0, 0.5, 0.31), new Vec3f(0.5, 0.5, 0.5), 128.0));

  // Renderer
  let renderer = new Renderer(1);
  let then = 0;
  function renderScene(now) {
    // Convert to seconds
    now *= 0.001;
    // Subtract the previous time from the current time
    let deltaTime = now - then;
    // Remember the current time for the next frame.
    then = now;

    // Every frame increase the rotation a little.
    let rotation = model.getRotation();
    rotation = rotation.getX();
    rotation += 20.0 * deltaTime;
    model.setRotationX(rotation);
    model.updateModelMatrix();

    clearUniforms();
    let uniformArray = setUniforms();
    renderer.render(gl.canvas, renderEngine.getProgramArray(), [cubeLight, model], uniformArray);
    requestAnimationFrame(renderScene);
  }

  requestAnimationFrame(renderScene);

  function setUniforms() {
    // Light model uniforms
    let modelViewMatrixLight = Matrix44f.mulArray([cubeLight.getModelMatrix(),
                                      perspectiveCamera.getViewMatrixInverse()]);
    let modelViewTransoformL = new UniformMatrix("u_modelViewTransform", "4fv", modelViewMatrixLight);
    cubeLight.addUniform(modelViewTransoformL);

    cubeLight.buildUniformLightShader();

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
    return new UniformArray([projectionTransform], []);
  }

  function clearUniforms(){
    perspectiveCamera.clearUniforms();
    cubeLight.clearUniforms();
    model.clearUniforms();
  }
  //renderScene();
}

main();
