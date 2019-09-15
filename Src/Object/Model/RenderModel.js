class RenderModel extends Object {
  constructor(vertexArray){
    super();
    this.type = "Render_Model";
    this.material = Material.initWhite();
    this.texture = null;
    this.vertexArray = vertexArray;
  }

  /*
  * Build RenderModel from Model
  * Input: Model model
  * Output: RenderModel renderModel
  */
  static buildFromModel(model){
    let modelData = model.getModelData();
    let modelIndexDataSpec = model.getIndexBufferSpec();
    let modelIndexData = model.getIndexBuffer();

    // Set index buffer
    let indexBuffer;
    if(modelIndexDataSpec === null) indexBuffer = null;
    else if(modelIndexDataSpec != "POLYGON_MATCH"){
      RenderModel.buildNewBufferToIndex(modelData);
    }

    if(indexBuffer !== null){
      for(let i = 0; i < modelIndexData.length; i++){
        modelIndexData[i]--;
      }
      indexBuffer = new IndexBuffer(modelIndexData, "STATIC_DRAW");
    }

    // Build vertexArray
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
                                      NUM_OF_COMPONENTS_PER_VERT_TEXTURE, "FLOAT", false));
              break;
              case 2:
                buffers.push(new Buffer("a_normal", new VertexBuffer(modelData[i], "STATIC_DRAW"),
                                        NUM_OF_COMPONENTS_PER_VERT, "FLOAT", false));
                break;
          default:
            throw Error("Unsupported obj reading buffer.");

        }
      }
    }

    return new this(new VertexArray(buffers, indexBuffer));
  }

  // TODO: complete function - not urgent
  // Build index buffer from data
  static buildNewBufferToIndex(modelData){
    console.log("Not finished.");
  }

  buildMaterialUniforms() {
    this.objectUniforms.push(new Uniform("material.s_ambient", "3f", this.material.getAmbient().toArray()));
    this.objectUniforms.push(new Uniform("material.s_diffuse", "3f", this.material.getDiffuse().toArray()));
    this.objectUniforms.push(new Uniform("material.s_specular", "3f", this.material.getSpecular().toArray()));
    this.objectUniforms.push(new Uniform("material.s_shininess", "1f", this.material.getShininess()));
  }

  addToVertexArray(buffer){
    this.vertexArray.addVertexbuffer(buffer);
  }

  setMaterial(material) {this.material = material;}
  setTexture(texture) {
    this.texture = texture;
    this.type = "Render_Model_Texture";
  }

  getMaterial() {return this.material;}
  getTexture() {return this.texture;}
  getVertexArray(){return this.vertexArray;}
  getNewInstance(){return new RenderModel(this.vertexArray);}
}
