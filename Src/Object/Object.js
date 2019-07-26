class Object {
  constructor(){
    this.visible = true;

    //local position, rotation, scale
    this.position = new Vec3f(0.0, 0.0, 0.0);
    this.rotation = new Vec3f(0, 0, 0);
    this.scale = new Vec3f(0, 0, 0);

    //matrix - stores outside transformations
    this.matrix = Matrix44f.initIdentity();

    //combined local and outside transformations --> set object in world
    this.modelMatrix = Matrix44f.initIdentity();
    this.modelMatrixUpdate = false;

    //TODO: uniform manipulation
    this.objectUniforms = [];
  }

  setVisible(visible){
    if(visible != this.visible){
      this.visible = visible;
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
    if(scaleX != this.scaleX){
      this.scaleX = scaleX;
      this.modelMatrixUpdate = true;
    }
  }

  setScaleY(scaleY){
    if(scaleY != this.scaleY){
      this.scaleY = scaleY;
      this.modelMatrixUpdate = true;
    }
  }

  setScaleX(scaleZ){
    if(scaleZ != this.scaleZ){
      this.scaleZ = scaleZ;
      this.modelMatrixUpdate = true;
    }
  }

  applyTransformation(trans){
    this.matrix = Matrix44f.multiply(trans, this.matrix);
  }

  updateModelMatrix(){
    if(this.modelMatrixUpdate === false) return;

    let position = Matrix44f.initTranslation(this.position.getX(), this.position.getY(), this.position.getZ());
    let rotation = Matrix44f.initRotation(MathExt.degreeToRadians(this.rotation.getX()),
                                          MathExt.degreeToRadians(this.rotation.getY()),
                                          MathExt.degreeToRadians(this.rotation.getZ()));
    let scale = Matrix44f.initScale(this.scale.getX(), this.scale.getY(), this.scale.getZ());

    this.modelMatrix = Matrix44f.mulArray([this.matrix, position, rotation, scale]);
  }

  getVisible(){return this.visible;}
  getPostion(){return this.position;}
  getRotation(){return this.rotation;}
  getModelMatrix(){return this.modelMatrix;}
  getModelMatrixUpdate(){return this.modelMatrixUpdate;}
  getUniforms(){return this.objectUniforms;}
}
