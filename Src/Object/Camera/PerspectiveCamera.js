class PerspectiveCamera extends Camera {
  constructor(fov, zNear, zFar){
    super();

    this.type = "Perspective_Camera";

    // Fov - in Degrees
    this.fov = fov;
    this.aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.zNear = zNear;
    this.zFar = zFar;

    this.buildPerspectiveMatrix();
  }

  buildPerspectiveMatrix(){
    this.projectionMatrix = Matrix44f.initPerspective(MathExt.degreeToRadians(this.fov), this.aspectRatio,
                                                      this.zNear, this.zFar);
  }

  updateAspectRatio() {
    this.aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
  }

  setFov(fov) {this.fov = fov;}
  setZNear(zNear) {this.zNear = zNear;}
  setZFar(zFar) {this.zFar = zFar;}

  getFov() {return this.fov;}
  getAspectRatio() {return this.aspectRatio;}
  getZNear() {return this.zNear;}
  getZFar() {return this.zFar;}
}
