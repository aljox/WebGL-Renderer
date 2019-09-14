class PointLight extends Light {
  constructor(renderModel, colour, ambientIntensity, diffuseIntensity, specularIntensity, position, constantFac, linearFac, quadraticfac){
    super(renderModel, colour, ambientIntensity, diffuseIntensity, specularIntensity);

    this.setPosition(position);

    this.constantFac = constantFac;
    this.linearFac = linearFac;
    this.quadraticfac = quadraticfac;
  }

  buildUniformObjectShader(object, camera) {
    object.addUniform(new Uniform("pointLight.s_position", "3f", this.position.toArray()));
    object.addUniform(new UniformMatrix("pointLight.s_modelViewTransform", "4fv", camera.getViewMatrixInverse()));

    object.addUniform(new Uniform("pointLight.s_lightColour", "3f", this.colour.toArray()));

    object.addUniform(new Uniform("pointLight.s_constantFac", "1f", this.constantFac));
    object.addUniform(new Uniform("pointLight.s_linearFac", "1f", this.linearFac));
    object.addUniform(new Uniform("pointLight.s_quadraticfac", "1f", this.quadraticfac));

    object.addUniform(new Uniform("pointLight.s_ambient", "1f", this.ambientIntensity));
    object.addUniform(new Uniform("pointLight.s_diffuse", "1f", this.diffuseIntensity));
    object.addUniform(new Uniform("pointLight.s_specular", "1f", this.specularIntensity));
  }

  static buildUniformObjectShader(object, pointLights, camera) {
    for(let i = 0; i < pointLights.length; i++){
      object.addUniform(new Uniform("pointLight["+ i.toString() + "].s_position", "3f", pointLights[i].getPosition().toArray()));
      object.addUniform(new UniformMatrix("pointLight["+ i.toString() + "].s_modelViewTransform", "4fv", camera.getViewMatrixInverse()));

      object.addUniform(new Uniform("pointLight["+ i.toString() + "].s_lightColour", "3f", pointLights[i].getColour().toArray()));

      object.addUniform(new Uniform("pointLight["+ i.toString() + "].s_constantFac", "1f", pointLights[i].getConstantFac()));
      object.addUniform(new Uniform("pointLight["+ i.toString() + "].s_linearFac", "1f", pointLights[i].getLinearFac()));
      object.addUniform(new Uniform("pointLight["+ i.toString() + "].s_quadraticFac", "1f", pointLights[i].getQuadraticFac()));

      object.addUniform(new Uniform("pointLight["+ i.toString() + "].s_ambient", "1f", pointLights[i].getAmbientIntensity()));
      object.addUniform(new Uniform("pointLight["+ i.toString() + "].s_diffuse", "1f", pointLights[i].getDiffuseIntensity()));
      object.addUniform(new Uniform("pointLight["+ i.toString() + "].s_specular", "1f", pointLights[i].getSpecularIntesinty()));
    }
  }

  setConstantFac(constantFac) {this.constantFac = constantFac;}
  setLinearFac(linearFac) {this.linearFac = linearFac;}
  setQuadraticFac(quadraticFac) {this.quadraticfac = quadraticfac;}

  getConstantFac() {return this.constantFac;}
  getLinearFac() {return this.linearFac;}
  getQuadraticFac() {return this.quadraticfac;}
}
