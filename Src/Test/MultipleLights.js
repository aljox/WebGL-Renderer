"use strict";

let shaderList = ["./MultipleLightsObject/TextureMultLightsObj.vertex", "./MultipleLightsObject/TextureMultLightsObj.fragment",
                  "./Light/BasicLight.vertex", "./Light/BasicLight.fragment"];
let modelList = ["./CubeModel.obj", "./FlatGround.obj", "./cube.obj"];
let textureList = ["./trippyTexture.jpg", "./brickWall.jpg"];

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
  let directionalLight1 = new DirectionalLight(new Vec3f(0.1, 0.1, -1.0), new Vec3f(1.0, 1.0, 1.0), 0.1, 0.2, 0.1);
  let directionalLights = [directionalLight1];

  let pointLights = generatePointLights(renderEngine.getRenderModel(2), 9);

  // Texture for model
  let modelTexture = renderEngine.getTexture(0);
  modelTexture.generateMipMap("LINEAR_MIPMAP_LINEAR");

    // Initialise model
  let models = generateModels(renderEngine.getRenderModel(0), 15, renderEngine.getTexture(1));

  // Initialise ground
  let ground = renderEngine.getRenderModel(1);
  ground.setPosition(new Vec3f(0, 0, -145));
  ground.setScale(new Vec3f(35, 35, 35));
  ground.updateModelMatrix();

  // Texture for ground
  let groundTexture = renderEngine.getTexture(1);
  groundTexture.generateMipMap("LINEAR_MIPMAP_LINEAR");
  ground.setTexture(groundTexture);

  // Events
  let keyboardEvent = new KeyboardEvent(perspectiveCamera);

  // Renderer
  let renderer = new Renderer(1);
  let objToRender = models.concat([ground]);
  objToRender = objToRender.concat(pointLights);

  let then = 0;
  function renderScene(now) {
    // Animation precompute
    now *= 0.001;
    let deltaTime = now - then;
    then = now;

    for(let model of models){
      let rotation = model.getRotation();
      rotation = rotation.getY();
      rotation -= 20.0 * deltaTime;
      model.setRotationY(rotation);
      model.updateModelMatrix();
    }

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
    for(let i = 0; i < pointLights.length; i++){
      let modelViewMatrixLight = Matrix44f.mulArray([pointLights[i].getModelMatrix(),
                                        perspectiveCamera.getViewMatrixInverse()]);
      let modelViewTransoform = new UniformMatrix("u_modelViewTransform", "4fv", modelViewMatrixLight);
      pointLights[i].addUniform(modelViewTransoform);

      pointLights[i].buildUniformLightShader();
    }

    // Model uniforms
    for(let model of models){
      let modelViewMatrixModel = Matrix44f.mulArray([model.getModelMatrix(),
                                        perspectiveCamera.getViewMatrixInverse()]);
      let modelViewTransoformModel = new UniformMatrix("u_modelViewTransform", "4fv", modelViewMatrixModel);
      model.addUniform(modelViewTransoformModel);

      let normalMatrix = Matrix44f.transponse(Matrix44f.inverse(modelViewMatrixModel));
      let normalMatrixUniform = new UniformMatrix("u_normalMatrix", "4fv", normalMatrix);
      model.addUniform(normalMatrixUniform);

      DirectionalLight.buildUniformObjectShader(model, directionalLights);
      PointLight.buildUniformObjectShader(model, pointLights, perspectiveCamera);
    }

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

  function generateModels(renderModel, num, modelTexture){
      let models = [];
      for(let i = 0; i < num; i++){
        let model = renderModel.getNewInstance();
        model.setPosition(new Vec3f(MathExt.randomInteger(-30, 30), MathExt.randomInteger(3, 30), MathExt.randomInteger(-200, -100)));
        model.setRotation(new Vec3f(MathExt.randomInteger(-90, 90), MathExt.randomInteger(-90, 90), MathExt.randomInteger(-90, 90)));
        model.setScale(new Vec3f(8, 8, 8));
        model.updateModelMatrix();

        model.setTexture(modelTexture);

        models[i] = model;
      }

      return models;
  }

  function generatePointLights(renderModel, num){
    let pointLights = [];
    for(let i = 0; i < num; i++){
      let pointLight = new PointLight(renderModel, new Vec3f(1.0, 1.0, 1.0), 0.0, 1.0, 1.0,
                                        new Vec3f(MathExt.randomInteger(-30, 30), MathExt.randomInteger(3, 30), MathExt.randomInteger(-200, -100)),
                                          1.0, 0.07, 0.0014);

      pointLights[i] = pointLight;
    }

    return pointLights;
  }
}

main();
