// Pong Game

class PongGame extends GameEngine {
    constructor() {
        super('pong');
        this.canvas = null;
        this.ctx = null;
        this.player = { x: 10, y: 200, width: 10, height: 80, score: 0 };
        this.ai = { x: 580, y: 200, width: 10, height: 80, score: 0 };
        this.ball = { x: 300, y: 200, dx: 4, dy: 4, radius: 8 };
        this.gameLoop = null;
    }

    init() {
        const container = document.getElementById('game-container');
        container.innerHTML = '';

        this.canvas = this.createCanvas(600, 400);
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);

        this.player.score = 0;
        this.ai.score = 0;
        this.reset();

        // Mouse control
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.player.y = e.clientY - rect.top - this.player.height / 2;
        });

        // Touch control
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.player.y = e.touches[0].clientY - rect.top - this.player.height / 2;
        });

        this.start();
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

        // Top/bottom wall collision
        if (this.ball.y + this.ball.radius > this.canvas.height || this.ball.y - this.ball.radius < 0) {
            this.ball.dy *= -1;
        }

        // Player paddle collision
        if (this.ball.x - this.ball.radius < this.player.x + this.player.width &&
            this.ball.y > this.player.y && this.ball.y < this.player.y + this.player.height) {
            this.ball.dx = Math.abs(this.ball.dx);
        }

        // AI paddle collision
        if (this.ball.x + this.ball.radius > this.ai.x &&
            this.ball.y > this.ai.y && this.ball.y < this.ai.y + this.ai.height) {
            this.ball.dx = -Math.abs(this.ball.dx);
        }

        // AI movement
        if (this.ball.y < this.ai.y + this.ai.height / 2) {
            this.ai.y -= 3;
        } else {
            this.ai.y += 3;
        }

        // Scoring
        if (this.ball.x < 0) {
            this.ai.score++;
            this.resetBall();
        } else if (this.ball.x > this.canvas.width) {
            this.player.score++;
            this.setScore(this.player.score);
            this.resetBall();
        }

        // Win condition
        if (this.player.score >= 10) {
            alert('You Win!');
            this.restart();
        } else if (this.ai.score >= 10) {
            alert('AI Wins!');
            this.restart();
        }

        this.draw();
    }

    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx *= -1;
    }

    draw() {
        // Background
        this.ctx.fillStyle = '#003366';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Center line
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Paddles
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.fillRect(this.ai.x, this.ai.y, this.ai.width, this.ai.height);

        // Ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Scores
        this.ctx.font = '32px Arial';
        this.ctx.fillText(this.player.score, this.canvas.width / 4, 50);
        this.ctx.fillText(this.ai.score, 3 * this.canvas.width / 4, 50);
    }

    restart() {
        this.gameLoop.stop();
        this.init();
    }

    cleanup() {
        if (this.gameLoop) this.gameLoop.stop();
    }
}

let pongGame = null;

function initPong() {
    pongGame = new PongGame();
    pongGame.init();

    document.getElementById('game-instructions').innerHTML = `
        <h3>How to Play</h3>
        <p><strong>Desktop:</strong> Move mouse to control your paddle</p>
        <p><strong>Mobile:</strong> Touch and drag to move your paddle</p>
        <p>First to 10 points wins!</p>
    `;
}
