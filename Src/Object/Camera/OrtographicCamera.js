class OrtographicCamera extends Camera {
  constructor(left, right, bottom, top, near, far){
    super();

    this.type = "Ortographic_Camera";

    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
    this.near = near;
    this.far = far;

    this.buildOrtographicMatrix();
  }

  buildOrtographicMatrix(){
    this.projectionMatrix = Matrix44f.initOrtographich(this.left, this.right, this.bottom,
                                                        this.top, this.near, this.far);
  }

  setLeft(left) {this.left = left;}
  setRight(right) {this.right = right;}
  setBottom(bottom) {this.bottom = bottom;}
  setTop(top) {this.top = top;}
  setNear(near) {this.near = near;}
  setFar(far) {this.far = far;}

  getLeft() {return this.left;}
  getRight() {return this.right;}
  getBottom() {return this.bottom;}
  getTop() {return this.top;}
  getNear() {return this.near;}
  getFar() {return this.far;}
}
