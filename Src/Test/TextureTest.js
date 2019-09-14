"use strict";

let shaderList = ["Light/BasicLight.vertex", "Light/BasicLight.fragment", "Object/TextureObject.vertex", "Object/TextureObject.fragment"];
let modelList = ["Cube.obj", "CubeModel.obj", "FlatGround.obj"];
let textureList = ["trippyTexture.jpg", "brickWall.jpg"];

function main() {
  let renderEngine = new RenderEngine(shaderList, modelList, textureList);
  renderEngine.initialise();
  renderEngine.waitToSetData(initialise);
}

function initialise(renderEngine) {
  renderEngine.getProgram(0).setUse("Light");
  renderEngine.getProgram(1).setUse("Render_Model_Texture");

  // Initialise camera
  let perspectiveCamera = new PerspectiveCamera(45, 1, 2000);
  perspectiveCamera.setPosition(new Vec3f(0, 15, -10));
  perspectiveCamera.buildViewMatrixInverse();

  // Initialise light
  let cubeLight = new Light(renderEngine.getRenderModel(0), new Vec3f(1.0, 1.0, 1.0), 0.2, 0.8, 0.5);
  cubeLight.setPosition(new Vec3f(10, 20, -120));
  cubeLight.setRotation(new Vec3f(0, 0, 0));
  cubeLight.setScale(new Vec3f(2, 2, 2));
  cubeLight.updateModelMatrix();

  // Initialise model
  let model = renderEngine.getRenderModel(1);
  model.setPosition(new Vec3f(-10, 15, -150));
  model.setRotation(new Vec3f(20, 45, 0));
  model.setScale(new Vec3f(12, 12, 12));
  model.updateModelMatrix();

  // Texture for model
  let modelTexture = renderEngine.getTexture(0);
  modelTexture.generateMipMap("LINEAR_MIPMAP_LINEAR");
  //modelTexture.setParameters("CLAMP_TO_EDGE", "LINEAR");
  model.setTexture(modelTexture);

  // Initialise ground
  let ground = renderEngine.getRenderModel(2);
  ground.setPosition(new Vec3f(0, 0, -145));
  ground.setScale(new Vec3f(30, 30, 30));
  ground.updateModelMatrix();

  // Texture for ground
  let groundTexture = renderEngine.getTexture(1);
  groundTexture.generateMipMap("LINEAR_MIPMAP_LINEAR");
  //groundTexture.setParameters("CLAMP_TO_EDGE", "LINEAR");
  ground.setTexture(groundTexture);

  // Events
  let keyboardEvent = new KeyboardEvent(perspectiveCamera);

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
    rotation = rotation.getY();
    rotation -= 20.0 * deltaTime;
    model.setRotationY(rotation);
    model.updateModelMatrix();

    clearUniforms();
    let uniformArray = setUniforms();
    renderer.render(gl.canvas, renderEngine.getProgramArray(), [cubeLight, model, ground], uniformArray);
    requestAnimationFrame(renderScene);
  }

  requestAnimationFrame(renderScene);

  function setUniforms() {
    // Light model uniforms
    let modelViewMatrixLight = Matrix44f.mulArray([cubeLight.getModelMatrix(),
                                      perspectiveCamera.getViewMatrixInverse()]);
    let modelViewTransoform = new UniformMatrix("u_modelViewTransform", "4fv", modelViewMatrixLight);
    cubeLight.addUniform(modelViewTransoform);

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

    cubeLight.buildUniformObjectShader(model);

    // Ground uniforms
    let groundViewMatrixGround = Matrix44f.mulArray([ground.getModelMatrix(),
                                      perspectiveCamera.getViewMatrixInverse()]);
    let groundViewTransoformModel = new UniformMatrix("u_modelViewTransform", "4fv", groundViewMatrixGround);
    ground.addUniform(groundViewTransoformModel);

    let normalMatrixGround = Matrix44f.transponse(Matrix44f.inverse(groundViewMatrixGround));
    let normalMatrixUniformGround = new UniformMatrix("u_normalMatrix", "4fv", normalMatrixGround);
    ground.addUniform(normalMatrixUniformGround);

    ground.addUniform(lightPosUniform);
    ground.addUniform(modelViewTransoformLight);

    cubeLight.buildUniformObjectShader(ground);

    // Global uniform
    let projectionTransform = new UniformMatrix("u_projection", "4fv", perspectiveCamera.getProjectionMatrix());
    return new UniformArray([projectionTransform], []);
  }

  function clearUniforms(){
    perspectiveCamera.clearUniforms();
    cubeLight.clearUniforms();
    model.clearUniforms();
    ground.clearUniforms();
  }
}

main();
