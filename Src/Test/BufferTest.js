let shaderList = ["basicVertex.vertex", "basicFragment.fragment"];
let modelList = ["Test.obj"];

window.onload = function(){
  let rendereEngine = new RenderEngine(shaderList, modelList);
  rendereEngine.initialise();

  setBuffers();
}

function setBuffers(){
  let bufferPos = [
    -1.0, -0.5,
    -0.5, 0.5,
    0.0, -0.5,
    0.0, -0.5,
    0.5, 0.5,
    1.0, -0.5,
  ];
  let positionBuffer = new VertexBuffer(bufferPos, "STATIC_DRAW");

  let bufferColour = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
  ];
  let colourBuffer = new VertexBuffer(bufferColour, "STATIC_DRAW");

  let indexBuf = [
      0, 1, 2,
      3, 4, 5,
    ];
  let indexBuffer = new IndexBuffer(indexBuf, "STATIC_DRAW");

  let bufferArray = [new Buffer("a_position", positionBuffer, 2, "FLOAT", false), new Buffer("a_colour", colourBuffer, 4, "FLOAT", false)];
  vertArray = new VertexArray(bufferArray, indexBuffer);
  vertArray.combineBuffers();
}
