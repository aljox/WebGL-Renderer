class Program {
  constructor(vertexShader, fragmentShader){
    this.use = "Unknown";
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.attributeLocations = {};
    this.uniformLocations = {};
    this.program = this.createAndCompileProgram();

    this.setLocations();
  }

  /*
  * Sets attributes and uniforms for program
  * Input:
  * 1. VertexArray vertexArray
  * 2. UniformArray uniformArray
  */
  setProgramParameters(vertexArray, uniformArray){
    this.setAttributes(vertexArray);
    this.setUniforms(uniformArray);
  }

  /*
  * Set attributes according to specified locations - names of attributes must be in sync with names of locations.
  * Setting buffer follows basic webGl procedure of setting buffer
  * Example:
  * -Name of location: a_nameLoc
  * -Name of attribute: a_name
  */
  setAttributes(vertexArray){
    let attribLocationNames = this.vertexShader.getAttributeLocationNames().concat(this.fragmentShader.getAttributeLocationNames());

    let vertexBufferArray = vertexArray.getVertexBufferArray();
    for(let name of attribLocationNames){
      let index = this.findIndexVertex(name, vertexBufferArray);
      if(index === -1) throw Error("Property " + name + " not found in vertexArray object");

      gl.enableVertexAttribArray(this.attributeLocations[name + "Loc"]);

      //Check if combineBuffer was created
      if(vertexArray.getCombinedBuffer() === null){
        vertexBufferArray[index].getAttributeBuffer().bind();
      } else {
        vertexArray.getCombinedBuffer().bind();
      }

      gl.vertexAttribPointer(this.attributeLocations[name + "Loc"], vertexBufferArray[index].getNumOfComponents(),
                              gl[vertexBufferArray[index].getTypeOfValue()], vertexBufferArray[index].getNormalisation(),
                              vertexBufferArray[index].getStride(), vertexBufferArray[index].getOffset());
    }
  }

  //Search if exists location name for buffer
  findIndexVertex(name, vertexBufferArray){
    for(let i = 0; i < vertexBufferArray.length; i++){
      if(vertexBufferArray[i].getName() === name){
          return i;
      }
    }
    return -1;
  }

  //TODO: Complete for all webGl uniform types
  setUniforms(uniformArray){
    let uniformLocationNames = this.vertexShader.getUniformLocationNames().concat(this.fragmentShader.getUniformLocationNames());

    let uniforms = [];
    uniforms.push(...uniformArray.getUniversalUniform());
    uniforms.push(...uniformArray.getPerObjectUniform());

    for(let name of uniformLocationNames){

      if(name === "u_sampler") continue;

      let index = this.findIndexUniform(name, uniforms);
      if(index === -1) throw Error("Property " + name + " not found in uniformArray object");

      if(uniforms[index].getProperty().search("1") != -1){
        gl["uniform" + uniforms[index].getProperty()](this.uniformLocations[name + "Loc"], uniforms[index].getValue());

      } else if(uniforms[index].getProperty().search("2") != -1) {

        let valueArray =  uniforms[index].getValue();
        gl["uniform" + uniforms[index].getProperty()](this.uniformLocations[name + "Loc"], valueArray[0], valueArray[1]);
      } else if(uniforms[index].getProperty().search("3fv") != -1){
        gl["uniform" + uniforms[index].getProperty()](this.uniformLocations[name + "Loc"], false, uniforms[index].getValue());

      } else if(uniforms[index].getProperty().search("3f") != -1){
        let valueArray =  uniforms[index].getValue();
        gl["uniform" + uniforms[index].getProperty()](this.uniformLocations[name + "Loc"], valueArray[0], valueArray[1], valueArray[2]);

      } else if(uniforms[index].getProperty().search("4fv") != -1){
        gl["uniform" + uniforms[index].getProperty()](this.uniformLocations[name + "Loc"], false, uniforms[index].getValue());
      }
    }
  }

  //Search if exists location name for uniform
  findIndexUniform(name, uniforms){
    for(let i = 0; i < uniforms.length; i++){
      if(uniforms[i].getName() === name){
        return i;
      }
    }
    return -1;
  }

  setLocations(){
    let attribLocationNames = this.vertexShader.getAttributeLocationNames().concat(this.fragmentShader.getAttributeLocationNames());
    let uniformLocationNames = this.vertexShader.getUniformLocationNames().concat(this.fragmentShader.getUniformLocationNames());

    for(let locationName of attribLocationNames){
      this.attributeLocations[locationName + "Loc"] = gl.getAttribLocation(this.program, locationName);
    }

    for(let locationName of uniformLocationNames){
      this.uniformLocations[locationName + "Loc"] = gl.getUniformLocation(this.program, locationName);
    }
  }

  createAndCompileProgram(){
    let program = gl.createProgram();

    gl.attachShader(program, this.vertexShader.getShader());
    gl.attachShader(program, this.fragmentShader.getShader());

    gl.linkProgram(program);

    // Check if it linked.
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        throw ("program filed to link:" + gl.getProgramInfoLog (program));
    }

    console.log("Program initialise complete!");
    return program;
  }

  setUse(use) {this.use = use;}

  getUse() {return this.use;}
  getVertexShader() {return this.vertexShader;}
  getFragmentShader() {return this.fragmentShader;}
  getAttributeLocations() {return this.attributeLocations;}
  getUniformLocations() {return this.uniformLocations;}
  getProgram() {return this.program;}
}
