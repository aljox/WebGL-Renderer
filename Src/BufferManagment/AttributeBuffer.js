//Data must be passed in correct array cast!
class AttributeBuffer{
  constructor(type, data, usage){
    this.type = type;
    this.data = data;
    this.usage = usage;
    this.buffer = gl.createBuffer();
    this.setBuffer();
  }

  bind(){
    gl.bindBuffer(gl[this.type], this.buffer);
  }

  setBuffer(){
    this.bind();
    gl.bufferData(gl[this.type], this.data, gl[this.usage]);
  }

  setData(data){this.data = data;}
  setType(type){this.type = type;}
  setUsage(usage){this.usage = usage;}

  getData(){return this.data;}
  getType(){return this.type;}
  getUsage(){return this.usage;}
  getBuffer(){return this.buffer;}
}

class IndexBuffer extends AttributeBuffer{
  constructor(data, usage){
    super("ELEMENT_ARRAY_BUFFER", new Uint16Array(data), usage);
  }
}

class VertexBuffer extends AttributeBuffer{
  constructor(data, usage){
    super("ARRAY_BUFFER", new Float32Array(data), usage);
  }
}
