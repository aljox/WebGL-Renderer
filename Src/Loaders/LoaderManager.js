class LoaderManager {
  constructor(shaderList, modelList){
    this.shaderList = shaderList;
    this.modelList = modelList;
    this.loadShaderObj = [];
    this.loadModelObj = [];
  }

  //Create appropriate loader object for each file url in loadList
  //Load each file
  executeLoad(){
    this.loadShaders();
    this.loadModels();
  }

  loadShaders(){
    for (let url of this.shaderList){
      let type = this.setType(url);

      switch(type){
        case "VERTEX_SHADER":
          this.loadShaderObj.push(new VertexShaderLoader("/res/Shaders/" + url));
          break;
        case "FRAGMENT_SHADER":
          this.loadShaderObj.push(new FragmentShaderLoader("/res/Shaders/" + url));
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
        this.loadModelObj.push(new ModelLoader("/res/Shaders/" + url));
      } else {
        throw Error("Unknown model file type.");
      }
    }

    for(let loadObj of this.loadModelObj){
      loadObj.load();
    }
  }

  //Set type of file
  setType(url){
    if(url.search(".vertex") != -1){return "VERTEX_SHADER";}
    if(url.search(".fragment") != -1){return "FRAGMENT_SHADER";}
    if(url.search(".obj") != -1){return "OBJ_MODEL";}

    return "UNKNOWN";
  }

  //Check if all files from loadObject have been loaded
  checkLoad(){
    let loadObjects = loadShaderObj.concat(loadModelObj);

    for(let loadObj of loadObjects){
      if(loadObj.getLoadFlag() === false){
        return false;
      }
    }
    return true;
  }

  //Waits until every file is loaded
  waitLoad(callback){
    if(this.checkLoad()){
      console.log("Files loaded!");
      callback(this.loadShaderObj, this.loadModelObj);
    } else {
      setTimeout(function() {
          this.waitLoad(callback);
        }.bind(this), 50);
    }
  }

  setShaderList(shaderList){this.shaderList = shaderList;}
  setModelList(modelList){this.modelList = modelList;}

  getShaderList(){return this.shaderList;}
  getModelList(){return this.modelList;}
  getLoadShaderObj(){return this.loadShaderObj;}
  getLoadModelObj(){return this.loadModelObj;}
}
