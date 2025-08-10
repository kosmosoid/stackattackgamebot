const translations = {
  en: {
    startGame: "Start Game",
    donateMe: "Donate ⭐️",
    gameOver: "Game Over",
    finalScore: "Final Score",
    highScore: "High Score",
    playAgain: "Play Again",
    pause: "PAUSE",
    resume: "Press 'H' or 'P' to resume",
    toggleSound: "Press 'M' to toggle music",
    score: "Score",
    level: "Level",
    jump: "Jump",
    shoot: "Shoot",
    gameDescription: "Super Stack Attack is an exciting game where you control a character avoiding falling boxes and collecting bonuses. Your goal is to survive as long as possible and score the maximum points.",
    instructions: "Instructions",
    moveLeft: "Use left arrow or A to move left",
    moveRight: "Use right arrow or D to move right",
    jumpKey: "Press space or W or up arrow to jump",
    collectHeart: "Collect hearts for extra lives",
    collectBullet: "Collect yellow spheres to get bullets",
    shootLeft: "Press ',' to shoot left",
    shootRight: "Press '.' to shoot right",
    collectLines: "Destroy entire lines of boxes of any color",
    destroyRows: "Destroy rows or lines of three or more same-colored boxes",
    pauseKey: "Press 'H' to pause/resume the game",
    soundKey: "Press 'M' to toggle music",
    goodLuck: "Good luck and have fun!",
    contactLine: 'Contact me by <a href="https://t.me/botyouneeded">Telegram</a>'
  },
  ru: {
    startGame: "Начать игру",
    donateMe: "Задонатить ⭐️",
    gameOver: "Игра окончена",
    finalScore: "Финальный счёт",
    highScore: "Лучший счёт",
    playAgain: "Играть снова",
    pause: "ПАУЗА",
    resume: "Нажмите 'H' или 'P' для продолжения",
    toggleSound: "Нажмите 'M' для вкл/выкл музыки",
    score: "Очки",
    level: "Уровень",
    jump: "Прыжок",
    shoot: "Стрелять",
    gameDescription: "Super Stack Attack - это увлекательная игра, в которой вы управляете персонажем, уклоняющимся от падающих " +
      "ящиков и собирающим бонусы. Ваша цель - собирать ящики в линии, продержаться как можно дольше и набрать " +
      "максимальное количество очков.",
    instructions: "Инструкции",
    moveLeft: "Стрелка влево или A для движения влево",
    moveRight: "Стрелка вправо или D для движения вправо",
    jumpKey: "Стрелка вверх, W или пробел для прыжка",
    shootLeft: "Нажмите ',' для стрельбы влево",
    shootRight: "Нажмите '.' для стрельбы вправо",
    collectHeart: "Собирайте сердца для получения дополнительных жизней",
    collectBullet: "Собирайте шарики для получения пуль",
    collectLines: "Уничтожайте целые линии из ящиков любых цветов",
    destroyRows: "Уничтожайте ряды из трех и более одинаковых ящиков",
    pauseKey: "Нажмите 'H' или 'P' для паузы/возобновления игры",
    soundKey: "Нажмите 'M' для включения/выключения музыки",
    goodLuck: "Удачи и веселой игры!",
    contactLine: 'Для связи <a href="https://t.me/botyouneeded">Telegram</a>'

  }
};

const language = navigator.language.startsWith('ru') ? 'ru' : 'en';

function t(key) {
  return translations[language][key] || key;
}