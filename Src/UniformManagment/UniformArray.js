//TODO: implement per object uniforms
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
    // Todo: Error Check

    this.universalUniform.push(...uniforms);
  }

  addObjectUniform(uniform){
    if(!uniform instanceof Uniform) throw Error("Passed parameter is not uniform!");
    this.perObjectUniform.push(uniform);
  }

  addObjectUniformArray(uniforms){
    // Todo: error Check

    this.perObjectUniform.push(...uniforms);
  }

  getUniversalUniform(){return this.universalUniform;}
  getPerObjectUniform(){return this.perObjectUniform;}

  getUniversalUniformElement(i){return this.universalUniform[i];}
  getPerObjectUniformElement(i){return this.perObjectUniform[i];}
}
