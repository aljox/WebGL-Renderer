class TextureLoader {
  constructor(type, url){
    this.type = type;
    this.url = url;
    this.loaded = false;
    this.image = null;
  }

  load(){
    this.image = new Image();
    this.image.src = this.url;
    this.image.addEventListener('load', this.setLoaded(true));
  }

  setType(type) {this.type = type;}
  setUrl(url) {this.url = url;}
  setLoaded(loaded) {this.loaded = loaded;}
  setImage(image) {this.image = image;}

  getType() {return this.type;}
  getUrl() {return this.url;}
  getLoaded() {return this.loaded;}
  getImage() {return this.image;}
}
