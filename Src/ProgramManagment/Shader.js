class Shader {
  constructor(loadObject){
    this.type = loadObject.getType();
    this.source = loadObject.getData();
    this.attributeLocationNames = [];
    this.uniformLocationNames = [];
    this.setLocationNames();

    this.shader = this.createAndCompileShader();
  }

  /*
  * IMPORTANT: Location names must be in formats a_nameofattribute or u_nameofuniform
  * Struct variables must be in format: s_structVariavleName/*NameOfStructVariable*/
  /* Parse source to get location names
  */
  setLocationNames(){
    let arrayNum = this.getArrayNum();

    let indexMain = -1;
    let index = 0;
    let indexSemicoln = -1;
    let indexBracket = -1

    let searchKeyWords = [" a_", " u_", "s_"];

    for(let i = 0; i < searchKeyWords.length; i++){
      let tempString = this.source;
      index = tempString.search(searchKeyWords[i]);
      indexMain = tempString.search("main");

      while(index != -1 && index < indexMain){
        tempString = tempString.slice(index);
        indexSemicoln = tempString.search(";");

        /*indexBracket = tempString.search("\\[");
        if(indexBracket != -1){
            //if(indexBracket < indexSemicoln) indexSemicoln = indexBracket;
        }*/

        if(i === 0){
          this.attributeLocationNames.push(tempString.slice(1, indexSemicoln));
        } else if(i === 1) {
          this.uniformLocationNames.push(tempString.slice(1, indexSemicoln));
        } else if(i === 2){
          let uniformName;

          let search = tempString.search("\\/\\*");
          if(search > indexSemicoln) throw Error("Shader type error: struct variables not defined as specified.");
          //console.log(tempString.slice(search + 2, indexSemicoln - 4));
          if(arrayNum.has(tempString.slice(search + 2, indexSemicoln - 4))){

            for(let i = 0; i < arrayNum.get(tempString.slice(search + 2, indexSemicoln - 4)); i++){
              uniformName = tempString.slice(search + 2, indexSemicoln - 3).concat(i.toString() + "]." + tempString.slice(0, search));
              this.uniformLocationNames.push(uniformName);
            }

          } else {
            uniformName = tempString.slice(search + 2, indexSemicoln - 2).concat("." + tempString.slice(0, search));
            this.uniformLocationNames.push(uniformName);
          }
        }

        tempString = tempString.slice(indexSemicoln);

        index = tempString.search(searchKeyWords[i]);
        indexMain = tempString.search("main");
      }
    }
  }

  getArrayNum() {
    let searchKeyWord = "#define NUM_";
    let tempString = this.source;
    let index = tempString.search(searchKeyWord);

    let resultMap = new Map();

    while(index != -1){
      tempString = tempString.slice(index);

      let key = tempString.slice(tempString.search("\\/\\*") + 2, tempString.search("\\*\\/"));
      let value = tempString.slice(tempString.search("\\/\\*") -1, tempString.search("\\/\\*"));
      resultMap.set(key, value);

      tempString = tempString.slice(tempString.search("\\*\\/"));
      index = tempString.search(searchKeyWord);
    }

    return resultMap;
  }

  createAndCompileShader(){
    let shader = gl.createShader(gl[this.type]);
    gl.shaderSource(shader, this.source);
    gl.compileShader(shader);

    // Check if compiled
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      throw "Could not compile " + this.type + " : " + gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  getType(){return this.type;}
  getSource(){return this.source;}
  getAttributeLocationNames(){return this.attributeLocationNames;}
  getUniformLocationNames(){return this.uniformLocationNames;}
  getShader(){return this.shader;}
}
