class Crane {
  constructor() {
    this.gridX = GRID_WIDTH;
    this.x = this.gridX * BOX_SIZE;
    this.y = 0;
    this.width = CRANE_WIDTH;
    this.height = CRANE_HEIGHT;
    this.baseSpeed = 150
    this.speed = this.baseSpeed;
    this.direction = -1;
    this.hasBox = true;
    this.dropPoint = Math.floor(Math.random() * GRID_WIDTH);
    this.boxType = this.getRandomBoxType();
    this.boxColor = this.getRandomBoxColor();
  }

  update(boxes, deltaTime) {
    this.x += this.speed * this.direction * deltaTime;
    this.gridX = Math.floor(this.x / BOX_SIZE);

    if (this.gridX <= -2) {
      this.gridX = GRID_WIDTH;
      this.x = this.gridX * BOX_SIZE;
      this.hasBox = true;
      this.dropPoint = Math.floor(Math.random() * GRID_WIDTH);
      this.boxType = this.getRandomBoxType();
      this.boxColor = this.getRandomBoxColor();
    }

    if (this.hasBox && Math.floor(this.x / BOX_SIZE) === this.dropPoint) {
      const columnFull = boxes.some(box => box.gridX === this.dropPoint && box.gridY === 0);
      if (!columnFull) {
        this.hasBox = false;
        return new Box(this.dropPoint, 0, this.boxType, this.boxColor);
      }
    }

    return null;
  }

  getRandomBoxType() {
    const random = Math.random();
    if (random < 0.1) return 'bonus';
    if (random < 0.2) return 'bullet';
    return 'normal';
  }

  getRandomBoxColor() {
    const colors = ['red', 'lime', 'green', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  increaseSpeed() {
    this.speed = this.baseSpeed * (1 + (level - 1) * 0.1);
  }

  draw(ctx) {
    ctx.fillStyle = '#554433';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.hasBox) {
      switch (this.boxType) {
        case 'bonus':
          this.drawHeart(ctx, this.x + this.width / 2, this.y + this.height, BOX_SIZE);
          break;
        case 'bullet':
          this.drawBullet(ctx, this.x + this.width / 2, this.y + this.height + BOX_SIZE / 2, BOX_SIZE / 2);
          break;
        default:
          ctx.fillStyle = this.boxColor;
          ctx.fillRect(this.x + this.width / 2 - BOX_SIZE / 2, this.y + this.height, BOX_SIZE, BOX_SIZE);
      }
    }
  }

  drawHeart(ctx, x, y, size) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size / 2, x, y + size * 3/4);
    ctx.bezierCurveTo(x, y + size / 2, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    ctx.fill();
  }

  drawBullet(ctx, x, y, radius) {
    ctx.fillStyle = '#CD7F32'; // Bronze color
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#DFA76C'; // Light bronze
    ctx.beginPath();
    ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}