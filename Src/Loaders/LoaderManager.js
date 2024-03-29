class LoaderManager {
  constructor(renderEngine, shaderList, modelList, textureList){
    this.renderEngine = renderEngine;

    this.shaderList = shaderList;
    this.modelList = modelList;
    this.textureList = textureList;

    this.loadShaderObj = [];
    this.loadModelObj = [];
    this.loadTextureObj = [];
  }

  /*
  *Create loader object for each file url in loadList
  *Load each file
  */
  executeLoad(){
    this.loadShaders();
    this.loadModels();
    this.loadTextures();
  }

  loadShaders(){
    for (let url of this.shaderList){
      let type = this.setType(url);

      switch(type){
        case "VERTEX_SHADER":
          this.loadShaderObj.push(new VertexShaderLoader("/Lib/Shaders/" + url));
          break;
        case "FRAGMENT_SHADER":
          this.loadShaderObj.push(new FragmentShaderLoader("/Lib/Shaders/" + url));
          break;
        default:
          throw Error("Unknown shader file type.");
          break;
      }
    }

    for(let loadObj of this.loadShaderObj){
      loadObj.load();
    }
  }

  loadModels(){
    for (let url of this.modelList){
      let type = this.setType(url);
      if(type === "OBJ_MODEL"){
        this.loadModelObj.push(new ModelLoader("/Lib/Models/" + url));
      } else {
        throw Error("Unknown model file type.");
      }
    }

    for(let loadObj of this.loadModelObj){
      loadObj.load();
    }
  }

  loadTextures(){
    for(let url of this.textureList){
      let type = this.setType(url);
      if(type === "TEXTURE") {
        this.loadTextureObj.push(new TextureLoader(type, "/Lib/Textures/" + url));
      } else {
        throw Error("Unknown texture file type.");
      }
    }

    for(let loadObj of this.loadTextureObj){
      loadObj.load();
    }
  }

  //Set type of file
  setType(url){
    if(url.search(".vertex") != -1) {return "VERTEX_SHADER";}
    if(url.search(".fragment") != -1) {return "FRAGMENT_SHADER";}
    if(url.search(".obj") != -1) {return "OBJ_MODEL";}
    if(url.search(".jpg") != -1 || url.search(".png") != -1) {return "TEXTURE";}

    return "UNKNOWN";
  }

  //Check if all files from loadObject have been loaded
  checkLoad(){
    let loadObjects = this.loadShaderObj.concat(this.loadModelObj.concat(this.loadTextureObj));

    for(let loadObj of loadObjects){
      if(loadObj.getLoaded() === false){
        return false;
      }
    }
    
    return true;
  }

  //Waits until every file is loaded
  waitLoad(callback){
    if(this.checkLoad()){
      console.log("Files loaded!");
      callback(this.renderEngine, this.loadShaderObj, this.loadModelObj, this.loadTextureObj);
    } else {
      setTimeout(function() {
          this.waitLoad(callback);
        }.bind(this), 100);
    }
  }

  setShaderList(shaderList){this.shaderList = shaderList;}
  setModelList(modelList){this.modelList = modelList;}

  getShaderList(){return this.shaderList;}
  getModelList(){return this.modelList;}
  getLoadShaderObj(){return this.loadShaderObj;}
  getLoadModelObj(){return this.loadModelObj;}
}
