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

  setDir(dir) {this.dir = dir;}
  getDir() {return this.dir;}
}
