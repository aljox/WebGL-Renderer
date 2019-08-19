class Camera extends Object{
  constructor(){
    super();
    
    this.type = "Camera";
    // View matrix is acctualy model matrix in Object class!
    this.viewMatrixInverse = Matrix44f.initIdentity();
    this.projectionMatrix = Matrix44f.initIdentity();

    this.up = new Vec3f(0, 1, 0);
  }

  buildViewMatrixInverse(){
    this.updateModelMatrix();
    this.viewMatrixInverse = Matrix44f.inverse(this.modelMatrix);
  }

  // Target - instance of Object
  lookAt(target){
    this.updateModelMatrix();

    let position = new Vec3f(this.modelMatrix.getElement(0, 3),
                              this.modelMatrix.getElement(1, 3),
                               this.modelMatrix.getElement(2, 3));

    let zAxis = Vec3f.normalise(position.subVec(target.getPostion()));
    let xAxis = Vec3f.normalise(this.up.crossProduct(zAxis));
    let yAxis = Vec3f.normalise(zAxis.crossProduct(xAxis));

    let viewMatrix = new Matrix44f([xAxis.getX(), xAxis.getY(), xAxis.getZ(), 0,
                                    yAxis.getX(), yAxis.getY(), yAxis.getZ(), 0,
                                    zAxis.getX(), zAxis.getY(), zAxis.getZ(), 0,
                                    position.getX(), position.getY(), position.getZ(), 1]);
    this.viewMatrixInverse = Matrix44f.inverse(viewMatrix);
  }

  getViewMatrixInverse() {return this.viewMatrixInverse;}
  getProjectionMatrix() {return this.projectionMatrix;}
  getUp() {return this.up;}
}
