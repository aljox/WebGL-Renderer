// Global definiton of gl context
let gl;

/**
* Entry point
*/
class RenderEngine {

  /*
  * Input:
  * 1. shaderList -> Array of shader file names
  * 2. modelList -> Array of model file names
  */
  constructor(shaderList, modelList){
    this.shaderList = shaderList;
    this.modelList = modelList;
    this.shaders = [];
    this.programs = [];
    this.models = [];
    this.renderModelsSetted = false;
    this.renderModels = [];
  }

  initialise(){
    this.createCanvas();
    this.createWebGlContext();
    this.initaliseData();
  }

  createCanvas(){
    this.canvas = document.getElementById("canvas");
  }

  createWebGlContext(){
    gl = this.canvas.getContext("webgl")
    if(!gl){
      throw Error("Browser might not support WebGl");
    }
  }

  /*
  * Create programs and render models from sources
  */
  initaliseData(){
    let loadMan = new LoaderManager(this, this.shaderList, this.modelList);
    loadMan.executeLoad();
    loadMan.waitLoad(this.setLoadData);
  }

  setLoadData(renderEngine, loadShaderList, loadModelList){
    RenderEngine.setPrograms(renderEngine, loadShaderList);
    RenderEngine.setModels(renderEngine, loadModelList);
  }

  static setModels(renderEngine, loadModelList){
    for(let loadObj of loadModelList){
      renderEngine.addModel(new Model(loadObj.getData()));
    }

    for(let model of renderEngine.getModels()){
      renderEngine.addRenderModel(RenderModel.buildFromModel(model));
    }

    renderEngine.renderModelsSetted = true;
  }

  static setPrograms(renderEngine, loadShaderList){
    for(let loadObj of loadShaderList){
      renderEngine.shaders.push(new Shader(loadObj));
    }

    for(let i = 0; i < renderEngine.shaders.length / 2; i++){
      renderEngine.programs.push(new Program(renderEngine.shaders[i * 2], renderEngine.shaders[i * 2 + 1]));
    }
  }

  waitToSetRenderModels(callback){
    if(this.renderModelsSetted){
      console.log("Render Models Setted!");
      callback(this);
    } else {
      setTimeout(function() {
          this.waitToSetRenderModels(callback);
        }.bind(this), 50);
    }
  }

  addModel(model){this.models.push(model);}
  addRenderModel(renderModel){this.renderModels.push(renderModel)};

  getGl(){return this.gl;}
  getPrograms(){return this.programs}
  getModels(){return this.models;}
  getRenderModelsSetted(){return this.renderModelsSetted;}
  getRenderModels(){return this.renderModels;}
}
