"use strict";

let shaderList = ["MultipleLightsObject/TextureMultLightsObj.vertex", "MultipleLightsObject/TextureMultLightsObj.fragment",
                  "Light/BasicLight.vertex", "Light/BasicLight.fragment"];
let modelList = ["CubeModel.obj", "FlatGround.obj", "cube.obj"];
let textureList = ["trippyTexture.jpg", "brickWall.jpg"];

function main() {
  let renderEngine = new RenderEngine(shaderList, modelList, textureList);
  renderEngine.initialise();
  renderEngine.waitToSetData(initialise);
}

function initialise(renderEngine) {
  renderEngine.getProgram(0).setUse("Render_Model_Texture");
  renderEngine.getProgram(1).setUse("Light");

  // Initialise camera
  let perspectiveCamera = new PerspectiveCamera(45, 1, 2000);
  perspectiveCamera.setPosition(new Vec3f(0, 15, -20));
  perspectiveCamera.buildViewMatrixInverse();

  // Initialise light
  let directionalLight1 = new DirectionalLight(new Vec3f(0.3, -0.2, -1.0), new Vec3f(1.0, 1.0, 1.0), 0.0, 0.0, 0.0);
  let directionalLights = [directionalLight1];

  let pointLight1 = new PointLight(renderEngine.getRenderModel(2), new Vec3f(1.0, 1.0, 1.0), 0.2, 1.0, 0.0,
                                                                    new Vec3f(5, 15, -160), 1.0, 0.14, 0.07);
  let pointLights = [pointLight1];

  // Initialise model
  let model = renderEngine.getRenderModel(0);
  model.setPosition(new Vec3f(-10, 15, -160));
  model.setRotation(new Vec3f(0, 0, 0));
  model.setScale(new Vec3f(12, 12, 12));
  model.updateModelMatrix();

  // Texture for model
  let modelTexture = renderEngine.getTexture(0);
  modelTexture.generateMipMap("LINEAR_MIPMAP_LINEAR");
  //modelTexture.setParameters("CLAMP_TO_EDGE", "LINEAR");
  model.setTexture(modelTexture);

  // Initialise ground
  let ground = renderEngine.getRenderModel(1);
  ground.setPosition(new Vec3f(0, 0, -145));
  ground.setScale(new Vec3f(35, 35, 35));
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
  let objToRender = [model, ground];
  objToRender = objToRender.concat(pointLights);

  let then = 0;
  function renderScene(now) {
    // Convert to seconds
    now *= 0.001;
    // Subtract the previous time from the current time
    let deltaTime = now - then;
    // Remember the current time for the next frame.
    then = now;

    // Every frame increase the rotation a little.
    // let rotation = model.getRotation();
    // rotation = rotation.getY();
    // rotation -= 20.0 * deltaTime;
    // model.setRotationY(rotation);
    // model.updateModelMatrix();

    for(let obj of objToRender){
      obj.clearUniforms();
    }

    let uniformArray = setUniforms();
    renderer.render(gl.canvas, renderEngine.getProgramArray(), objToRender, uniformArray);
    requestAnimationFrame(renderScene);
  }

  requestAnimationFrame(renderScene);

  function setUniforms() {
    // Point Light uniforms
    let modelViewMatrixLight = Matrix44f.mulArray([pointLights[0].getModelMatrix(),
                                      perspectiveCamera.getViewMatrixInverse()]);
    let modelViewTransoform = new UniformMatrix("u_modelViewTransform", "4fv", modelViewMatrixLight);
    pointLights[0].addUniform(modelViewTransoform);

    pointLights[0].buildUniformLightShader();

    // Model uniforms
    let modelViewMatrixModel = Matrix44f.mulArray([model.getModelMatrix(),
                                      perspectiveCamera.getViewMatrixInverse()]);
    let modelViewTransoformModel = new UniformMatrix("u_modelViewTransform", "4fv", modelViewMatrixModel);
    model.addUniform(modelViewTransoformModel);

    let normalMatrix = Matrix44f.transponse(Matrix44f.inverse(modelViewMatrixModel));
    let normalMatrixUniform = new UniformMatrix("u_normalMatrix", "4fv", normalMatrix);
    model.addUniform(normalMatrixUniform);

    DirectionalLight.buildUniformObjectShader(model, directionalLights);
    PointLight.buildUniformObjectShader(model, pointLights, perspectiveCamera);

    // Ground uniforms
    let groundViewMatrixGround = Matrix44f.mulArray([ground.getModelMatrix(),
                                      perspectiveCamera.getViewMatrixInverse()]);
    let groundViewTransoformModel = new UniformMatrix("u_modelViewTransform", "4fv", groundViewMatrixGround);
    ground.addUniform(groundViewTransoformModel);

    let normalMatrixGround = Matrix44f.transponse(Matrix44f.inverse(groundViewMatrixGround));
    let normalMatrixUniformGround = new UniformMatrix("u_normalMatrix", "4fv", normalMatrixGround);
    ground.addUniform(normalMatrixUniformGround);

    DirectionalLight.buildUniformObjectShader(ground, directionalLights);
    PointLight.buildUniformObjectShader(ground, pointLights, perspectiveCamera);

    // Global uniform
    let projectionTransform = new UniformMatrix("u_projection", "4fv", perspectiveCamera.getProjectionMatrix());
    return new UniformArray([projectionTransform], []);
  }
}

main();
