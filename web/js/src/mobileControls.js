function addMobileControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controlsContainer';
    controlsContainer.style.position = 'fixed';
    controlsContainer.style.bottom = '0';
    controlsContainer.style.left = '0';
    controlsContainer.style.width = '100%';
    controlsContainer.style.height = CONTROL_HEIGHT + 'px';
    controlsContainer.style.backgroundColor = '#f0f0f0';
    document.body.appendChild(controlsContainer);
    
    const leftButton = document.createElement('button');
    leftButton.textContent = '◀️';
    leftButton.className = 'mobile-control left';
    
    const shootButton = document.createElement('button');
    shootButton.textContent = '🔫';
    shootButton.className = 'mobile-control shoot';
    
    const jumpButton = document.createElement('button');
    jumpButton.textContent = '🔼';
    jumpButton.className = 'mobile-control jump';
    
    const rightButton = document.createElement('button');
    rightButton.textContent = '▶️';
    rightButton.className = 'mobile-control right';
    
    controlsContainer.appendChild(leftButton);
    controlsContainer.appendChild(shootButton);
    controlsContainer.appendChild(jumpButton);
    controlsContainer.appendChild(rightButton);

    leftButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.moveOnce(-1, boxes);
    });

    rightButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.moveOnce(1, boxes);
    });

    jumpButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.jump();
    });

    shootButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (player.hasBullet) {
            const bullet = player.shoot(player.lastDirection);
            if (bullet) {
                bullets.push(bullet);
                playSound(AUDIO.shoot);
            }
        }
    });
}