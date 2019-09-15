class MathExt{
  constructor(){}

  static degreeToRadians(degree){
    return degree * Math.PI / 180;
  }

  static isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

  static randomInteger(min, max) {
  // here rand is from min to (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
  }

}
