let shaderList = ["basicVertex.vertex", "basicFragment.fragment"];
let modelList = [];

window.onload = function(){
  let rendereEngine = new RenderEngine(shaderList, modelList);
  rendereEngine.initialise();
}
