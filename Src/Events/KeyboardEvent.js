// Ties keyboard event to object - only meant for moving object
class KeyboardEvent {
  constructor(object){
    let stepZ = 0.5;
    let stepY = 0.5;
    let stepX = 0.5;
    let position;
    document.addEventListener('keydown', function(event) {
      switch (event.code) {
        case 'KeyF':
          position = object.getPosition();
          position.setZ(position.getZ() - stepZ);
          object.setPosition(position);
          break;
        case 'KeyB':
          position = object.getPosition();
          position.setZ(position.getZ() + stepZ);
          object.setPosition(position);
          break;
        case 'ArrowUp':
          position = object.getPosition();
          position.setY(position.getY() + stepY);
          object.setPosition(position);
          break;
        case 'ArrowDown':
          position = object.getPosition();
          position.setY(position.getY() - stepY);
          object.setPosition(position);
          break;
        case 'ArrowLeft':
          position = object.getPosition();
          position.setX(position.getX() - stepX);
          object.setPosition(position);
          break;
        case 'ArrowRight':
          position = object.getPosition();
          position.setX(position.getX() + stepX);
          object.setPosition(position);
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
