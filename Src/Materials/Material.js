class Material {
  constructor(ambient, diffuse, specular, shininess){
    // Colour for lighting properties
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
  }

  static initWhite(){
    return new this(new Vec3f(1.0, 1.0, 1.0), new Vec3f(1.0, 1.0, 1.0), new Vec3f(1.0, 1.0, 1.0), 1);
  }

  setAmbient(ambient) {this.ambient = ambient;}
  setDiffuse(diffuse) {this.diffuse = diffuse;}
  setSpecular(specular) {this.specular = specular;}
  setShininess(shininess) {this.shininess = shininess;}

  getAmbient() {return this.ambient;}
  getDiffuse() {return this.diffuse;}
  getSpecular() {return this.specular;}
  getShininess() {return this.shininess;}
}
