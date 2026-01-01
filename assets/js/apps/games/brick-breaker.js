import { Utils } from './utils.js';
import { Anim } from './anim-utils.js';

export default class BrickBreaker {
    constructor(container) {
        this.container = container;
        this.name = "Brick Breaker";
        this.canvas = null;
        this.ctx = null;
        this.rafId = null;
        this.isActive = false;

        this.paddle = { x: 0, y: 0, w: 100, h: 20, dx: 0, speed: 8 };
        this.ball = { x: 0, y: 0, r: 8, dx: 4, dy: -4 };
        this.bricks = [];
        this.particles = [];
        this.rowCount = 5;
        this.colCount = 8;
        this.score = 0;
        this.highScore = Utils.Storage.get('breakout_high', 0);
        this.isGameOver = false;
        this.isWon = false;
    }

    init() {
        this.createCanvas();
        this.bindControls();
        this.reset();
        this.loop();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.style.background = '#2c3e50';
    }

    bindControls() {
        const moveHandler = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const rootX = e.clientX || e.touches[0].clientX;
            const relativeX = rootX - rect.left;

            this.paddle.x = relativeX - this.paddle.w / 2;

            // Clamp
            if (this.paddle.x < 0) this.paddle.x = 0;
            if (this.paddle.x + this.paddle.w > this.canvas.width) this.paddle.x = this.canvas.width - this.paddle.w;
        };

        this.canvas.addEventListener('mousemove', moveHandler);
        this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); moveHandler(e); });

        this.canvas.addEventListener('click', () => {
            if (this.isGameOver || this.isWon) this.reset();
        });
    }

    reset() {
        this.paddle.x = (this.canvas.width - this.paddle.w) / 2;
        this.paddle.y = this.canvas.height - 40;

        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 60;
        this.ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
        this.ball.dy = -4;

        this.createBricks();
        this.score = 0;
        this.isGameOver = false;
        this.isWon = false;
        this.isActive = true;
    }

    createBricks() {
        this.bricks = [];
        const padding = 10;
        const offsetTop = 50;
        const offsetLeft = 35;
        const brickW = 60;
        const brickH = 20;

        for (let c = 0; c < this.colCount; c++) {
            for (let r = 0; r < this.rowCount; r++) {
                this.bricks.push({
                    x: (c * (brickW + padding)) + offsetLeft,
                    y: (r * (brickH + padding)) + offsetTop,
                    w: brickW,
                    h: brickH,
                    status: 1
                });
            }
        }
    }

    update() {
        // Ball movement
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Wall collisions
        if (this.ball.x + this.ball.r > this.canvas.width || this.ball.x - this.ball.r < 0) {
            this.ball.dx = -this.ball.dx;
            Utils.Audio.play(200, 'sine', 0.05);
        }
        if (this.ball.y - this.ball.r < 0) {
            this.ball.dy = -this.ball.dy;
            Utils.Audio.play(200, 'sine', 0.05);
        }
        else if (this.ball.y + this.ball.r > this.canvas.height) {
            this.gameOver();
        }

        // Paddle Collision (Simple AABB + Circle approx)
        if (this.ball.y + this.ball.r >= this.paddle.y &&
            this.ball.y - this.ball.r <= this.paddle.y + this.paddle.h &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.w) {

            this.ball.dy = -Math.abs(this.ball.dy); // Force up

            // Add "english" based on hit position
            const hitPoint = this.ball.x - (this.paddle.x + this.paddle.w / 2);
            this.ball.dx = hitPoint * 0.15;
            Utils.Audio.play(300, 'triangle', 0.1);
        }

        // Brick Collision
        let activeBricks = 0;
        this.bricks.forEach(b => {
            if (b.status === 1) {
                activeBricks++;
                if (this.ball.x > b.x && this.ball.x < b.x + b.w &&
                    this.ball.y > b.y && this.ball.y < b.y + b.h) {
                    this.ball.dy = -this.ball.dy;
                    b.status = 0;
                    this.score += 10;

                    // Spawn Particles
                    Anim.createParticles(this.ctx, this.particles, b.x + b.w / 2, b.y + b.h / 2, '#3498db', 8);

                    Utils.Audio.play(500 + (this.score * 2), 'sine', 0.1);
                }
            }
        });

        // Update Particles
        Anim.updateParticles(this.ctx, this.particles);

        if (activeBricks === 0) {
            this.gameWon();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Particles (Draw first or last? Last for overlay, or first for background. Let's do last)

        // Bricks
        this.bricks.forEach(b => {
            if (b.status === 1) {
                this.ctx.fillStyle = '#3498db';
                this.ctx.fillRect(b.x, b.y, b.w, b.h);
            }
        });

        // Paddle
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h);

        // Ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.closePath();

        // Score
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);

        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = 'center';
            this.ctx.font = '30px Arial';
            this.ctx.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText("Click to Restart", this.canvas.width / 2, this.canvas.height / 2 + 40);
            this.ctx.textAlign = 'left';
        }

        if (this.isWon) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#f1c40f';
            this.ctx.textAlign = 'center';
            this.ctx.font = '30px Arial';
            this.ctx.fillText("YOU WIN!", this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText("Click to Restart", this.canvas.width / 2, this.canvas.height / 2 + 40);
            this.ctx.textAlign = 'left';
        }

        // Update & Draw Particles (after everything else)
        Anim.updateParticles(this.ctx, this.particles);
    }

    gameOver() {
        this.isActive = false;
        this.isGameOver = true;
        Utils.Audio.play(100, 'sawtooth', 0.5);
    }

    gameWon() {
        this.isActive = false;
        this.isWon = true;
        Utils.Audio.play(800, 'square', 0.5);
    }

    loop() {
        if (!this.isActive && !this.isGameOver && !this.isWon) return;
        if (this.isActive) this.update();
        this.draw();
        if (this.isActive || this.isGameOver || this.isWon) {
            this.rafId = requestAnimationFrame(() => this.loop());
        }
    }

    destroy() {
        this.isActive = false;
        this.isGameOver = false;
        cancelAnimationFrame(this.rafId);
    }
}
