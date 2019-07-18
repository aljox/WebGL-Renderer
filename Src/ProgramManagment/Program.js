class Program {
  constructor(gl, vertexShader, fragmentShader){
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.attributeLocations = {};
    this.uniformLocations = {};
    this.program = this.createAndCompileProgram();

    this.setLocations();
  }

  //Input: param1: vertexArray
  //       param2: uniformArray
  setProgramParameters(vertexArray, uniformArray){
    this.setAttributes(vertexArray);
    this.setUniforms(uniformArray);
  }

  //Set attributes according to specified locations - names of attributes must be in sync with names of locations.
  //Example:
  //-Name of location: a_nameLoc
  //-Name of attribute: a_name
  setAttributes(vertexArray){
    let attribLocationNames = this.vertexShader.getAttributeLocationNames().concat(this.fragmentShader.getAttributeLocationNames());

    let vertexBufferArray = vertexArray.getVertexBufferArray();
    for(let name of attribLocationNames){
      let index = this.findIndexVertex(name, vertexBufferArray);
      if(index === -1) throw Error("Property " + name + " not found in vertexArray object");

      this.gl.enableVertexAttribArray(this.attributeLocations[name + "Loc"]);

      //Check if combineBuffer was created
      if(vertexArray.getCombinedBuffer() === null){
        vertexBufferArray[index].getAttributeBuffer().bind();
      } else {
        vertexArray.getCombinedBuffer().bind();
      }

      this.gl.vertexAttribPointer(this.attributeLocations[name + "Loc"], vertexBufferArray[index].getNumOfComponents(),
                              this.gl[vertexBufferArray[index].getTypeOfValue()], vertexBufferArray[index].getNormalisation(),
                              vertexBufferArray[index].getStride(), vertexBufferArray[index].getOffset());
    }
  }

  //Search buffer according to location name
  findIndexVertex(name, vertexBufferArray){
    for(let i = 0; i < vertexBufferArray.length; i++){
      if(vertexBufferArray[i].getName() === name){
          return i;
      }
    }
    return -1;
  }

  //TODO: Add support for per object uniforms
  setUniforms(uniformArray){
    let uniformLocationNames = this.vertexShader.getUniformLocationNames().concat(this.fragmentShader.getUniformLocationNames());

    let universalUniform = uniformArray.getUniversalUniform();
    for(let name of uniformLocationNames){
      //Not complete for all this.gl.uniform commands
      if(name === "u_sampler") continue;

      let index = this.findIndexUniform(name, universalUniform);
      if(index === -1) throw Error("Property " + name + " not found in uniformArray object");

      if(universalUniform[index].getProperty().search("1") != -1){
        this.gl["uniform" + universalUniform[index].getProperty()](this.uniformLocations[name + "Loc"], universalUniform[index].getValue());

      } else if(universalUniform[index].getProperty().search("2") != -1) {

        let valueArray =  universalUniform[index].getValue();
        this.gl["uniform" + universalUniform[index].getProperty()](this.uniformLocations[name + "Loc"], valueArray[0], valueArray[1]);
      } else if(universalUniform[index].getProperty().search("3fv") != -1){
        this.gl["uniform" + universalUniform[index].getProperty()](this.uniformLocations[name + "Loc"], false, universalUniform[index].getValue());

      } else if(universalUniform[index].getProperty().search("4fv") != -1){
        this.gl["uniform" + universalUniform[index].getProperty()](this.uniformLocations[name + "Loc"], false, universalUniform[index].getValue());
      }
    }
  }

  //Search uniforms according to location name
  findIndexUniform(name, universalUniform){
    for(let i = 0; i < universalUniform.length; i++){
      if(universalUniform[i].getName() === name){
        return i;
      }
    }
    return -1;
  }

  setLocations(){
    let attribLocationNames = this.vertexShader.getAttributeLocationNames().concat(this.fragmentShader.getAttributeLocationNames());
    let uniformLocationNames = this.vertexShader.getUniformLocationNames().concat(this.fragmentShader.getUniformLocationNames());

    for(let locationName of attribLocationNames){
      this.attributeLocations[locationName + "Loc"] = this.gl.getAttribLocation(this.program, locationName);
    }

    for(let locationName of uniformLocationNames){
      this.uniformLocations[locationName + "Loc"] = this.gl.getUniformLocation(this.program, locationName);
    }
  }

  createAndCompileProgram(){
    let program = this.gl.createProgram();

    this.gl.attachShader(program, this.vertexShader.getShader());
    this.gl.attachShader(program, this.fragmentShader.getShader());

    this.gl.linkProgram(program);

    // Check if it linked.
    let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!success) {
        throw ("program filed to link:" + this.gl.getProgramInfoLog (program));
    }

    console.log("Program initialise complete!");
    return program;
  }

  getVertexShader(){return this.vertexShader;}
  getFragmentShader(){return this.fragmentShader;}
  getAttributeLocations(){return this.attributeLocations;}
  getUniformLocations(){return this.uniformLocations;}
  getProgram(){return this.program;}
}
