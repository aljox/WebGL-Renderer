const NUM_OF_COMPONENTS_PER_VERT = 3;

/*
* Load models from .obj format
*/
class Model{
  constructor(data){
    this.data = data;
    this.vertices = [];
    this.textureCord = [];
    this.normals = [];
    this.indexBuffer = [];
    this.indexBufferSpec = null;

    this.buildFromObj();
  }

  /*
  * Parses source .obj for data
  * TODO: solution for beter match declaration
  * TODO: support for faces, etc.
  * TODO: more or less than 3 vertices
  */
  buildFromObj(){
    let vertexMatch = this.data.match(/^v( -?\d+(\.\d+)?){3}$/gm);
    let textureMatch = this.data.match(/^vt( -?\d+(\.\d+)?){3}$/gm);
    let normalMatch = this.data.match(/^vn( -?\d+(\.\d+)?){3}$/gm);

    // let faceVertMatch = data.match(/^f( -?\d+?\/){4}$/gm);
    // let faceVertTextNorMatch = data.match(/^f( -?\d+?\/\d+?\/\d+?){4}$/gm);
    // let faceVertTextMatch = data.match(/^f( -?\d+?\/\d+?){4}$/gm);
    // let faceVertNorMatch = data.match(/^f( -?\d+?\/\/\d+?){4}$/gm);

    let polygonMatch = this.data.match(/^p( -?\d+?){3}$/gm);
    let polygonVertTextNorMatch = this.data.match(/^p( -?\d+?\/\d+?\/\d+?){3}$/gm);
    let polygonVertTextMatch = this.data.match(/^p( -?\d+?\/\d+?){3}$/gm);
    let polygonVertNorMatch = this.data.match(/^p( -?\d+?\/\/\d+?){3}$/gm);

    let matches = [vertexMatch, textureMatch, normalMatch,
                  /*faceVertMatch, faceVertTextNorMatch, faceVertTextMatch, faceVertNorMatch,*/
                ];
    let indexMatch = [
        polygonMatch, polygonVertTextNorMatch, polygonVertTextMatch, polygonVertNorMatch,
    ];

    //Fill vertex, normal and textureCord arrays
    for(let match of matches){
      if(match){
        for(let i = 0; i < match.length; i++){
          this.mapToArray(match[i]);
        }
      }
    }

    //Fill index buffer, only one can be specified
    for(let i = 0; i < indexMatch.length; i++){
      if(indexMatch[i]){
        for(let match of indexMatch[i]){
          this.mapToArray(match);
        }

        switch (i) {
          case 0:
            this.indexBufferSpec = "POLYGON_MATCH";
            break;
            case 1:
              this.indexBufferSpec = "POLYGON_VERT_TEXT_NOR_MATCH";
              break;
              case 2:
                this.indexBufferSpec = "POLYGON_VERT_TEXT_MATCH";
                break;
                case 3:
                  this.indexBufferSpec = "POLYGON_VERT_NOR_MATCH";
                  break;
          default:
              throw Error("Unsupported index buffer specification in obj file");
        }
        break;
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

  getVertices(){return this.vertices;}
  getTextureCord(){return this.textureCord;}
  getNormals(){return this.normals;}
  getIndexBuffer(){return this.indexBuffer;}
  getIndexBufferSpec(){return this.indexBufferSpec;}

  /*
  * Get model data for further processing
  * Necessery in this order!
  */
  getModelData(){return [this.vertices, this.textureCord, this.normals]};
}
