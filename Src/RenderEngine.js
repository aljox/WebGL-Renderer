//global definiton of gl context
let gl;

class RenderEngine {
  constructor(shaderList, modelList){
    this.shaderList = shaderList;
    this.modelList = modelList;
    this.shaders = [];
    this.programs = [];
    this.models = [];
  }

  initialise(){
    this.createCanvas();
    this.createWebGlContext();
    this.initalisePrograms();
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

  initalisePrograms(){
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
      renderEngine.models.push(new Model(loadObj.getData()));
    }
  }

  static setPrograms(renderEngine, loadShaderList){
    for(let loadObj of loadShaderList){
      renderEngine.shaders.push(new Shader(loadObj));
    }

    for(let i = 0; i < renderEngine.shaders.length / 2; i++){
      renderEngine.programs.push(new Program(renderEngine.shaders[i * 2], renderEngine.shaders[i * 2 + 1]));
    }
  }

  getGl(){return this.gl;}
  getPrograms(){return this.programs}
  getModels(){return this.models;}
}