class Loader {
  constructor(type, url){
    this.type = type;
    this.url = url;
    this.loaded = false;
    this.data = null;
  }

  load(){
    fetch(this.url)
    .then(response => response.text())
    .then((data) => {
      this.loaded = true;
      this.data = data;
    });
  }

  setType(type) {this.type = type;}
  setUrl(url) {this.url = url;}
  setLoaded(loaded) {this.loaded = loaded;}
  setData(data) {this.data = data;}

  getType() {return this.type;}
  getUrl() {return this.url;}
  getLoaded() {return this.loaded;}
  getData() {return this.data;}
}

class ModelLoader extends Loader {
  constructor(url) {
    super("OBJ_MODEL", url);
  }
}

class VertexShaderLoader extends Loader {
  constructor(url) {
    super("VERTEX_SHADER", url);
  }
}

class FragmentShaderLoader extends Loader {
  constructor(url) {
    super("FRAGMENT_SHADER", url);
  }
}
