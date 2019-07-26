let shaderList = ["basicVertex.vertex", "basicFragment.fragment"];
let modelList = ["Test.obj"];

window.onload = function(){
  let renderEngine = new RenderEngine(shaderList, modelList);
  renderEngine.initialise();
  renderEngine.waitSetRenderModels(test);
}

function test(renderEngine){
  console.log(renderEngine.getRenderModels());
}
