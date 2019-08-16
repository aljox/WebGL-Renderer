//TODO: Rotation with vectors
class Matrix44f {
  constructor(matrix){
    matrix = this.checkLength(matrix);
    this.matrix = matrix;
  }

  static initIdentity(){
    return new this([1, 0, 0, 0,
                     0, 1, 0, 0,
                     0, 0, 1, 0,
                     0, 0, 0, 1]);
  }

  static initTranslation(tx, ty, tz){
    return new this([1, 0, 0, 0,
                     0, 1, 0, 0,
                     0, 0, 1, 0,
                     tx, ty, tz, 1]);
  }

  static initTranslationX(tx){
    return new this([1, 0, 0, 0,
                     0, 1, 0, 0,
                     0, 0, 1, 0,
                     tx, 0, 0, 1]);
  }

  static initTranslationY(ty){
    return new this([1, 0, 0, 0,
                     0, 1, 0, 0,
                     0, 0, 1, 0,
                     0, ty, 0, 1]);
  }

  static initTranslationZ(tz){
    return new this([1, 0, 0, 0,
                     0, 1, 0, 0,
                     0, 0, 1, 0,
                     0, 0, tz, 1]);
  }

  static initRotation(x, y, z){
    let rotX = Matrix44f.initRotationX(x);
    let rotY = Matrix44f.initRotationY(y);
    let rotZ = Matrix44f.initRotationZ(z);

    return Matrix44f.mulArray([rotZ, rotY, rotX]);
  }

  static initRotationX(angleRadians){
    let cos = Math.cos(angleRadians);
    let sin = Math.sin(angleRadians);

    return new this([1, 0, 0, 0,
                     0, cos, sin, 0,
                     0, -sin, cos, 0,
                     0, 0, 0, 1]);
  }

  static initRotationY(angleRadians){
    let cos = Math.cos(angleRadians);
    let sin = Math.sin(angleRadians);

    return new this([cos, 0, -sin, 0,
                     0, 1, 0, 0,
                     sin, 0, cos, 0,
                     0, 0, 0, 1]);
  }

  static initRotationZ(angleRadians){
    let cos = Math.cos(angleRadians);
    let sin = Math.sin(angleRadians);

    return new this([cos, sin, 0, 0,
                     -sin, cos, 0, 0,
                     0, 0, 1, 0,
                     0, 0, 0, 1]);
  }

  static initScale(sx, sy, sz){
    return new this([sx, 0, 0, 0,
                     0, sy, 0, 0,
                     0, 0, sz, 0,
                     0, 0, 0, 1]);
  }

  static initScaleX(sx){
    return new this([sx, 0, 0, 0,
                     0, 1, 0, 0,
                     0, 0, 1, 0,
                     0, 0, 0, 1]);
  }

  static initScaleY(sy){
    return new this([1, 0, 0, 0,
                     0, sy, 0, 0,
                     0, 0, 1, 0,
                     0, 0, 0, 1]);
  }

  static initScaleZ(sz){
    return new this([1, 0, 0, 0,
                     0, 1, 0, 0,
                     0, 0, sz, 0,
                     0, 0, 0, 1]);
  }

  static initOrtographich(left, right, bottom, top, near, far){
    let dX = right - left;
    let dY = top - bottom;
    let dZ = far - near;

    return new this([2 / dX, 0, 0, 0,
                     0, 2 / dY, 0, 0,
                     0, 0, -2 / dZ, 0,
                     -(right + left) / dX, -(top + bottom) / dY, -(far + near) / dZ, 1]);
  }

  static initPerspective(fov, aspectRatio, zNear, zFar){
    let top = Math.tan((fov * Math.PI) / 2) * zNear;
    let bottom = -top;
    let right = top * aspectRatio;
    let left = -right;

    let dX = right - left;
    let dY = top -bottom;
    let dZ = zFar - zNear;

    return new this([(2 * zNear) / dX, 0, 0, 0,
                      0, (2 * zNear) / dY, 0, 0,
                      (right + left) / dX, (top + bottom) / dY, -(zFar + zNear) / dZ, -1,
                      0, 0, -(2 * zFar * zNear) / dZ, 0]);
  }

  transponse(){
    let transponse = [];

    for(let y = 0; y < 4; y++){
      for(let x = 0; x < 4; x++){
        transponse[x * 4 + y] = this.matrix[y * 4 + x];
      }
    }

    this.matrix = transponse;
  }

  static transponse(M){
    let transponse = [];

    if(M instanceof Matrix44f){
      M = M.getMatrix();
    }

    for(let y = 0; y < 4; y++){
      for(let x = 0; x < 4; x++){
        transponse[x * 4 + y] = M[y * 4 + x];
      }
    }

    return new this(transponse);
  }

  //Property of: Andrew Ippoliti --> http://blog.acipo.com/matrix-inversion-in-javascript/
  static inverse(M){
      // I use Guassian Elimination to calculate the inverse:
      // (1) 'augment' the matrix (left) by the identity (on the right)
      // (2) Turn the matrix on the left into the identity by elemetry row ops
      // (3) The matrix on the right is the inverse (was the identity matrix)
      // There are 3 elemtary row ops: (I combine b and c in my code)
      // (a) Swap 2 rows
      // (b) Multiply a row by a scalar
      // (c) Add 2 rows

      if(M instanceof Matrix44f){
        M = M.getMatrix();
      }

      //if the matrix isn't square: exit (error)
      if(M.length / 4 != 4){return;}

      M = [M.slice(0, 4), M.slice(4, 8), M.slice(8, 12), M.slice(12, 16)];

      //create the identity matrix (I), and a copy (C) of the original
      let i=0, ii=0, j=0, dim=M.length, e=0, t=0;
      let I = [], C = [];
      for(i=0; i<dim; i+=1){
          I[I.length]=[];
          C[C.length]=[];

          for(j=0; j<dim; j+=1){
              if(i==j){ I[i][j] = 1; }
              else{ I[i][j] = 0; }

              C[i][j] = M[i][j];
          }
      }

      for(i=0; i<dim; i+=1){
          e = C[i][i];

          if(e==0){
              for(ii=i+1; ii<dim; ii+=1){
                  if(C[ii][i] != 0){
                      for(j=0; j<dim; j++){
                          e = C[i][j];
                          C[i][j] = C[ii][j];
                          C[ii][j] = e;
                          e = I[i][j];
                          I[i][j] = I[ii][j];
                          I[ii][j] = e;
                        }
                      break;
                  }
              }
              e = C[i][i];

              if(e==0){return}
          }

          for(j=0; j<dim; j++){
              C[i][j] = C[i][j]/e;
              I[i][j] = I[i][j]/e;
          }

          for(ii=0; ii<dim; ii++){
              if(ii==i){continue;}

              e = C[ii][i];

              for(j=0; j<dim; j++){
                  C[ii][j] -= e*C[i][j];
                  I[ii][j] -= e*I[i][j];
              }
          }
      }

      //matrix I is the inverse:
      return new this(I[0].concat(I[1].concat(I[2].concat(I[3]))));
  }

  //a * this.matrix
  mul(a){
    let mul = Matrix44f.initScale(2, 4, 5);

    for(let y = 0; y < 4; y++){
      for(let x = 0; x < 4; x++){
        mul.setElement(x, y, a.getElement(0, y) * this.matrix[0 * 4 + x] +
						                 a.getElement(1, y) * this.matrix[1 * 4 + x] +
                  					 a.getElement(2, y) * this.matrix[2 * 4 + x] +
                  					 a.getElement(3, y) * this.matrix[3 * 4 + x]);
      }
    }

    this.matrix = mul.getMatrix();
  }

  //a * b
  static mul(a, b){
    let mul = Matrix44f.initIdentity();

    for(let y = 0; y < 4; y++){
      for(let x = 0; x < 4; x++){
        mul.setElement(x, y, a.getElement(0, y) * b.getElement(x, 0) +
						                 a.getElement(1, y) * b.getElement(x, 1) +
                  					 a.getElement(2, y) * b.getElement(x, 2) +
                  					 a.getElement(3, y) * b.getElement(x, 3));
      }
    }

    return mul;
  }

  //matrix * vec
  //Matrix is treated as 3x3 matrix!
  static mulVector(matrix, vec) {
    let multVector = new Vec3f(0, 0, 0);
    multVector.setX(matrix.getElement(0, 0) * vec.getX() +
                    matrix.getElement(1, 0) * vec.getY() +
                    matrix.getElement(2, 0) * vec.getZ());

    multVector.setY(matrix.getElement(0, 1) * vec.getX() +
                    matrix.getElement(1, 1) * vec.getY() +
                    matrix.getElement(2, 1) * vec.getZ());

    multVector.setZ(matrix.getElement(0, 2) * vec.getX() +
                    matrix.getElement(1, 2) * vec.getY() +
                    matrix.getElement(2, 2) * vec.getZ());

    return multVector;
  }

  //arr[0] * arr[1]...
  static mulArray(arr){
    let multMatrix = Matrix44f.initIdentity();
    for(let i = arr.length - 1; i >= 0; i--){
      multMatrix.mul(arr[i]);
    }

    return multMatrix;
  }

  print(){
    console.log(this.matrix);
  }

  setMatrix(matrix){
    matrix = this.checkLength(matrix);
    this.matrix = matrix;
  }

  setElement(x, y, value){
    this.matrix[y * 4 + x] = value;
  }

  getMatrix(){return this.matrix;}
  getElement(x, y){return this.matrix[y * 4 + x]}

  checkLength(matrix){
    if(matrix.length != 16){
        throw Error("Matrix44f incorrect constructor parameter - array length not correct");
        matrix = undefined;
    }
    return matrix;
  }
}
