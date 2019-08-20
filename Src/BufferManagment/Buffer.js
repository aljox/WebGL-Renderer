/*
* WebGl buffer specification
*/
class Buffer{
  /*
  * name -> name of buffer in shader; Must be in format "a_..."
  * attributeBuffer -> AttributeBuffer
  * numOfComponents -> number of components per vector
  * typeOfValue -> webGl type of value
  * normalisation -> boolean
  */
  constructor(name, attributeBuffer, numOfComponents, typeOfValue, normalisation){
    this.name = name;
    this.attributeBuffer = attributeBuffer;
    this.numOfComponents = numOfComponents;
    this.typeOfValue = typeOfValue;
    this.normalisation = normalisation;
    this.stride = this.setStrideAuto();
    this.offset = 0;
  }

  setStrideAuto(){
    let sizeOfType;
    switch (this.typeOfValue) {
      case "FLOAT":
          sizeOfType = 4;
        break;
      case "INT":
          sizeOfType = 4;
        break;
      case "UNSIGNED_BYTE":
          sizeOfType = 1;
          break;
      default:
        sizeOfType = 0;
        throw ("Inccorect type of attributeBuffer - failed at setStrideAuto!");
    }

    return sizeOfType * this.numOfComponents;
  }

  numOfVertex(){
    return this.attributeBuffer.getData().length / this.numOfComponents;
  }

  setAttributeBuffer(attributeBuffer){this.attributeBuffer = attributeBuffer;}
  setTypeOfValue(typeOfValue){this.typeOfValue = typeOfValue;}
  setNormalisation(normalisation){this.normalisation = normalisation;}
  setStride(stride){this.stride = stride;}
  setOffset(offset){this.offset = offset;}

  getName(){return this.name;}
  getNumOfComponents(){return this.numOfComponents;}
  getAttributeBuffer(){return this.attributeBuffer;}
  getTypeOfValue(){return this.typeOfValue;}
  getNormalisation(){return this.normalisation;}
  getStride(){return this.stride;}
  getOffset(){return this.offset;}
}
