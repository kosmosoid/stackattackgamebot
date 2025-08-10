class Box {
  constructor(gridX, gridY, type = 'normal', color = null) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.x = this.gridX * BOX_SIZE;
    this.y = this.gridY * BOX_SIZE;
    this.width = BOX_SIZE;
    this.height = BOX_SIZE;
    this.velocityY = 2;
    this.falling = true;
    this.type = type;
    this.color = color || this.getRandomColor();
  }

  getRandomColor() {
    if (this.type !== 'normal') return null;
    const colors = ['red', 'lime', 'green', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(boxes, player, deltaTime) {
    if (this.falling) {
      this.y += this.velocityY * (deltaTime * 50);
      this.gridY = Math.floor(this.y / BOX_SIZE);

      const boxBelow = getBoxAt(this.gridX, this.gridY + 1, boxes);
      if (boxBelow && this.y + BOX_SIZE > boxBelow.y) {
        this.y = boxBelow.y - BOX_SIZE;
        this.gridY = boxBelow.gridY - 1;
        this.falling = false;
      } else if (this.gridY >= GRID_HEIGHT - 1) {
        this.y = (GRID_HEIGHT - 1) * BOX_SIZE;
        this.gridY = GRID_HEIGHT - 1;
        this.falling = false;
      }
    } else {
      // Check the support under the box
      const boxBelow = getBoxAt(this.gridX, this.gridY + 1, boxes);
      if (!boxBelow && this.gridY < GRID_HEIGHT - 1) {
        this.falling = true;
      }
    }

    // Check collision with the player
    if (this.gridX === player.gridX && this.gridY === player.gridY -1) {
      if (this.type === 'bonus') {
        player.addLife();
        return true; // Remove bonus bpx
      } else if (this.type === 'bullet') {
        if (!player.hasBullet) {
          player.hasBullet = true;
          return true; // Remove bonus bpx
        }
      } else if (!player.invulnerable) {
        player.loseLife();
        return true;
      }
    }

    this.x = this.gridX * BOX_SIZE;
    return false;
  }

  draw(ctx) {
    switch (this.type) {
      case 'bonus':
        this.drawHeart(ctx);
        break;
      case 'bullet':
        this.drawBullet(ctx);
        break;
      default:
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  drawHeart(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const size = Math.min(this.width, this.height) * 0.8; // Size of the heart

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + size / 4);
    ctx.bezierCurveTo(
      centerX, centerY,
      centerX - size / 2, centerY,
      centerX - size / 2, centerY - size / 4
    );
    ctx.bezierCurveTo(
      centerX - size / 2, centerY - size / 2,
      centerX, centerY - size / 2,
      centerX, centerY - size / 4
    );
    ctx.bezierCurveTo(
      centerX, centerY - size / 2,
      centerX + size / 2, centerY - size / 2,
      centerX + size / 2, centerY - size / 4
    );
    ctx.bezierCurveTo(
      centerX + size / 2, centerY,
      centerX, centerY,
      centerX, centerY + size / 4
    );
    ctx.fill();
  }

  drawBullet(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.4;

    // Bullet
    ctx.fillStyle = '#CD7F32'; // Bronze color
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Highlight (to add volume)
    ctx.fillStyle = '#DFA76C'; // Light bronze
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}