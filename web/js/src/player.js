class Player {
  constructor(gridX, gridY) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.x = this.gridX * BOX_SIZE;
    this.y = this.gridY * BOX_SIZE;
    this.width = PLAYER_SIZE;
    this.height = PLAYER_SIZE;
    this.velocityY = 0;
    this.jumpSpeed = -500; // pxl/sec
    this.gravity = 1000; // pxl/sec^2
    this.jumping = false;
    this.lives = 5;
    this.invulnerable = false;
    this.invulnerabilityTime = 0;
    this.invulnerabilityDuration = 2;
    this.hasBullet = false;
    this.movingDirection = 0; // 0 - стоит на месте, -1 - влево, 1 - вправо
    this.lastDirection = 1; // По умолчанию смотрит вправо
    this.moveTimer = 0; // Таймер для контроля скорости движения
    this.moveSpeed = isMobile ? 1 : 5;

  }

  move(dx, boxes) {
    const newGridX = this.gridX + dx;
    if (newGridX >= 0 && newGridX < GRID_WIDTH) {
      const boxAtNewPos = this.getBoxAt(newGridX, this.gridY, boxes);
      if (!boxAtNewPos) {
        this.gridX = newGridX;
        this.x = this.gridX * BOX_SIZE;
      } else if (this.canPushBox(boxAtNewPos, dx, boxes)) {
        this.pushBox(boxAtNewPos, dx, boxes);
        this.gridX = newGridX;
        this.x = this.gridX * BOX_SIZE;
      }
    }
  }

  moveOnce(dx, boxes) {
    this.lastDirection = dx; // Запоминаем последнее направление движения
    const newGridX = this.gridX + dx;
    if (newGridX >= 0 && newGridX < GRID_WIDTH) {
      const boxAtNewPos = this.getBoxAt(newGridX, this.gridY, boxes);
      if (!boxAtNewPos) {
        this.gridX = newGridX;
        this.x = this.gridX * BOX_SIZE;
      } else if (this.canPushBox(boxAtNewPos, dx, boxes)) {
        this.pushBox(boxAtNewPos, dx, boxes);
        this.gridX = newGridX;
        this.x = this.gridX * BOX_SIZE;
      }
    }
  }

  stopMoving() {
    this.movingDirection = 0;
  }

  jump() {
    if (!this.jumping) {
      this.velocityY = this.jumpSpeed;
      this.jumping = true;
    }
  }

  shoot(direction) {
    if (!this.hasBullet) return null;
    this.hasBullet = false;
    return new Bullet(this.gridX, this.gridY, direction);
  }

  getBoxAt(gridX, gridY, boxes) {
    return boxes.find(box => box.gridX === gridX && box.gridY === gridY);
  }

  update(boxes, deltaTime) {
    this.velocityY += this.gravity * deltaTime;
    this.y += this.velocityY * deltaTime;

    if (this.movingDirection !== 0) {
      this.move(this.movingDirection, boxes);
    }

    if (!isMobile && this.movingDirection !== 0) {
      this.moveOnce(this.movingDirection, boxes);
    }

    if (this.y > this.gridY * BOX_SIZE) {
      const boxBelow = this.getBoxAt(this.gridX, this.gridY + 1, boxes);
      if (boxBelow || this.gridY >= GRID_HEIGHT - 1) {
        this.y = this.gridY * BOX_SIZE;
        this.velocityY = 0;
        this.jumping = false;
      }
    } else {
      const boxAbove = this.getBoxAt(this.gridX, this.gridY - 1, boxes);
      if (boxAbove && this.y <= boxAbove.y + BOX_SIZE) {
        this.y = (this.gridY) * BOX_SIZE;
        this.velocityY = 0;
      }
    }

    this.gridY = Math.floor(this.y / BOX_SIZE);

    // Invulnerability state update
    if (this.invulnerable) {
      this.invulnerabilityTime += deltaTime;
      if (this.invulnerabilityTime >= this.invulnerabilityDuration) {
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
      }
    }
  }


  canPushBox(box, dx, boxes) {
    const newBoxX = box.gridX + dx;
    return newBoxX >= 0 && newBoxX < GRID_WIDTH &&
      !getBoxAt(newBoxX, box.gridY, boxes) &&
      !getBoxAt(box.gridX, box.gridY - 1, boxes);
  }

  pushBox(box, dx, boxes) {
    box.gridX += dx;
    box.x = box.gridX * BOX_SIZE;
    if (!getBoxAt(box.gridX, box.gridY + 1, boxes) && box.gridY < GRID_HEIGHT - 1) {
      box.falling = true;
    }
  }

  addLife() {
    if (this.lives < 10) {
      this.lives++;
      playSound(AUDIO.heartbeat);
    }
  }

  loseLife() {
    if (!this.invulnerable) {
      this.lives--;
      playSound(AUDIO.loose);
      this.invulnerable = true;
      this.invulnerabilityTime = 0;
      if (this.lives <= 0) {
        gameOver = true;
        gameInProgress = false;
      }
    }
  }

  drawHeart(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(
      x, y,
      x - size / 2, y,
      x - size / 2, y + size / 4
    );
    ctx.bezierCurveTo(
      x - size / 2, y + size / 2,
      x, y + size / 2,
      x, y + size * 3/4
    );
    ctx.bezierCurveTo(
      x, y + size / 2,
      x + size / 2, y + size / 2,
      x + size / 2, y + size / 4
    );
    ctx.bezierCurveTo(
      x + size / 2, y,
      x, y,
      x, y + size / 4
    );
    ctx.fill();
  }
  draw(ctx) {
    ctx.fillStyle = this.invulnerable ? 'rgba(0, 0, 255, 0.5)' : 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Displaying lives as green hearts
    for (let i = 0; i < this.lives; i++) {
      this.drawHeart(ctx, 25 + i * 30, 5, 20, 'green');
    }

    // Display of the presence of a bullet
    if (this.hasBullet) {
      const bulletX = WIDTH - 25;
      const bulletY = 25;
      const bulletRadius = 10;

      ctx.fillStyle = '#CD7F32'; // Bronze color
      ctx.beginPath();
      ctx.arc(bulletX, bulletY, bulletRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#DFA76C'; // Light bronze
      ctx.beginPath();
      ctx.arc(bulletX - bulletRadius * 0.3, bulletY - bulletRadius * 0.3, bulletRadius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}