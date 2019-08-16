//TODO: implement per object uniforms
class UniformArray {
  constructor(universalUniform, perObjectComputedUniform, perObjectUniform){
    this.universalUniform = universalUniform;
    this.perObjectComputedUniform = perObjectComputedUniform;
    this.perObjectUniform = perObjectUniform;
  }

  getUniversalUniform(){return this.universalUniform;}
  getPerObjectComputedUniform(){return this.perObjectComputedUniform;}
  getPerObjectUniform(){return this.perObjectUniform;}

  getUniversalUniformElement(i){return this.universalUniform[i];}
  getPerObjectComputedUniformElement(i){return this.perObjectComputedUniform[i];}
  getPerObjectUniformElement(i){return this.perObjectUniform[i];}
}
