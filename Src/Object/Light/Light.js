class Light extends RenderModel{
  constructor(renderModel, colour, ambientIntensity, diffuseIntensity, specularIntensity){
    super(renderModel.getVertexArray());

    this.type = "Light";
    this.material = null;

    this.colour = colour;
    this.ambientIntensity = ambientIntensity;
    this.diffuseIntensity = diffuseIntensity;
    this.specularIntensity = specularIntensity;
  }

  buildUniformLightShader() {
    this.objectUniforms.push(new Uniform("u_colour", "3f", this.colour.toArray()));
  }

  buildUniformObjectShader(object) {
    object.addUniform(new Uniform("light.s_lightColour", "3f", this.colour.toArray()));
    object.addUniform(new Uniform("light.s_ambient", "1f", this.ambientIntensity));
    object.addUniform(new Uniform("light.s_diffuse", "1f", this.diffuseIntensity));
    object.addUniform(new Uniform("light.s_specular", "1f", this.specularIntensity));
  }

  setColour(colour){this.colour = colour;}
  setDiffuseIntensity(diffuseIntensity) {this.diffuseIntensity = diffuseIntensity;}
  setSpecularIntesinty(specularIntensity) {this.specularIntensity = specularIntensity;}
  setAmbientIntensity(ambientIntensity) {this.ambientIntensity = ambientIntensity;}

  getColour(){return this.colour;}
  getDiffuseIntensity() {return this.diffuseIntensity;}
  getSpecularIntesinty() {return this.specularIntensity;}
  getAmbientIntensity() {return this.ambientIntensity;}
}
