import { Utils } from './utils.js';

export default class FruitSlice {
    constructor(container) {
        this.container = container;
        this.name = "Fruit Slice";
        this.canvas = null;
        this.ctx = null;
        this.rafId = null;
        this.isActive = false;

        this.fruits = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.gameTime = 0;
        this.mousePath = [];
        this.isGameOver = false;
    }

    init() {
        this.createCanvas();
        this.bindEvents();
        this.reset();
        this.loop();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.style.background = '#2c3e50 radial-gradient(#34495e, #2c3e50)';
    }

    bindEvents() {
        const trackMouse = (x, y) => {
            if (!this.isActive) return;
            this.mousePath.push({ x, y, life: 10 });
            if (this.mousePath.length > 10) this.mousePath.shift();
            this.checkSlice(x, y);
        };

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            trackMouse(e.clientX - rect.left, e.clientY - rect.top);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const t = e.touches[0];
            trackMouse(t.clientX - rect.left, t.clientY - rect.top);
        });

        this.canvas.addEventListener('click', () => {
            if (this.isGameOver) this.reset();
        })
    }

    reset() {
        this.fruits = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.gameTime = 0;
        this.isGameOver = false;
        this.isActive = true;
    }

    spawnFruit() {
        // Random fruit types
        const types = [
            { color: '#e74c3c', r: 20, score: 1 }, // Apple
            { color: '#f1c40f', r: 25, score: 2 }, // Lemon
            { color: '#2ecc71', r: 30, score: 3 }, // Melon
            { color: '#9b59b6', r: 15, score: 5 }, // Grape
            { color: '#000000', r: 25, score: 0, isBomb: true } // Bomb
        ];

        const type = types[Math.floor(Math.random() * types.length)];

        this.fruits.push({
            x: Utils.random(100, this.canvas.width - 100),
            y: this.canvas.height + 50,
            dx: Utils.random(-2, 2),
            dy: Utils.random(-10, -14),
            gravity: 0.2,
            ...type
        });
    }

    checkSlice(mx, my) {
        for (let i = this.fruits.length - 1; i >= 0; i--) {
            const f = this.fruits[i];
            if (f.isHalf) continue; // Don't slice halves again
            const dist = Math.hypot(f.x - mx, f.y - my);

            if (dist < f.r) {
                // Sliced
                this.createUnfairParticles(f.x, f.y, f.color);

                if (f.isBomb) {
                    this.gameOver();
                } else {
                    this.score += f.score;
                    Utils.Audio.play(600 + (f.score * 100), 'sawtooth', 0.05);

                    // Add halves
                    this.createHalves(f);
                }

                this.fruits.splice(i, 1);
            }
        }
    }

    createHalves(f) {
        // Create two fruits that move apart
        for (let dir of [-1, 1]) {
            this.fruits.push({
                x: f.x, y: f.y,
                dx: f.dx * 0.5 + (dir * 2), // split
                dy: f.dy,
                r: f.r * 0.8,
                color: f.color,
                gravity: f.gravity * 1.2,
                isHalf: true // tag for reduced score or no slice
            });
        }
    }

    createUnfairParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x, y,
                dx: Utils.random(-5, 5),
                dy: Utils.random(-5, 5),
                life: 30,
                color
            });
        }
    }

    update() {
        if (this.gameTime % 60 === 0) { // Spawn rate
            this.spawnFruit();
        }

        // Update Fruits
        for (let i = this.fruits.length - 1; i >= 0; i--) {
            const f = this.fruits[i];
            f.dy += f.gravity;
            f.x += f.dx;
            f.y += f.dy;

            // Missed fruit
            if (f.y > this.canvas.height + 60) {
                if (!f.isBomb) {
                    this.lives--;
                    if (this.lives <= 0) this.gameOver();
                }
                this.fruits.splice(i, 1);
            }
        }

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.dx;
            p.y += p.dy;
            p.life--;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        this.gameTime++;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Trail
        if (this.mousePath.length > 1) {
            this.ctx.beginPath();
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.moveTo(this.mousePath[0].x, this.mousePath[0].y);

            // Draw blade path
            for (let i = 1; i < this.mousePath.length; i++) {
                const p = this.mousePath[i];
                this.ctx.lineTo(p.x, p.y);
                p.life--;
            }

            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.lineWidth = 6;
            this.ctx.stroke();

            // Inner glow
            this.ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
            this.ctx.lineWidth = 10;
            this.ctx.stroke();
        }

        // Fruits
        this.fruits.forEach(f => {
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);

            // Fruit Gradient
            const fGrad = this.ctx.createRadialGradient(f.x - 5, f.y - 5, 2, f.x, f.y, f.r);
            if (f.isBomb) {
                fGrad.addColorStop(0, '#555');
                fGrad.addColorStop(1, '#000');
            } else {
                fGrad.addColorStop(0, '#fff'); // Shine
                fGrad.addColorStop(0.3, f.color);
                fGrad.addColorStop(1, this.darken(f.color, 30)); // Shadow edge
            }

            this.ctx.fillStyle = fGrad;
            this.ctx.fill();

            if (f.isBomb) {
                // Fuse
                this.ctx.strokeStyle = '#e67e22';
                this.ctx.beginPath();
                this.ctx.moveTo(f.x, f.y - f.r);
                this.ctx.quadraticCurveTo(f.x + 5, f.y - f.r - 10, f.x + 10, f.y - f.r - 5);
                this.ctx.stroke();

                // Spark
                if (Math.random() > 0.5) {
                    this.ctx.fillStyle = '#f1c40f';
                    this.ctx.fillRect(f.x + 10, f.y - f.r - 6, 3, 3);
                }
            }
        });

        // Particles
        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life / 30;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        });

        // HUD
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px "Segoe UI"';
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
        this.ctx.fillText(`Lives: ${'❤️'.repeat(this.lives)}`, 20, 80);

        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.textAlign = 'center';
            this.ctx.font = '900 40px "Segoe UI"';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px "Segoe UI"';
            this.ctx.fillText('Tap to Restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
        }
    }

    darken(col, amt) {
        // Simple shim, ideally use proper color util. 
        // Assuming hex.
        return col; // Todo: implement
    }

    gameOver() {
        this.isActive = false;
        this.isGameOver = true;
        Utils.Audio.play(100, 'square', 0.5);
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
