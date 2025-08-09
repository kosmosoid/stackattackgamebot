function getBoxAt(gridX, gridY, boxes) {
  return boxes.find(box => box.gridX === gridX && box.gridY === gridY);
}

function drawGrid(ctx, width, height, boxSize) {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  for (let i = 0; i <= width / boxSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * boxSize, 0);
    ctx.lineTo(i * boxSize, height);
    ctx.stroke();
  }
  for (let i = 0; i <= height / boxSize; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * boxSize);
    ctx.lineTo(width, i * boxSize);
    ctx.stroke();
  }
}