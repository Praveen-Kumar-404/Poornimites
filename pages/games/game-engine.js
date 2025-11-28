// Game Engine - Shared utilities for all games

class GameEngine {
    constructor(gameName) {
        this.gameName = gameName;
        this.score = 0;
        this.highScore = this.getHighScore();
        this.isPaused = false;
        this.isRunning = false;
    }

    // Score Management
    updateScore(points) {
        this.score += points;
        this.updateScoreDisplay();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    setScore(score) {
        this.score = score;
        this.updateScoreDisplay();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    updateScoreDisplay() {
        const scoreEl = document.getElementById('current-score');
        const highScoreEl = document.getElementById('game-high-score');

        if (scoreEl) scoreEl.textContent = this.score;
        if (highScoreEl) highScoreEl.textContent = this.highScore;
    }

    // High Score Persistence
    saveHighScore() {
        localStorage.setItem(`${this.gameName}_highscore`, this.highScore);
        this.updateMenuHighScore();
    }

    getHighScore() {
        return parseInt(localStorage.getItem(`${this.gameName}_highscore`) || '0');
    }

    updateMenuHighScore() {
        const menuHighScore = document.getElementById(`${this.gameName}-high`);
        if (menuHighScore) {
            menuHighScore.textContent = this.highScore;
        }
    }

    // Game State
    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    reset() {
        this.score = 0;
        this.isPaused = false;
        this.updateScoreDisplay();
    }

    // Utility Functions
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Canvas Helper
    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    clearCanvas(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
    }
}

// Touch/Swipe Detection
class SwipeDetector {
    constructor(element, callbacks) {
        this.element = element;
        this.callbacks = callbacks;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;

        this.element.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
        this.element.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe();
    }

    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > this.minSwipeDistance) {
                if (deltaX > 0) {
                    this.callbacks.right && this.callbacks.right();
                } else {
                    this.callbacks.left && this.callbacks.left();
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > this.minSwipeDistance) {
                if (deltaY > 0) {
                    this.callbacks.down && this.callbacks.down();
                } else {
                    this.callbacks.up && this.callbacks.up();
                }
            }
        }
    }
}

// Keyboard Handler
class KeyboardHandler {
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.keys = {};

        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.handleKeyPress(e.key, e);
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    handleKeyPress(key, event) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            ' ': 'space',
            'Enter': 'enter',
            'Escape': 'escape'
        };

        const action = keyMap[key] || key.toLowerCase();

        if (this.callbacks[action]) {
            event.preventDefault();
            this.callbacks[action]();
        }
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }
}

// Collision Detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

// Animation Frame Loop
class GameLoop {
    constructor(updateCallback, fps = 60) {
        this.updateCallback = updateCallback;
        this.fps = fps;
        this.frameDelay = 1000 / fps;
        this.lastFrameTime = 0;
        this.animationId = null;
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.loop();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    loop(currentTime = performance.now()) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastFrameTime;

        if (deltaTime >= this.frameDelay) {
            this.updateCallback(deltaTime);
            this.lastFrameTime = currentTime - (deltaTime % this.frameDelay);
        }

        this.animationId = requestAnimationFrame((time) => this.loop(time));
    }
}
