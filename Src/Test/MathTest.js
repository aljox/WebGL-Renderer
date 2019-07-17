window.onload = function(){
  let matrix = [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 4, 0,
                1, 2, 1, 5];

  matrix = new Matrix44f(matrix);

  matrixInverse = Matrix44f.inverse(matrix);

  matrixMul = Matrix44f.mul(matrix, Matrix44f.initIdentity());
  matrixMul.print();

  matrix.mul(Matrix44f.initIdentity());
  matrix.print();
}
