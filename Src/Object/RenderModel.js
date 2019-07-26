class RenderModel extends Object {
  constructor(vertexArray){
    super();
    this.vertexArray = vertexArray;
  }

  static buildFromModel(model){
    let modelData = model.getModelData();
    let modelIndexDataSpec = model.getIndexBufferSpec();
    let modelIndexData = model.getIndexBuffer();

    //Set indexBuffer
    let indexBuffer;

    if(modelIndexDataSpec === null) indexBuffer = null;
    else if(modelIndexDataSpec != "POLYGON_MATCH"){
      RenderModel.buildNewBufferToIndex(modelData);
    }

    indexBuffer = modelIndexData;

    //Set array of vertexBuffer
    let buffers = [];

    for(let i = 0; i < modelData.length; i++){
      if(modelData[i].length != 0){
        switch (i) {
          case 0:
            buffers.push(new Buffer("a_position", new VertexBuffer(modelData[i], "STATIC_DRAW"),
                                    NUM_OF_COMPONENTS_PER_VERT, "FLOAT", false));
            break;
            case 1:
              buffers.push(new Buffer("a_textureCord", new VertexBuffer(modelData[i], "STATIC_DRAW"),
                                      NUM_OF_COMPONENTS_PER_VERT, "FLOAT", false));
              break;
              case 2:
                buffers.push(new Buffer("a_normals", new VertexBuffer(modelData[i], "STATIC_DRAW"),
                                        NUM_OF_COMPONENTS_PER_VERT, "FLOAT", false));
                break;
          default:
            throw Error("Unsupported obj reading buffer.");

        }
      }
    }

    return new this(new VertexArray(buffers, indexBuffer));
  }

  //TODO: complete function - not urgent
  static buildNewBufferToIndex(modelData){
    console.log("Not finished.");
  }
}
