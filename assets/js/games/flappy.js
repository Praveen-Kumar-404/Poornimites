import { Utils } from './utils.js';

export default class FlappyBird {
    constructor(container) {
        this.container = container;
        this.name = "Flappy Clone";
        this.canvas = null;
        this.ctx = null;
        this.rafId = null;
        this.isActive = false;

        // Game State
        this.bird = { x: 50, y: 150, w: 30, h: 30, dy: 0, jump: -6, gravity: 0.25 };
        this.pipes = [];
        this.score = 0;
        this.highScore = Utils.Storage.get('flappy_high', 0);
        this.speed = 2;
        this.frameCount = 0;
        this.isGameOver = false;
    }

    init() {
        this.createCanvas();
        this.bindControls();
        this.reset();
        this.loop();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        // Styling
        this.canvas.style.border = '2px solid #fff';
        this.canvas.style.background = '#70c5ce'; // sky blue
    }

    bindControls() {
        // Mouse/Touch
        const jumpHandler = (e) => {
            if (this.isGameOver) {
                this.reset();
            } else {
                this.jump();
            }
        };
        this.canvas.addEventListener('mousedown', jumpHandler);
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jumpHandler(e); });

        // Keyboard
        this.keyHandler = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                if (this.isGameOver) {
                    this.reset();
                } else {
                    this.jump();
                }
            }
        };
        window.addEventListener('keydown', this.keyHandler);
    }

    reset() {
        this.bird.y = 150;
        this.bird.dy = 0;
        this.pipes = [];
        this.score = 0;
        this.frameCount = 0;
        this.isGameOver = false;
        this.speed = 2;
        this.isActive = true;
    }

    jump() {
        this.bird.dy = this.bird.jump;
        Utils.Audio.play(400, 'square', 0.1);
    }

    update() {
        // Bird Physics
        this.bird.dy += this.bird.gravity;
        this.bird.y += this.bird.dy;

        // Pipe Spawning
        if (this.frameCount % 120 === 0) {
            const gap = 120;
            const minHeight = 50;
            const maxHeight = this.canvas.height - gap - minHeight;
            const topHeight = Utils.randomInt(minHeight, maxHeight);

            this.pipes.push({
                x: this.canvas.width,
                y: 0,
                w: 50,
                h: topHeight,
                passed: false
            }); // Top Pipe

            this.pipes.push({
                x: this.canvas.width,
                y: topHeight + gap,
                w: 50,
                h: this.canvas.height - (topHeight + gap),
                type: 'bottom'
            }); // Bottom Pipe
        }

        // Pipe Movement & Collision
        for (let i = 0; i < this.pipes.length; i++) {
            const p = this.pipes[i];
            p.x -= this.speed;

            // Collision
            // Bird Box (smaller than render for easier gameplay)
            const birdRect = { left: this.bird.x + 5, right: this.bird.x + 25, top: this.bird.y + 5, bottom: this.bird.y + 25 };
            const pipeRect = { left: p.x, right: p.x + p.w, top: p.y, bottom: p.y + p.h };

            if (Utils.rectIntersect(birdRect, pipeRect)) {
                this.gameOver();
            }

            // Score
            if (p.type === 'bottom' && !p.passed && p.x + p.w < this.bird.x) {
                this.score++;
                p.passed = true;
                Utils.Audio.play(600, 'sine', 0.1);

                // Speed up slightly
                if (this.score % 5 === 0) this.speed += 0.2;
            }
        }

        // Remove off-screen pipes
        this.pipes = this.pipes.filter(p => p.x + p.w > 0);

        // Ground/Ceiling Collision
        if (this.bird.y + this.bird.h > this.canvas.height || this.bird.y < 0) {
            this.gameOver();
        }

        this.frameCount++;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Bird
        this.ctx.fillStyle = '#ffeb3b';
        this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.w, this.bird.h);

        // Eye
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.bird.x + 20, this.bird.y + 5, 5, 5);

        // Pipes
        this.ctx.fillStyle = '#4caf50';
        this.pipes.forEach(p => {
            this.ctx.fillRect(p.x, p.y, p.w, p.h);
            // Outline
            this.ctx.strokeStyle = '#2e7d32';
            this.ctx.strokeRect(p.x, p.y, p.w, p.h);
        });

        // HUD
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.fillText(this.score, 20, 40);

        if (this.isGameOver) {
            this.drawGameOver();
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);

        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.fillText('Tap to Restart', this.canvas.width / 2, this.canvas.height / 2 + 60);

        this.ctx.textAlign = 'left'; // Reset
    }

    gameOver() {
        this.isGameOver = true;
        this.isActive = false;
        Utils.Audio.play(150, 'sawtooth', 0.3);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            Utils.Storage.set('flappy_high', this.highScore);
        }
    }

    loop() {
        if (!this.isActive && !this.isGameOver) return; // Paused or destroyed

        if (!this.isGameOver) {
            this.update();
        }
        this.draw();

        if (this.isActive || this.isGameOver) {
            this.rafId = requestAnimationFrame(() => this.loop());
        }
    }

    destroy() {
        this.isActive = false;
        this.isGameOver = false; // Stop loop
        cancelAnimationFrame(this.rafId);
        window.removeEventListener('keydown', this.keyHandler);
        // Canvas is cleared by hub
    }
}
