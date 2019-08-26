/*
* Collection of buffers
* Stores all buffers object contains
* Combines buffers into one buffer for better performance
*/
class VertexArray{
  /*
  * vertexBufferArray -> Array of Buffer
  * indexBuffer -> buffer for indexing
  */
  constructor(vertexBufferArray, indexBuffer){
    this.vertexBufferArray = vertexBufferArray;
    this.indexBuffer = indexBuffer;
    this.combinedBuffer = null;

    this.combineBuffers();
  }

  /*
  * Combine buffers into one buffer
  * Input: vertexBufferArray
  * Output: combinedBuffer
  */
  combineBuffers(){
    if(!this.canCombine()) throw ("Cannot combine - buffer sizes or buffer data not compatible.");

    let buffer = [];

    // Combine buffers
    for(let numIteration = 0; numIteration < this.vertexBufferArray[0].numOfVertex(); numIteration++){
      for(let i = 0; i < this.vertexBufferArray.length; i++){
        let bufferData = this.vertexBufferArray[i].getAttributeBuffer().getData();
        let numOfComponents = this.vertexBufferArray[i].getNumOfComponents();
        buffer.push(...bufferData.slice(numOfComponents * numIteration, numOfComponents * numIteration + numOfComponents));
      }
    }

    let stride = this.vertexBufferArray[0].getStride();

    for(let i = 1; i < this.vertexBufferArray.length; i++){
      //Compute sum of stride
      stride += this.vertexBufferArray[i].getStride();

      //setOffsets
      this.vertexBufferArray[i].setOffset(this.vertexBufferArray[i - 1].getOffset() + this.vertexBufferArray[i - 1].getStride());
    }

    //setStride
    for(let i = 0; i < this.vertexBufferArray.length; i++){
      this.vertexBufferArray[i].setStride(stride);
    }

    let infoSetter = this.vertexBufferArray[0].getAttributeBuffer();
    this.combinedBuffer = new VertexBuffer(buffer, infoSetter.getUsage());
  }

  /*
  * Buffer can be combined only if all buffers have same data
  * type and if they share same value of numOfVertex
  */
  canCombine(){
    let numOfVertex = this.vertexBufferArray[0].numOfVertex();
    let dataType = this.vertexBufferArray[0].getTypeOfValue();
    for(const vertexBuffer of this.vertexBufferArray){
      if(numOfVertex != vertexBuffer.numOfVertex() || dataType != vertexBuffer.getTypeOfValue()) return false;
    }
    return true;
  }

  addVertexbuffer(buffer){
    this.vertexBufferArray.push(buffer);
    this.combineBuffers();
  }

  removeVertexBuffer(buffer){
    for(let i = 0; i < this.vertexBufferArray.length; i++){
      if(this.vertexBufferArray[i] === buffer){
        this.vertexBufferArray.splice(i, 1);
      }
    }

    this.combineBuffers();
  }

  removeVertexBufferIndex(i){
    this.vertexBufferArray.splice(i, 1);
    this.combineBuffers();
  }

  setVertexBuffer(index, buffer){
    this.vertexBufferArray[i] = buffer;
    this.combineBuffers();
  }

  getElemetVertexBufferArray(i){return this.vertexBufferArray[i];}
  getVertexBufferArray(){return this.vertexBufferArray;}
  getIndexBuffer(){return this.indexBuffer;}
  getCombinedBuffer(){return this.combinedBuffer;}
}
