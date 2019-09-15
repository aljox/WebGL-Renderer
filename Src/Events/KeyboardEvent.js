// Ties keyboard event to object - only meant for moving object
class KeyboardEvent {
  constructor(object){
    let stepZ = 0.5;
    let stepY = 0.5;
    let stepX = 0.2;
    let stepRotY = 1;

    let position, rotation, direction, x, z;

    document.addEventListener('keydown', function(event) {
      switch (event.code) {
        case 'ArrowUp':
          position = object.getPosition();
          if(position.getZ() > -10) break;
          rotation = MathExt.degreeToRadians(object.getRotation().getY());
          x = Math.sin(rotation) * position.getZ();
          z = Math.cos(rotation) * position.getZ();

          direction = new Vec3f(x * stepZ, 0, z * stepZ);
          direction = Vec3f.normalise(direction);
          //console.log(direction);

          object.setPosition(position.addVec(direction));
          break;
        case 'ArrowDown':
          position = object.getPosition();
          if(position.getZ() > -10) break;
          rotation = MathExt.degreeToRadians(object.getRotation().getY());
          x = Math.sin(rotation) * position.getZ();
          z = Math.cos(rotation) * position.getZ();

          direction = new Vec3f(x * -stepZ, 0, z * -stepZ);
          direction = Vec3f.normalise(direction);
          //console.log(direction);

          object.setPosition(position.addVec(direction));
          break;
        case 'KeyJ':
          position = object.getPosition();
          position.setY(position.getY() - stepY);
          object.setPosition(position);
          break;
        case 'KeyU':
          position = object.getPosition();
          position.setY(position.getY() + stepY);
          object.setPosition(position);
          break;
        case 'ArrowLeft':
          if(object instanceof Camera) {
            rotation = object.getRotation();
            rotation.setY(rotation.getY() + stepRotY);
            object.setRotation(rotation);
          } else {
            position = object.getPosition();
            position.setX(position.getX() - stepX);
            object.setPosition(position);
          }
          break;
        case 'ArrowRight':
          if(object instanceof Camera) {
            rotation = object.getRotation();
            rotation.setY(rotation.getY() - stepRotY);
            object.setRotation(rotation);
          } else {
            position = object.getPosition();
            position.setX(position.getX() + stepX);
            object.setPosition(position);
          }
          break;
      }

      if(object instanceof Camera) {
        object.buildViewMatrixInverse();
      } else {
        object.updateModelMatrix();
      }

      event.preventDefault();
    });
  }
}
