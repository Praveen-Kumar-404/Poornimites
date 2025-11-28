// Main Games Controller

let currentGame = null;

// Initialize high scores on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAllHighScores();
});

function updateAllHighScores() {
    const games = ['snake', 'flappy', 'breakout', 'pong', '2048', 'dordle', 'quordle', 'nerdle'];
    games.forEach(game => {
        const highScore = localStorage.getItem(`${game}_highscore`) || '0';
        const el = document.getElementById(`${game}-high`);
        if (el) el.textContent = highScore;
    });
}

function startGame(gameName) {
    // Hide menu, show game screen
    document.getElementById('game-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    // Update game title
    const titles = {
        'snake': 'Snake',
        'flappy': 'Flappy Bird',
        'breakout': 'Breakout',
        'pong': 'Pong',
        '2048': '2048',
        'dordle': 'Dordle',
        'quordle': 'Quordle',
        'nerdle': 'Nerdle'
    };
    document.getElementById('current-game-title').textContent = titles[gameName];

    // Cleanup previous game
    if (currentGame && currentGame.cleanup) {
        currentGame.cleanup();
    }

    // Initialize new game
    switch (gameName) {
        case 'snake':
            initSnake();
            currentGame = snakeGame;
            break;
        case 'flappy':
            initFlappy();
            currentGame = flappyGame;
            break;
        case 'breakout':
            initBreakout();
            currentGame = breakoutGame;
            break;
        case 'pong':
            initPong();
            currentGame = pongGame;
            break;
        case '2048':
            init2048();
            currentGame = game2048;
            break;
        case 'dordle':
            initDordle();
            currentGame = dordleGame;
            break;
        case 'quordle':
            initQuordle();
            currentGame = quordleGame;
            break;
        case 'nerdle':
            initNerdle();
            currentGame = nerdleGame;
            break;
    }

    // Setup control buttons
    setupGameControls();

    // Start game in paused state by default
    if (currentGame && currentGame.pause) {
        currentGame.pause();
        resetControlButton();
    }
}

function setupGameControls() {
    const controlBtn = document.getElementById('unified-control-btn');
    let gameState = 'paused'; // States: 'paused', 'playing', 'ended'

    controlBtn.onclick = () => {
        if (!currentGame) return;

        if (gameState === 'paused') {
            // Play/Resume
            if (currentGame.resume) {
                currentGame.resume();
            }
            gameState = 'playing';
            controlBtn.textContent = '⏸ Pause';
            controlBtn.className = 'control-btn playing';

        } else if (gameState === 'playing') {
            // Pause
            if (currentGame.pause) {
                currentGame.pause();
            }
            gameState = 'paused';
            controlBtn.textContent = '▶ Resume';
            controlBtn.className = 'control-btn paused';

        } else if (gameState === 'ended') {
            // Restart
            if (currentGame.restart) {
                currentGame.restart();
            }
            gameState = 'paused';
            controlBtn.textContent = '▶ Play';
            controlBtn.className = 'control-btn paused';
        }
    };

    // Function to set game to ended state (call this when game is over)
    window.setGameEnded = () => {
        gameState = 'ended';
        controlBtn.textContent = '🔄 Restart';
        controlBtn.className = 'control-btn ended';
    };

    // Function to reset button state
    window.resetControlButton = () => {
        gameState = 'paused';
        controlBtn.textContent = '▶ Play';
        controlBtn.className = 'control-btn paused';
    };
}

function backToMenu() {
    // Cleanup current game
    if (currentGame && currentGame.cleanup) {
        currentGame.cleanup();
    }
    currentGame = null;

    // Show menu, hide game screen
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('game-menu').classList.remove('hidden');

    // Update high scores
    updateAllHighScores();
}
