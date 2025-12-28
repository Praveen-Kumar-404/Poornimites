import { Utils } from './utils.js';

export default class EndlessRunner {
    constructor(container) {
        this.container = container;
        this.name = "Endless Runner";
        this.canvas = null;
        this.ctx = null;
        this.rafId = null;
        this.isActive = false;

        this.player = { x: 50, y: 0, w: 30, h: 50, dy: 0, jumpPower: -12, grounded: true };
        this.groundY = 350;
        this.obstacles = [];
        this.gravity = 0.6;
        this.speed = 5;
        this.score = 0;
        this.frameCount = 0;
        this.highScore = Utils.Storage.get('runner_high', 0);
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
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.style.background = '#f0f0f0';
        this.canvas.style.border = '2px solid #333';
    }

    bindControls() {
        const jump = () => {
            if (this.isGameOver) {
                this.reset();
            } else if (this.player.grounded) {
                this.player.dy = this.player.jumpPower;
                this.player.grounded = false;
                Utils.Audio.play(300, 'square', 0.1);
            }
        };

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') jump();
        });

        this.canvas.addEventListener('mousedown', jump);
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); });
    }

    reset() {
        this.player.y = this.groundY - this.player.h;
        this.player.dy = 0;
        this.obstacles = [];
        this.score = 0;
        this.speed = 5;
        this.frameCount = 0;
        this.isGameOver = false;
        this.isActive = true;
    }

    update() {
        // Player Physics
        if (!this.player.grounded) {
            this.player.dy += this.gravity;
            this.player.y += this.player.dy;
        }

        // Ground Collision
        if (this.player.y + this.player.h >= this.groundY) {
            this.player.y = this.groundY - this.player.h;
            this.player.dy = 0;
            this.player.grounded = true;
        }

        // Spawning Obstacles
        if (this.frameCount % Math.floor(1000 / this.speed) === 0) { // randomness based on speed
            if (Math.random() > 0.4) {
                const type = Math.random() > 0.8 ? 'tall' : 'small';
                const h = type === 'tall' ? 60 : 30;
                this.obstacles.push({
                    x: this.canvas.width,
                    y: this.groundY - h,
                    w: 30,
                    h: h
                });
            }
        }

        // Move Obstacles
        this.obstacles.forEach(obs => {
            obs.x -= this.speed;
        });

        // Collision
        const pRect = { left: this.player.x + 5, right: this.player.x + 25, top: this.player.y + 5, bottom: this.player.y + 45 };

        for (let obs of this.obstacles) {
            const oRect = { left: obs.x, right: obs.x + obs.w, top: obs.y, bottom: obs.y + obs.h };
            if (Utils.rectIntersect(pRect, oRect)) {
                this.gameOver();
            }
        }

        // Cleanup & Score
        this.obstacles = this.obstacles.filter(obs => obs.x + obs.w > 0);
        this.score++;

        // Speed scaling
        if (this.score % 500 === 0) this.speed += 0.5;

        this.frameCount++;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Ground
        this.ctx.fillStyle = '#555';
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);

        // Player Draw with Squash & Stretch
        this.ctx.save();
        this.ctx.translate(this.player.x + this.player.w / 2, this.player.y + this.player.h); // Pivot at bottom center

        let scaleX = 1, scaleY = 1;

        // Jump Stretch
        if (!this.player.grounded) {
            scaleX = 0.8; scaleY = 1.2;
        }
        // Landing Squash (Approximation based on dy)
        else if (Math.abs(this.player.dy) > 1) { // Just landed? logic needs state, simple grounded check is stationary
            // Simplified: constant
        }

        this.ctx.scale(scaleX, scaleY);

        this.ctx.fillStyle = '#d63031';
        this.ctx.fillRect(-this.player.w / 2, -this.player.h, this.player.w, this.player.h);

        // Eye (to see direction)
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(5, -this.player.h + 5, 10, 5);

        this.ctx.restore();

        // Obstacles
        this.ctx.fillStyle = '#2d3436';
        this.obstacles.forEach(obs => {
            this.ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        });

        // Score
        this.ctx.fillStyle = '#000';
        this.ctx.font = '20px monospace';
        this.ctx.fillText(`Score: ${Math.floor(this.score / 10)}`, 20, 30);
        this.ctx.fillText(`High: ${Math.floor(this.highScore / 10)}`, 20, 55);

        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = 'center';
            this.ctx.font = '30px Arial';
            this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press Jump to Restart', this.canvas.width / 2, this.canvas.height / 2 + 40);
            this.ctx.textAlign = 'left';
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.isActive = false;
        Utils.Audio.play(100, 'sawtooth', 0.2);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            Utils.Storage.set('runner_high', this.highScore);
        }
    }

    loop() {
        if (!this.isActive && !this.isGameOver) return;
        if (!this.isGameOver) this.update();
        this.draw();
        if (this.isActive || this.isGameOver) {
            this.rafId = requestAnimationFrame(() => this.loop());
        }
    }

    destroy() {
        this.isActive = false;
        this.isGameOver = false;
        cancelAnimationFrame(this.rafId);
        // Events cleared by hub logic (ideally, naming the handler makes it easier to remove, but hub destroys container)
    }
}
