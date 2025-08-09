const AUDIO = {
  backgroundMusic: new Audio('/static/sounds/background_music.mp3'),
  shoot: new Audio('/static/sounds/shoot.wav'),
  loose: new Audio('/static/sounds/loose.wav'),
  match: new Audio('/static/sounds/match.wav'),
  line: new Audio('/static/sounds/line.wav'),
  heartbeat: new Audio('/static/sounds/heartbeat.wav')
};

let isSoundOn = getCookie('isSoundOn') === 'true';

const BACKGROUND_MUSIC_VOLUME = 0.1;

// Setting up background music to play on loop
AUDIO.backgroundMusic.loop = true;
AUDIO.backgroundMusic.volume = BACKGROUND_MUSIC_VOLUME;

let audioContext = null;

function createAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Создаем пустой источник звука
    const source = audioContext.createBufferSource();
    source.buffer = audioContext.createBuffer(1, 1, 22050);
    source.connect(audioContext.destination);
    source.start(0);
  }
}

function playSound(sound) {
  createAudioContext();
  sound.currentTime = 0;
  sound.play().catch(error => console.error("Error playing sound:", error));
}

function startBackgroundMusic() {
  if (isSoundOn) {
    createAudioContext();
    AUDIO.backgroundMusic.play().catch(error => console.error("Error playing background music:", error));
  }
}

function stopBackgroundMusic() {
  AUDIO.backgroundMusic.pause();
  AUDIO.backgroundMusic.currentTime = 0;
}

function toggleSound() {
  isSoundOn = !isSoundOn;
  setCookie('isSoundOn', isSoundOn.toString(), 365);
  if (isSoundOn) {
    createAudioContext();
    startBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }
}

function initAudio() {
  document.addEventListener('touchstart', createAudioContext, { once: true });
  document.addEventListener('mousedown', createAudioContext, { once: true });

  if (isSoundOn) {
    document.addEventListener('touchstart', startBackgroundMusic, { once: true });
    document.addEventListener('mousedown', startBackgroundMusic, { once: true });
  }
}
