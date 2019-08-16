class Uniform {
  constructor(name, property, value){
    this.name = name;
    this.property = property;
    this.value = value;
  }

  setValue(value){this.value = value;}

  getName(){return this.name;}
  getProperty(){return this.property;}
  getValue(){return this.value;}
}

//Matrix is Matrix33 or Matrix44 object
class UniformMatrix extends Uniform{
  constructor(name, property, matrix){
    super(name, "Matrix" + property, new Float32Array(matrix.getMatrix()));
    this.matrix = matrix;
  }

  setMatrix(matrix){
    this.matrix = matrix;
    super.setValue(new Float32Array(matrix.getMatrix()));
  }

  getMatrix(){return this.matrix;}
}

//TODO: Update to 3D

//Matrix is array of 5 Matrix33 or Matrix44 loadObjects
//First_Element: scaleX
//Second_Element: scaleY
//Third_Element: translation x
//Fouth_Element: translation y
//Fifth_Element: rotation
class ObjectManipulationUniform extends Uniform{
  constructor(name, property, matrixArray){
    let infoMatrix = matrixArray[0];
    let matrix;
    if(infoMatrix instanceof Matrix33){
      matrix = Matrix33.multiplyArray(matrixArray);
      super(name, "Matrix" + property, new Float32Array(matrix.getMatrix()));
    } else if(infoMatrix instanceof Matrix44){
      matrix = Matrix44.multiplyArray(matrixArray);
      super(name, "Matrix" + property, new Float32Array(matrix.getMatrix()));
    }

    this.matrixArray = matrixArray;
    this.matrix = matrix;
  }

  setMatrixArray(matrixArray){
    let infoMatrix = matrixArray[0];
    let matrix;

    if(infoMatrix instanceof Matrix33){
      matrix = Matrix33.multiplyArray(matrixArray);
    } else if(infoMatrix instanceof Matrix44){
      matrix = Matrix44.multiplyArray(matrixArray);
    }

    this.matrixArray = matrixArray;
    this.matrix = matrix;
    super.setValue(new Float32Array(matrix.getMatrix()));
  }

  setMatrixArrayElement(matrix, name){

    switch(name){
      case "SCALEX":
        this.matrixArray[0] = matrix;
        break;
      case "SCALEY":
        this.matrixArray[1] = matrix;
        break;
      case "TRANSLATEX":
        this.matrixArray[2] = matrix;
        break;
      case "TRANSLATEY":
        this.matrixArray[3] = matrix;
        break;
      case "ROTATION":
        this.matrixArray[4] = matrix;
        break;
      default:
        throw Error("Unknown name of manipulation matrix array.");
        break;
    }
    this.setMatrixArray(this.matrixArray);
  }

  getMatrixArray(){return this.matrixArray;}
  getMatrixArrayElemetn(i){return this.matrixArray[i];}
  getMatrix(){return this.matrix;}
}
