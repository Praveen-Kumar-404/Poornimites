// Breakout Game

class BreakoutGame extends GameEngine {
    constructor() {
        super('breakout');
        this.canvas = null;
        this.ctx = null;
        this.paddle = { x: 250, y: 550, width: 100, height: 15, speed: 8 };
        this.ball = { x: 300, y: 300, dx: 4, dy: -4, radius: 8 };
        this.bricks = [];
        this.brickRows = 5;
        this.brickCols = 8;
        this.gameLoop = null;
    }

    init() {
        const container = document.getElementById('game-container');
        container.innerHTML = '';

        this.canvas = this.createCanvas(600, 600);
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);

        this.createBricks();
        this.reset();

        // Mouse control
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.paddle.x = e.clientX - rect.left - this.paddle.width / 2;
        });

        // Touch control
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.paddle.x = e.touches[0].clientX - rect.left - this.paddle.width / 2;
        });

        this.start();
    }

    createBricks() {
        this.bricks = [];
        const brickWidth = 70;
        const brickHeight = 20;
        const padding = 5;

        for (let row = 0; row < this.brickRows; row++) {
            for (let col = 0; col < this.brickCols; col++) {
                this.bricks.push({
                    x: col * (brickWidth + padding) + 5,
                    y: row * (brickHeight + padding) + 30,
                    width: brickWidth,
                    height: brickHeight,
                    active: true
                });
            }
        }
    }

    start() {
        this.isRunning = true;
        this.gameLoop = new GameLoop(() => this.update(), 60);
        this.gameLoop.start();
    }

    update() {
        if (this.isPaused || !this.isRunning) return;

        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Wall collision
        if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
            this.ball.dx *= -1;
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.dy *= -1;
        }

        // Paddle collision
        if (this.ball.y + this.ball.radius > this.paddle.y &&
            this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.width) {
            this.ball.dy *= -1;
        }

        // Bottom wall (game over)
        if (this.ball.y + this.ball.radius > this.canvas.height) {
            this.gameOver();
            return;
        }

        // Brick collision
        this.bricks.forEach(brick => {
            if (brick.active && checkCollision(
                {
                    x: this.ball.x - this.ball.radius, y: this.ball.y - this.ball.radius,
                    width: this.ball.radius * 2, height: this.ball.radius * 2
                },
                brick
            )) {
                this.ball.dy *= -1;
                brick.active = false;
                this.updateScore(10);
            }
        });

        // Win condition
        if (this.bricks.every(brick => !brick.active)) {
            alert('You Win!');
            this.restart();
        }

        this.draw();
    }

    draw() {
        this.clearCanvas(this.ctx, this.canvas.width, this.canvas.height);

        // Bricks
        this.bricks.forEach(brick => {
            if (brick.active) {
                this.ctx.fillStyle = '#0066cc';
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });

        // Paddle
        this.ctx.fillStyle = '#003366';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

        // Ball
        this.ctx.fillStyle = '#d32f2f';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
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

let breakoutGame = null;

function initBreakout() {
    breakoutGame = new BreakoutGame();
    breakoutGame.init();

    document.getElementById('game-instructions').innerHTML = `
        <h3>How to Play</h3>
        <p><strong>Desktop:</strong> Move mouse to control paddle</p>
        <p><strong>Mobile:</strong> Touch and drag to move paddle</p>
        <p>Break all the bricks without letting the ball fall!</p>
    `;
}
