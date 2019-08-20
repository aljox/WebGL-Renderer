class UniformArray {
  constructor(universalUniform, perObjectUniform){
    this.universalUniform = universalUniform;
    this.perObjectUniform = perObjectUniform;
  }

  addUniversalUniform(uniform){
    if(!uniform instanceof Uniform) throw Error("Passed parameter is not uniform!");
    this.universalUniform.push(uniform);
  }

  addUniversalUniformArray(uniforms){
    // TODO: Error Check

    this.universalUniform.push(...uniforms);
  }

  addObjectUniform(uniform){
    if(!uniform instanceof Uniform) throw Error("Passed parameter is not uniform!");
    this.perObjectUniform.push(uniform);
  }

  addObjectUniformArray(uniforms){
    // TODO: error Check

    this.perObjectUniform.push(...uniforms);
  }

  getUniversalUniform(){return this.universalUniform;}
  getPerObjectUniform(){return this.perObjectUniform;}

  getUniversalUniformElement(i){return this.universalUniform[i];}
  getPerObjectUniformElement(i){return this.perObjectUniform[i];}
}
