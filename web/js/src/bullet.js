class Bullet {
  constructor(gridX, gridY, direction) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.x = this.gridX * BOX_SIZE + BOX_SIZE / 2;
    this.y = this.gridY * BOX_SIZE + BOX_SIZE / 2;
    this.direction = direction;
    this.speed = 500; // pxl/sec
    this.radius = 5;
  }

  update(deltaTime) {
    this.x += this.direction * this.speed * deltaTime;
    this.gridX = Math.floor(this.x / BOX_SIZE);
  }

  draw(ctx) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  checkCollision(boxes) {
    for (let box of boxes) {
      if (box.gridX === this.gridX && box.gridY === this.gridY) {
        return box;
      }
    }
    return null;
  }
}