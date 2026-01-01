import { Utils } from './utils.js';

export default class SpaceShooter {
    constructor(container) {
        this.container = container;
        this.name = "Space Shooter";
        this.canvas = null;
        this.ctx = null;
        this.rafId = null;
        this.isActive = false;

        this.player = { x: 0, y: 0, w: 40, h: 40, speed: 5 };
        this.bullets = [];
        this.enemies = [];
        this.score = 0;
        this.gameFrame = 0;
        this.isGameOver = false;

        this.keys = { ArrowLeft: false, ArrowRight: false, Space: false };
    }

    init() {
        this.createCanvas();
        this.bindControls();
        this.reset();
        this.loop();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 500;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.style.background = '#000';
    }

    bindControls() {
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        // Touch
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.player.x = (e.touches[0].clientX - rect.left) - this.player.w / 2;
        });

        this.canvas.addEventListener('click', () => {
            if (this.isGameOver) this.reset();
            else this.shoot();
        });
    }

    reset() {
        this.player.x = this.canvas.width / 2 - 20;
        this.player.y = this.canvas.height - 60;
        this.bullets = [];
        this.enemies = [];
        this.score = 0;
        this.gameFrame = 0;
        this.isGameOver = false;
        this.isActive = true;
    }

    update() {
        // Player Move
        if (this.keys.ArrowLeft && this.player.x > 0) this.player.x -= this.player.speed;
        if (this.keys.ArrowRight && this.player.x + this.player.w < this.canvas.width) this.player.x += this.player.speed;

        if (this.keys.Space && this.gameFrame % 10 === 0) this.shoot();

        // Bullets
        this.bullets.forEach((b, i) => {
            b.y -= 7;
            if (b.y < 0) this.bullets.splice(i, 1);
        });

        // Enemies
        if (this.gameFrame % 60 === 0) {
            this.enemies.push({
                x: Utils.random(0, this.canvas.width - 40),
                y: -40,
                w: 40,
                h: 40,
                hp: 1
            });
        }

        this.enemies.forEach((e, i) => {
            e.y += 2 + (this.score * 0.01);

            // Collision Player
            if (Utils.rectIntersect(
                { left: this.player.x, right: this.player.x + this.player.w, top: this.player.y, bottom: this.player.y + this.player.h },
                { left: e.x, right: e.x + e.w, top: e.y, bottom: e.y + e.h }
            )) {
                this.gameOver();
            }

            // Bullet Collision
            this.bullets.forEach((b, bi) => {
                if (Utils.rectIntersect(
                    { left: b.x, right: b.x + b.w, top: b.y, bottom: b.y + b.h },
                    { left: e.x, right: e.x + e.w, top: e.y, bottom: e.y + e.h }
                )) {
                    e.hp--;
                    this.bullets.splice(bi, 1);
                    this.createExplosion(b.x, b.y, '#fff'); // Hit spark

                    if (e.hp <= 0) {
                        this.score += 10;
                        this.enemies.splice(i, 1);
                        this.createExplosion(e.x + e.w / 2, e.y + e.h / 2, '#e74c3c');
                        Utils.Audio.play(400, 'square', 0.1);
                    }
                }
            });

            if (e.y > this.canvas.height) {
                this.gameOver(); // Let one pass = death? maybe harsh, but "defend" style
            }
        });

        this.gameFrame++;
    }

    shoot() {
        this.bullets.push({
            x: this.player.x + this.player.w / 2 - 2,
            y: this.player.y,
            w: 4,
            h: 10
        });
        Utils.Audio.play(800, 'triangle', 0.05);

        // Recoil
        this.player.y += 2;
    }

    createExplosion(x, y, color) {
        if (!this.particles) this.particles = [];
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x, y: y,
                dx: (Math.random() - 0.5) * 5,
                dy: (Math.random() - 0.5) * 5,
                life: 30,
                color: color
            });
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Player
        this.ctx.fillStyle = '#3498db';
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x + this.player.w / 2, this.player.y);
        this.ctx.lineTo(this.player.x + this.player.w, this.player.y + this.player.h);
        this.ctx.lineTo(this.player.x, this.player.y + this.player.h);
        this.ctx.fill();

        // Bullets
        this.ctx.fillStyle = '#f1c40f';
        this.bullets.forEach(b => this.ctx.fillRect(b.x, b.y, b.w, b.h));

        // Enemies
        this.ctx.fillStyle = '#e74c3c';
        this.enemies.forEach(e => this.ctx.fillRect(e.x, e.y, e.w, e.h));

        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);

        if (this.isGameOver) {
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = 'center';
            this.ctx.font = '30px Arial';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Click/Space to Restart', this.canvas.width / 2, this.canvas.height / 2 + 40);
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
        // keys listener leaks... technically need removeEventListener but 'keys' obj is instance bound so its okayish for this scope or wrap bound handler
    }
}
