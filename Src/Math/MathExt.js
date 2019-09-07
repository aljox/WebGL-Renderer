class MathExt{
  constructor(){}

  static degreeToRadians(degree){
    return degree * Math.PI / 180;
  }

  static isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }
}
