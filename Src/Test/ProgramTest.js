let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl")
if(!gl){
  throw Error("Browser might not support WebGl");
}

let shaderList = ["basicVertex.vertex", "basicFragment.fragment"];
let modelList = [];

window.onload = function(){
  let loadManager = new LoaderManager(shaderList, modelList);
  loadManager.executeLoad()
  loadManager.waitLoad(printData);
}

function printData(loadShaderList, loadModelList){
  let vertexShader = new Shader(loadShaderList[0]);
  let fragmentShader = new Shader(loadShaderList[1]);
  let program = new Program(vertexShader, fragmentShader);
}
