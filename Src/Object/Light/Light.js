class Light extends RenderModel {
  constructor(model, colour, diffuseIntensity, specularIntensity, ambientIntensity){
    RenderModel renderModel = RenderModel.buildFromModel(model);
    super(renderModel.getVertexArray());

    this.type = "Light";

    this.colour = colour;
    this.diffuseIntensity = diffuseIntensity;
    this.specularIntensity = specularIntensity;
    this.ambientIntensity = ambientIntensity;
  }

  setColour(colour){this.colour = colour;}
  setDiffuseIntensity(diffuseIntensity) {this.diffuseIntensity = diffuseIntensity;}
  setSpecularIntesinty(specularIntensity) {this.specularIntensity = specularIntensity;}
  setAmbientIntensity(ambientIntensity) {this.ambientIntensity = ambientIntensity;}

  getColour(){this.colour;}
  getDiffuseIntensity() {this.diffuseIntensity;}
  getSpecularIntesinty() {this.specularIntensity;}
  getAmbientIntensity() {this.ambientIntensity;}
}
