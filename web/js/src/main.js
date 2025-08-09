const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let WIDTH, HEIGHT, BOX_SIZE, CONTROL_HEIGHT;

const API_BASE_URL = '';

let isTg = false;
let user;
let tg;
if (typeof window.Telegram !== 'undefined') {
  isTg = true;
  tg = window.Telegram.WebApp;
  tg.expand();
  user = tg.initDataUnsafe.user;
}


if (isMobile || isTg) {
  // Mobile
  if (window.innerWidth > 640) {
    WIDTH = 640;
  } else {
    WIDTH = window.innerWidth - (window.innerWidth % 25);
  }
  CONTROL_HEIGHT = 100;
  HEIGHT = 480;
  BOX_SIZE = 25;
} else {
  // Desktop
  WIDTH = 640;
  HEIGHT = 480;
  BOX_SIZE = 40;
  CONTROL_HEIGHT = 0;
}

const startButton = document.getElementById('startButton');
// const donateButton = document.getElementById('donateButton');
const canvas = document.getElementById('gameCanvas');
const gameInfo = document.getElementById('gameInfo');
const footer = document.getElementById('contacts');
const ctx = canvas.getContext('2d');

document.getElementById('startButton').textContent = t('startGame');
// document.getElementById('donateButton').textContent = t('donateMe');

footer.innerHTML = t('contactLine');
gameInfo.innerHTML = `
    <p>${t('gameDescription')}</p>
    <h3>${t('instructions')}</h3>
    <ul>
        <li>${t('moveLeft')}</li>
        <li>${t('moveRight')}</li>
        <li>${t('jumpKey')}</li>
        <li>${t('shootLeft')}</li>
        <li>${t('shootRight')}</li>
        <li>${t('collectHeart')}</li>
        <li>${t('collectBullet')}</li>
        <li>${t('collectLines')}</li>
        <li>${t('destroyRows')}</li>
        <li>${t('pauseKey')}</li>
        <li>${t('soundKey')}</li>
    </ul>
    <p>${t('goodLuck')}</p>
`;

startButton.addEventListener('click', () => {
  gameInfo.style.display = 'none';
  canvas.style.display = 'block';
  startButton.style.display = 'none';
  // donateButton.style.display = 'none';
  initGame();
  lastTime = performance.now();
  animationFrameId = requestAnimationFrame(gameLoop);
});

// donateButton.addEventListener('click', () => {
//   try {
//     const invoiceLink = tg.createInvoiceLink({ 
//       title: 'Donation', 
//       description: 'Donate to support the project', 
//       payload: `star_${user}_${Date.now()}`, 
//       provider_token: '', 
//       currency: 'XTR',
//       prices: [{ label: 'Donation', amount: 10 }], 
//       need_phone_number: false, 
//       need_email: false, 
//       need_shipping_address: false, 
//       is_flexible: false 
//     });

//     tg.sendInvoice(invoiceLink).then((status) => { 
//         if (status === 'paid') { 
//           console.log('Payment was successful.'); 
//         } else { 
//           console.log('Payment failed or was cancelled.'); 
//         } 
//     }).catch((err) => { 
//         console.log('OpenInvoice Error:', err); 
//     });
//   } catch (error) {
      
//   }
// });

window.addEventListener('resize', () => {
  if (isMobile) {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight - CONTROL_HEIGHT;
    GRID_WIDTH = Math.floor(WIDTH / BOX_SIZE);
    GRID_HEIGHT = Math.floor(HEIGHT / BOX_SIZE);
    
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
  }
});

const backgroundImages = [
  '/static/images/background1.png',
  '/static/images/background2.png',
  '/static/images/background3.png',
  '/static/images/background4.png',
  '/static/images/background5.png',
  '/static/images/background6.png',
  '/static/images/background7.png',
  '/static/images/background8.png',
  '/static/images/background9.png',
  '/static/images/background10.png',
  '/static/images/background11.png',
  '/static/images/background12.png',
  '/static/images/background13.png'
];

function changeBackground() {
  currentBackgroundIndex++;
  if (currentBackgroundIndex > 12) {
    currentBackgroundIndex = 1;
  }
  canvas.style.backgroundImage = `url('${backgroundImages[currentBackgroundIndex]}')`;
}


const PLAYER_SIZE = BOX_SIZE;
const CRANE_WIDTH = BOX_SIZE * 2;
const CRANE_HEIGHT = BOX_SIZE / 2;
let GRID_WIDTH = Math.floor(WIDTH / BOX_SIZE);
let GRID_HEIGHT = Math.floor(HEIGHT / BOX_SIZE);

canvas.width = WIDTH;
canvas.height = HEIGHT;

let player;
let crane;
let boxes = [];
let bullets = [];
let gameOver = false;
let score = 0;
let level = 1;
let lastLifeBonus = 0;
let isPaused = false;
let animationFrameId = null;
let lastTime = 0;
let currentBackgroundIndex = -1;
let gameInProgress = false;
let highScore = parseInt(getCookie('highScore')) || 0;


function initGame() {

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  player = new Player(Math.floor(GRID_WIDTH / 2), GRID_HEIGHT - 1);
  crane = new Crane();
  boxes = [];
  bullets = [];
  gameOver = false;
  score = 0;
  level = 1;
  lastLifeBonus = 0;
  isPaused = false;
  gameInProgress = true;

  //setInterval(changeBackground, 30000);
  gameInfo.style.display = 'none';
  canvas.style.display = 'block';

  highScore = parseInt(getCookie('highScore')) || 0;

  if (isMobile) {
    addMobileControls();
    //enableFullscreen();
  }
  initAudio();
  changeBackground();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyM') {
    toggleSound();
    return;
  }

  if (e.code === 'KeyS' && gameOver) {
    initGame();
    changeBackground();
    animationFrameId = requestAnimationFrame(gameLoop);
    return;
  }

  if ((e.code === 'KeyP' || e.code === 'KeyH') && gameInProgress) {
    isPaused = !isPaused;
    if (!isPaused) {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
      startBackgroundMusic();
    } else {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      stopBackgroundMusic();
      drawPauseScreen();
    }
    return;
  }

  if (isPaused) return;

  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      player.move(-1, boxes);
      break;
    case 'ArrowRight':
    case 'KeyD':
      player.move(1, boxes);
      break;
    case 'Space':
    case 'KeyW':
    case 'ArrowUp':
      player.jump();
      break;
    case 'Comma':
      const bulletLeft = player.shoot(-1);
      if (bulletLeft) {
        bullets.push(bulletLeft);
        playSound(AUDIO.shoot);
      }
      break;
    case 'Period':
      const bulletRight = player.shoot(1);
      if (bulletRight) {
        bullets.push(bulletRight);
        playSound(AUDIO.shoot);
      }
      break;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    player.stopMoving();
  }
});

function enableFullscreen() {
  const gameContainer = document.getElementById('gameContainer');
  if (gameContainer.requestFullscreen) {
    gameContainer.requestFullscreen();
  } else if (gameContainer.mozRequestFullScreen) { // Firefox
    gameContainer.mozRequestFullScreen();
  } else if (gameContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
    gameContainer.webkitRequestFullscreen();
  } else if (gameContainer.msRequestFullscreen) { // IE/Edge
    gameContainer.msRequestFullscreen();
  }
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    setCookie('highScore', highScore, 365);
  }
}

function drawPauseScreen() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(t('pause'), WIDTH / 2, HEIGHT / 2);
  ctx.font = '20px Arial';
  ctx.fillText(t('resume'), WIDTH / 2, HEIGHT / 2 + 40);
  ctx.fillText(t('toggleSound'), WIDTH / 2, HEIGHT / 2 + 70);
}

function removeBoxAndUpdateStack(boxToRemove) {
  boxes = boxes.filter(box => box !== boxToRemove);

  // Find all boxes above the deleted one
  const boxesAbove = boxes.filter(box => box.gridX === boxToRemove.gridX && box.gridY < boxToRemove.gridY);

  // We lower all the boxes one position higher
  boxesAbove.forEach(box => {
    box.gridY++;
    box.falling = true;
  });
}

function checkAndClearLines() {
  let linesCleared = 0;
  for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
    const boxesInLine = boxes.filter(box => box.gridY === y);
    if (boxesInLine.length === GRID_WIDTH) {
      // Remove filled line
      boxes = boxes.filter(box => box.gridY !== y);

      // Down all boxes
      boxes.forEach(box => {
        if (box.gridY < y) {
          box.gridY++;
          box.falling = true;
        }
      });

      linesCleared++;
      playSound(AUDIO.line);
      // Check all line again
      y++;
    }
  }

  // Начисляем очки за удаленные линии
  score += linesCleared * 5;

  checkLevelUp();
  checkLifeBonus();
}

function checkAndClearMatches() {
  let matches = new Set();

  // Check horizontal matches
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH - 2; x++) {
      const box1 = boxes.find(box => box.gridX === x && box.gridY === y && box.type === 'normal' && !box.falling);
      const box2 = boxes.find(box => box.gridX === x+1 && box.gridY === y && box.type === 'normal' && !box.falling);
      const box3 = boxes.find(box => box.gridX === x+2 && box.gridY === y && box.type === 'normal' && !box.falling);
      if (box1 && box2 && box3 && box1.color === box2.color && box2.color === box3.color) {
        matches.add(box1);
        matches.add(box2);
        matches.add(box3);
      }
    }
  }

  // Check vertical matches
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT - 2; y++) {
      const box1 = boxes.find(box => box.gridX === x && box.gridY === y && box.type === 'normal' && !box.falling);
      const box2 = boxes.find(box => box.gridX === x && box.gridY === y+1 && box.type === 'normal' && !box.falling);
      const box3 = boxes.find(box => box.gridX === x && box.gridY === y+2 && box.type === 'normal' && !box.falling);
      if (box1 && box2 && box3 && box1.color === box2.color && box2.color === box3.color) {
        matches.add(box1);
        matches.add(box2);
        matches.add(box3);
      }
    }
  }

  if (matches.size > 0) {
    // Remove matches boxes
    boxes = boxes.filter(box => !matches.has(box));
    playSound(AUDIO.match);
    // Down boxes
    boxes.forEach(box => {
      const boxesBelow = Array.from(matches).filter(match => match.gridX === box.gridX && match.gridY > box.gridY);
      box.gridY += boxesBelow.length;
      box.falling = true;
    });

    // Add score
    score += matches.size * 3;

    checkLevelUp();
    checkLifeBonus();
  }
}

function checkLevelUp() {
  if (score >= level * 20) {
    level++;
    crane.increaseSpeed();
  }
}

function checkLifeBonus() {
  if (score - lastLifeBonus >= 100) {
    player.addLife();
    lastLifeBonus = score - (score % 100);
  }
}

function drawScore() {
  ctx.save();

  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(10, 22, 120, 46);

  ctx.fillStyle = 'white';
  ctx.fillText(`${t('score')}: ${score}`, 16, 28);
  ctx.fillText(`${t('level')}: ${level}`, 16, 48);

  ctx.restore();
}

function drawGameOverScreen() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(t('gameOver'), WIDTH / 2, HEIGHT / 2 - 60);
  ctx.fillText(`${t('finalScore')}: ${score}`, WIDTH / 2, HEIGHT / 2 - 30);
  ctx.fillText(`${t('highScore')}: ${score}`, WIDTH / 2, HEIGHT / 2);
  ctx.font = '20px Arial';
  ctx.fillText(t('toggleSound'), WIDTH / 2, HEIGHT / 2 + 50);
}

function gameLoop(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000; // time in seconds
  lastTime = currentTime;

  if (gameOver) {
    stopBackgroundMusic();
    drawGameOverScreen();
    updateHighScore();
    handleFormSubmit();
    startButton.style.display = 'block';
    // donateButton.style.display = 'block';
    startButton.textContent = t('playAgain');

    return;
  }

  if (isPaused) {
    drawPauseScreen();
    animationFrameId = requestAnimationFrame(gameLoop);
    return;
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  player.update(boxes, deltaTime);

  const newBox = crane.update(boxes, deltaTime);
  if (newBox) {
    boxes.push(newBox);
  }

  boxes = boxes.filter(box => !box.update(boxes, player, deltaTime));

  bullets = bullets.filter(bullet => {
    bullet.update(deltaTime);
    const hitBox = bullet.checkCollision(boxes);
    if (hitBox) {
      removeBoxAndUpdateStack(hitBox);
      return false;
    }
    return bullet.gridX >= 0 && bullet.gridX < GRID_WIDTH;
  });

  checkAndClearLines();
  checkAndClearMatches();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);


  drawGrid(ctx, WIDTH, HEIGHT, BOX_SIZE);
  boxes.forEach(box => box.draw(ctx));
  player.draw(ctx);
  crane.draw(ctx);
  bullets.forEach(bullet => bullet.draw(ctx));

  drawScore();

  animationFrameId = requestAnimationFrame(gameLoop);
}

async function handleFormSubmit() {


  let userData = {};

  if (user) {
    userData = {
      id: user.id,
      first_name: escapeHtml(user.first_name),
      last_name: escapeHtml(user.last_name),
      username: escapeHtml(user.username),
      is_premium: user.is_premium,
      score: score,
      }
  } else {
    userData = {
      id: -999,
      first_name: "Ivanova",
      last_name: "Ivanna",
      username: "kolobok",
      is_premium: false,
      score: 0,
      }
  }

  try {
      const response = await fetch(`${API_BASE_URL}/savescore`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.error);
      }

      showBookingConfirmation();
  } catch (error) {
      showErrorMessage('Something wrong ;-( ', error);
  }
}

function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}