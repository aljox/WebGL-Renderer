let shaderList = ["basicVertex.vertex", "basicFragment.fragment"];
let modelList = [];

let loadManager = new LoaderManager(shaderList, modelList);

window.onload = function(){
  loadManager.executeLoad()
  loadManager.waitLoad(printData);
}

function printData(loadShaderList, loadModelList){
  console.log(loadShaderList);
  console.log(loadModelList);
}
