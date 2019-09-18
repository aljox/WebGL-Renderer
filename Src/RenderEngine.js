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
  * 3. textureList -> Array of texture images file names
  */
  constructor(shaderList, modelList, textureList){
    this.shaderList = shaderList;
    this.modelList = modelList;
    this.textureList = textureList;

    this.shaders = [];
    this.programs = [];

    this.models = [];
    this.renderModels = [];

    this.textures = [];

    this.renderModelsSetted = false;
    this.textureSetted = false;
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

    const ext = gl.getExtension('WEBGL_depth_texture');
      if (!ext) {
        throw error('need WEBGL_depth_texture');
      }
  }

  /*
  * Create programs and render models from sources
  */
  initaliseData(){
    let loadMan = new LoaderManager(this, this.shaderList, this.modelList, this.textureList);
    loadMan.executeLoad();
    loadMan.waitLoad(this.setLoadData);
  }

  setLoadData(renderEngine, loadShaderList, loadModelList, loadTextureList){
    RenderEngine.setPrograms(renderEngine, loadShaderList);
    RenderEngine.setModels(renderEngine, loadModelList);
    RenderEngine.setTextures(renderEngine, loadTextureList);
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

  static setTextures(renderEngine, loadTextureList){
    for(let loadObj of loadTextureList){
      let texture = new Texture();
      texture.applyImage(loadObj.getImage());
      renderEngine.textures.push(texture);
      //renderEngine.textures.push(new ImageTexture(loadObj.getImage()));
    }

    renderEngine.textureSetted = true;
  }

  waitToSetData(callback){
    if(this.renderModelsSetted && this.textureSetted){
      console.log("Render Models Setted!");
      console.log("Textures Setted!");
      callback(this);
    } else {
      setTimeout(function() {
          this.waitToSetData(callback);
        }.bind(this), 50);
    }
  }

  addModel(model){this.models.push(model);}
  addRenderModel(renderModel){this.renderModels.push(renderModel)};

  getGl(){return this.gl;}
  getProgram(index) {return this.programs[index];}
  getProgramArray(){return this.programs}
  getModels(){return this.models;}
  getRenderModelsSetted(){return this.renderModelsSetted;}
  getRenderModel(index){return this.renderModels[index];}
  getRenderModelArray(){return this.renderModels;}
  getTexture(index) {return this.textures[index];}
  getTextureArray() {return this.textures;}
}
