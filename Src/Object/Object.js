class Object {
  constructor(){
    this.visible = true;
    this.type = "";

    // Local position, rotation, scale
    this.position = new Vec3f(0.0, 0.0, 0.0);
    this.rotation = new Vec3f(0, 0, 0);
    this.scale = new Vec3f(1, 1, 1);

    // Outside transformations
    this.matrix = Matrix44f.initIdentity();

    // Combined local and outside transformation
    this.modelMatrix = Matrix44f.initIdentity();
    this.modelMatrixUpdate = false;

    // TODO: Object uniform manipulation
    this.objectUniforms = [];
  }

  setVisible(visible){
    if(visible != this.visible){
      this.visible = visible;
    }
  }

  setType(type){
    if(type != this.type){
      this.type = type;
    }
  }

  setPosition(position){
    if(!position.equals(this.position)){
      this.position = position;
      this.modelMatrixUpdate = true;
    }
  }

  setPositionX(cordX){
    if(cordX != this.position.getX()){
      this.position.setX(cordX);
      this.modelMatrixUpdate = true;
    }
  }

  setPositionY(cordY){
    if(cordY != this.position.getY()){
      this.position.setY(cordY);
      this.modelMatrixUpdate = true;
    }
  }

  setPositionZ(cordZ){
    if(cordZ != this.position.getZ()){
      this.position.setZ(cordZ);
      this.modelMatrixUpdate = true;
    }
  }

  setRotation(rot){
    if(!rot.equals(this.rotation)){
      this.rotation = rot;
      this.modelMatrixUpdate = true;
    }
  }

  setRotationX(rotX){
    if(rotX != this.rotation.getX()){
      this.rotation.setX(rotX);
      this.modelMatrixUpdate = true;
    }
  }

  setRotationY(rotY){
    if(rotY != this.rotation.getY()){
      this.rotation.setY(rotY);
      this.modelMatrixUpdate = true;
    }
  }

  setRotationZ(rotZ){
    if(rotZ != this.rotation.getZ()){
      this.rotation.setZ(rotZ);
      this.modelMatrixUpdate = true;
    }
  }

  setScale(scale){
    if(scale != this.scale){
      this.scale = scale;
      this.modelMatrixUpdate = true;
    }
  }

  setScaleX(scaleX){
    if(scaleX != this.scale.getX()){
      this.scale.getX() = scaleX;
      this.modelMatrixUpdate = true;
    }
  }

  setScaleY(scaleY){
    if(scaleY != this.scale.getY()){
      this.scale.getY() = scaleY;
      this.modelMatrixUpdate = true;
    }
  }

  setScaleX(scaleZ){
    if(scaleZ != this.scale.getZ()){
      this.scale.getZ() = scaleZ;
      this.modelMatrixUpdate = true;
    }
  }

  applyTransformation(trans){
    this.matrix = Matrix44f.mul(trans, this.matrix);
    this.modelMatrixUpdate = true;
  }

  /*
  * Build model matrix from local position, rotation, scale and outside transfformations
  */
  updateModelMatrix(){
    if(this.modelMatrixUpdate === false) return;

    let translation = Matrix44f.initTranslation(this.position.getX(), this.position.getY(), this.position.getZ());
    let rotation = Matrix44f.initRotation(MathExt.degreeToRadians(this.rotation.getX()),
                                          MathExt.degreeToRadians(this.rotation.getY()),
                                          MathExt.degreeToRadians(this.rotation.getZ()));


    let scale = Matrix44f.initScale(this.scale.getX(), this.scale.getY(), this.scale.getZ());

    this.modelMatrix = Matrix44f.mulArray([this.matrix, scale, rotation, translation]);
    this.modelMatrixUpdate === false;
  }

  addUniform(uniform){
    if(!uniform instanceof Uniform) throw Error("Passed parameter is not uniform!");
    this.objectUniforms.push(uniform);
  }

  clearUniforms() {this.objectUniforms = [];}

  getType() {return this.type;}
  getVisible(){return this.visible;}
  getPosition(){return this.position;}
  getRotation(){return this.rotation;}
  getModelMatrix(){return this.modelMatrix;}
  getModelMatrixUpdate(){return this.modelMatrixUpdate;}
  getUniforms(){return this.objectUniforms;}
}
