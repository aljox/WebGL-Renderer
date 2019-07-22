//class for loading from obj file format
class Model{
  constructor(data){
    this.data = data;
    this.vertices = [];
    this.textureCord = [];
    this.normals = [];
    this.indexBuffer = [];

    this.buildFromObj();
  }

  //TODO: solution for beter match declaration
  //TODO: support for faces, etc.
  //TODO: more or less than 3 vertices
  buildFromObj(){
    let vertexMatch = this.data.match(/^v( -?\d+(\.\d+)?){3}$/gm);
    let textureMatch = this.data.match(/^vt( -?\d+(\.\d+)?){3}$/gm);
    let normalMatch = this.data.match(/^vn( -?\d+(\.\d+)?){3}$/gm);

    //let faceVertMatch = data.match(/^f( -?\d+?\/){4}$/gm);
    //let faceVertTextNorMatch = data.match(/^f( -?\d+?\/\d+?\/\d+?){4}$/gm);
    //let faceVertTextMatch = data.match(/^f( -?\d+?\/\d+?){4}$/gm);
    //let faceVertNorMatch = data.match(/^f( -?\d+?\/\/\d+?){4}$/gm);

    let polygonMatch = this.data.match(/^p( -?\d+?){3}$/gm);
    //let polygonVertTextNorMatch = data.match(/^p( -?\d+?\/\d+?\/\d+?){3}$/gm);
    //let polygonVertTextMatch = data.match(/^p( -?\d+?\/\d+?){3}$/gm);
    //let polygonVertNorMatch = data.match(/^p( -?\d+?\/\/\d+?){3}$/gm);

    let matches = [vertexMatch, textureMatch, normalMatch,
                  /*faceVertMatch, faceVertTextNorMatch, faceVertTextMatch, faceVertNorMatch,*/
                  polygonMatch, /*polygonVertTextNorMatch, polygonVertTextMatch, polygonVertNorMatch,*/
                ];

    for(let match of matches){
      if(match){
        for(let i = 0; i < match.length; i++){
          this.mapToArray(match[i]);
        }
      }
    }
  }

  mapToArray(vertex){
    vertex = vertex.split(" ");
    let type = vertex[0];
    vertex.shift();

    switch (type) {
      case "v":
        this.vertices.push(...vertex);
        break;
      case "vn":
        this.normals.push(...vertex);
        break;
      case "vt":
        this.textureCord.push(...vertex);
        break;
      case "p":
        this.indexBuffer.push(...vertex);
        break;
      default:
        throw Error("Unsupported type in obj file");
    }
  }
}
