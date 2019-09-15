class DirectionalLight extends Light {
  constructor(dir, colour, ambientIntensity, diffuseIntensity, specularIntensity) {
    // renderModel - null --> directional light doesnt have render model associated to it
    super(new RenderModel([]), colour, ambientIntensity, diffuseIntensity, specularIntensity);

    this.dir = dir;
  }

  buildUniformObjectShader(object) {
    object.addUniform(new Uniform("dirLight.s_direction", "3f", this.dir.toArray()));
    object.addUniform(new Uniform("dirLight.s_lightColour", "3f", this.colour.toArray()));
    object.addUniform(new Uniform("dirLight.s_ambient", "1f", this.ambientIntensity));
    object.addUniform(new Uniform("dirLight.s_diffuse", "1f", this.diffuseIntensity));
    object.addUniform(new Uniform("dirLight.s_specular", "1f", this.specularIntensity));
  }

  static buildUniformObjectShader(object, dirLights) {
    for(let i = 0; i < dirLights.length; i++){
      object.addUniform(new Uniform("dirLight["+ i.toString() + "].s_direction", "3f", dirLights[i].getDir().toArray()));
      object.addUniform(new Uniform("dirLight["+ i.toString() + "].s_lightColour", "3f", dirLights[i].getColour().toArray()));
      object.addUniform(new Uniform("dirLight["+ i.toString() + "].s_ambient", "1f", dirLights[i].getAmbientIntensity()));
      object.addUniform(new Uniform("dirLight["+ i.toString() + "].s_diffuse", "1f", dirLights[i].getDiffuseIntensity()));
      object.addUniform(new Uniform("dirLight["+ i.toString() + "].s_specular", "1f", dirLights[i].getSpecularIntesinty()));
    }
  }

  setDir(dir) {this.dir = dir;}
  getDir() {return this.dir;}
  getNewInstance(){return new DirectionalLight(this.dir, this.colour, this.ambientIntensity, this.diffuseIntensity, this.specularIntensity);}
}
