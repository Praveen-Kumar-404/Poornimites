// Flappy Bird Game

class FlappyGame extends GameEngine {
    constructor() {
        super('flappy');
        this.canvas = null;
        this.ctx = null;
        this.bird = { x: 80, y: 200, velocity: 0, radius: 15 };
        this.pipes = [];
        this.gravity = 0.5;
        this.jumpStrength = -8;
        this.pipeGap = 150;
        this.pipeWidth = 60;
        this.gameLoop = null;
    }

    init() {
        const container = document.getElementById('game-container');
        container.innerHTML = '';

        this.canvas = this.createCanvas(400, 600);
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);

        this.bird = { x: 80, y: 200, velocity: 0, radius: 15 };
        this.pipes = [];
        this.reset();

        // Controls
        this.canvas.addEventListener('click', () => this.jump());
        new KeyboardHandler({
            space: () => this.jump()
        });

        this.start();
    }

    start() {
        this.isRunning = true;
        this.gameLoop = new GameLoop(() => this.update(), 60);
        this.gameLoop.start();
    }

    jump() {
        if (!this.isPaused && this.isRunning) {
            this.bird.velocity = this.jumpStrength;
        }
    }

    update() {
        if (this.isPaused || !this.isRunning) return;

        // Update bird
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

        // Check ground/ceiling collision
        if (this.bird.y + this.bird.radius > this.canvas.height || this.bird.y - this.bird.radius < 0) {
            this.gameOver();
            return;
        }

        // Update pipes
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - 200) {
            const gapY = this.randomInt(100, this.canvas.height - this.pipeGap - 100);
            this.pipes.push({ x: this.canvas.width, gapY });
        }

        this.pipes.forEach(pipe => {
            pipe.x -= 3;

            // Check collision
            if (this.bird.x + this.bird.radius > pipe.x &&
                this.bird.x - this.bird.radius < pipe.x + this.pipeWidth) {
                if (this.bird.y - this.bird.radius < pipe.gapY ||
                    this.bird.y + this.bird.radius > pipe.gapY + this.pipeGap) {
                    this.gameOver();
                    return;
                }
            }

            // Score point
            if (pipe.x + this.pipeWidth === this.bird.x && !pipe.scored) {
                this.updateScore(1);
                pipe.scored = true;
            }
        });

        // Remove off-screen pipes
        this.pipes = this.pipes.filter(pipe => pipe.x > -this.pipeWidth);

        this.draw();
    }

    draw() {
        // Sky
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Bird
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, this.bird.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Pipes
        this.ctx.fillStyle = '#388e3c';
        this.pipes.forEach(pipe => {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.gapY);
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.gapY + this.pipeGap, this.pipeWidth, this.canvas.height);
        });
    }

    gameOver() {
        this.isRunning = false;
        this.gameLoop.stop();
        alert(`Game Over! Score: ${this.score}`);
    }

    restart() {
        this.gameLoop.stop();
        this.init();
    }

    cleanup() {
        if (this.gameLoop) this.gameLoop.stop();
    }
}

let flappyGame = null;

function initFlappy() {
    flappyGame = new FlappyGame();
    flappyGame.init();

    document.getElementById('game-instructions').innerHTML = `
        <h3>How to Play</h3>
        <p><strong>Desktop:</strong> Press SPACE to flap</p>
        <p><strong>Mobile:</strong> Tap the screen to flap</p>
        <p>Navigate through the pipes without hitting them!</p>
    `;
}
