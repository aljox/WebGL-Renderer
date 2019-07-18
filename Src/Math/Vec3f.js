//TODO: Vector rotation
class Vec3f{
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }

  addVec(vector){
    return new Vec3f(this.x + vector.getX(), this.y + vector.getY(), this.z + vector.getZ());
  }

  addScalar(scalar){
    return new Vec3f(this.x + scalar, this.y + scalar, this.z + scalar);
  }

  subVec(vector){
    return new Vec3f(this.x - vector.getX(), this.y - vector.getY(), this.z - vector.getZ());
  }

  subScalar(scalar){
    return new Vec3f(this.x - scalar, this.y - scalar, this.z - scalar);
  }

  mulVec(vector){
    return new Vec3f(this.x * vector.getX(), this.y * vector.getY(), this.z * vector.getZ());
  }

  mulScalar(scalar){
    return new Vec3f(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  divVec(vector){
    return new Vec3f(this.x / vector.getX(), this.y / vector.getY(), this.z / vector.getZ());
  }

  divScalar(scalar){
    return new Vec3f(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  normalise(){
    let length = 1 / this.length();
    this.mulScalar(length);
  }

  dot(vector){
    return this.x * vector.getX() + this.y * vector.getY() + this.z * vector.getZ();
  }

  //this * vector
  crossProduct(vector){
    if(this.equal(vector)) throw ("Croos product ERROR: vectors are equal --> posibility of undefined results");

    return new Vec3f(this.y * vector.getZ() - this.z * vector.getY(),
                    this.z * vector.getX() - this.x * vector.getZ(),
                    this.x * vector.getY() - this.y * vector.getX());
  }

  length(){
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  equals(vector){
    if(vector.getX() === this.x && vector.getY() === this.y && vector.getZ() === this.z) return true;
    return false;
  }

  max(){
    return Math.max(this.x, this.y, this.z);
  }

  toArray(){
    return [this.x, this.y, this.z];
  }

  print(){
    console.log("( " + this.x + ", " + this.y + ", " + this.z + ")");
  }

  set(x, y, z){this.x = x; this.y = y; this.z = z;}
  setVec(vector){this.x = vector.getX(); this.y = vector.getY(); this.z = vector.getZ();}
  setX(x){this.x = x;}
  setY(y){this.y = y;}
  setZ(x){this.z = z;}

  getX(){return this.x;}
  getY(){return this.y;}
  getZ(){return this.z;}
}
