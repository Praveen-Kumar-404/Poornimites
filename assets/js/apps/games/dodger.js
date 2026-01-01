import { Utils } from './utils.js';

export default class Dodger {
    constructor(container) {
        this.container = container;
        this.name = "Dodger";
        this.canvas = null;
        this.ctx = null;
        this.rafId = null;
        this.isActive = false;

        this.player = { x: 0, y: 0, w: 30, h: 30, speed: 5 };
        this.enemies = [];
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;

        this.keys = { ArrowLeft: false, ArrowRight: false };
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
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.style.background = '#2c3e50';
    }

    bindControls() {
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        // Touch
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.player.x = (e.touches[0].clientX - rect.left) - this.player.w / 2;
            // Clamp
            if (this.player.x < 0) this.player.x = 0;
            if (this.player.x + this.player.w > this.canvas.width) this.player.x = this.canvas.width - this.player.w;
        });

        this.canvas.addEventListener('click', () => {
            if (this.isGameOver) this.reset();
        });
    }

    reset() {
        this.player.x = this.canvas.width / 2 - 15;
        this.player.y = this.canvas.height - 50;
        this.enemies = [];
        this.score = 0;
        this.level = 1;
        this.isActive = true;
        this.isGameOver = false;
    }

    update() {
        // Player Move
        if (this.keys.ArrowLeft && this.player.x > 0) this.player.x -= this.player.speed;
        if (this.keys.ArrowRight && this.player.x + this.player.w < this.canvas.width) this.player.x += this.player.speed;

        // Spawn Enemies
        if (Math.random() < 0.05 + (this.level * 0.01)) {
            const size = Utils.randomInt(20, 50);
            this.enemies.push({
                x: Utils.randomInt(0, this.canvas.width - size),
                y: -size,
                w: size,
                h: size,
                speed: Utils.random(2, 5) + this.level
            });
        }

        // Update Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.y += e.speed;

            // Collision
            if (Utils.rectIntersect(
                { left: this.player.x, right: this.player.x + this.player.w, top: this.player.y, bottom: this.player.y + this.player.h },
                { left: e.x, right: e.x + e.w, top: e.y, bottom: e.y + e.h }
            )) {
                this.gameOver();
            }

            if (e.y > this.canvas.height) {
                this.enemies.splice(i, 1);
                this.score++;
                if (this.score % 20 === 0) {
                    this.level++;
                    this.speedUpEffect = 20;
                }
            }
        }
    }

    draw() {
        // Dark Grid Background
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid Lines
        this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Player Trail
        if (!this.player.trail) this.player.trail = [];
        this.player.trail.push({ x: this.player.x, y: this.player.y });
        if (this.player.trail.length > 5) this.player.trail.shift();

        this.player.trail.forEach((t, i) => {
            this.ctx.fillStyle = `rgba(0, 210, 211, ${i / 10})`;
            this.ctx.fillRect(t.x, t.y, this.player.w, this.player.h);
        });

        // Player (Neon Box)
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00d2d3';
        this.ctx.fillStyle = '#00d2d3';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);

        // Inner Core
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.player.x + 5, this.player.y + 5, this.player.w - 10, this.player.h - 10);
        this.ctx.shadowBlur = 0;

        // Enemies (Red Neon)
        this.enemies.forEach(e => {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ff6b6b';
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.fillRect(e.x, e.y, e.w, e.h);

            // Detail
            this.ctx.fillStyle = '#c0392b';
            this.ctx.fillRect(e.x + 4, e.y + 4, e.w - 8, e.h - 8);
            this.ctx.shadowBlur = 0;
        });

        // HUD
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px "Courier New"';
        this.ctx.fillText(`SCORE: ${this.score}`, 15, 35);
        this.ctx.fillText(`LVL: ${this.level}`, 15, 65);

        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ff6b6b';
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 40px "Courier New"';
            this.ctx.fillText('CRASHED', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.shadowBlur = 0;

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px "Courier New"';
            this.ctx.fillText('Click to Retry', this.canvas.width / 2, this.canvas.height / 2 + 50);
            this.ctx.textAlign = 'left';
        }
    }

    gameOver() {
        this.isActive = false;
        this.isGameOver = true;
        Utils.Audio.play(100, 'sawtooth', 0.5);
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
    }
}
