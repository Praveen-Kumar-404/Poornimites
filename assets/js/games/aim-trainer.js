import { Utils } from './utils.js';

export default class AimTrainer {
    constructor(container) {
        this.container = container;
        this.name = "Aim Trainer";
        this.activeTargets = [];
        this.score = 0;
        this.clicks = 0;
        this.startTime = 0;
        this.isGameActive = false;
        this.containerRect = null;
    }

    init() {
        this.container.style.position = 'relative';
        this.container.style.background = '#2c3e50';
        this.container.style.overflow = 'hidden';

        // Start Overlay
        this.startBtn = document.createElement('button');
        this.startBtn.innerText = 'Start Aiming';
        this.startBtn.style.padding = '15px 30px';
        this.startBtn.style.fontSize = '20px';
        this.startBtn.style.position = 'absolute';
        this.startBtn.style.top = '50%';
        this.startBtn.style.left = '50%';
        this.startBtn.style.transform = 'translate(-50%, -50%)';
        this.startBtn.addEventListener('click', () => this.start());
        this.container.appendChild(this.startBtn);

        // Stats
        this.stats = document.createElement('div');
        this.stats.style.position = 'absolute';
        this.stats.style.top = '10px';
        this.stats.style.left = '10px';
        this.stats.style.color = '#fff';
        this.stats.style.fontSize = '18px';
        this.stats.style.pointerEvents = 'none';
        this.container.appendChild(this.stats);

        this.container.addEventListener('mousedown', (e) => {
            if (this.isGameActive && e.target === this.container) {
                this.clicks++;
                this.updateStats();
            }
        });
    }

    start() {
        this.startBtn.style.display = 'none';
        this.score = 0;
        this.clicks = 0;
        this.startTime = Date.now();
        this.isGameActive = true;
        this.containerRect = this.container.getBoundingClientRect();

        this.spawnTarget();
        this.updateStats();

        // Auto end after 30s
        setTimeout(() => this.end(), 30000);
    }

    spawnTarget() {
        if (!this.isGameActive) return;

        const t = document.createElement('div');
        const size = Utils.randomInt(30, 60);
        const x = Utils.randomInt(0, this.container.clientWidth - size);
        const y = Utils.randomInt(0, this.container.clientHeight - size);

        t.style.width = size + 'px';
        t.style.height = size + 'px';

        // Bullseye Gradient
        t.style.background = 'radial-gradient(circle, #e74c3c 30%, #ecf0f1 31%, #ecf0f1 50%, #e74c3c 51%)';

        t.style.borderRadius = '50%';
        t.style.position = 'absolute';
        t.style.left = x + 'px';
        t.style.top = y + 'px';
        t.style.cursor = 'crosshair';
        t.style.border = '2px solid #fff';
        t.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        t.style.transition = 'transform 0.1s';

        // Scale In
        t.style.transform = 'scale(0)';
        setTimeout(() => t.style.transform = 'scale(1)', 10);

        t.addEventListener('mouseover', () => t.style.transform = 'scale(1.1)');
        t.addEventListener('mouseout', () => t.style.transform = 'scale(1)');

        t.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // prevent container click count (miss)
            this.hit();
            t.remove();
        });

        this.container.appendChild(t);
    }

    hit() {
        this.score++;
        this.clicks++;
        Utils.Audio.play(800, 'sine', 0.05);
        this.updateStats();

        // Ripple Effect
        const ripple = document.createElement('div');
        ripple.className = 'anim-ripple';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.left = event.clientX - this.containerRect.left - 10 + 'px'; // approximate
        ripple.style.top = event.clientY - this.containerRect.top - 10 + 'px';
        this.container.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        this.spawnTarget();
    }

    updateStats() {
        const acc = this.clicks > 0 ? Math.round((this.score / this.clicks) * 100) : 100;
        this.stats.innerText = `Score: ${this.score} | Acc: ${acc}%`;
    }

    end() {
        this.isGameActive = false;
        this.container.innerHTML = ''; // active targets clear
        this.init(); // Restart UI
        this.startBtn.innerText = `Finished! Score: ${this.score}`;
        this.startBtn.style.display = 'block';
    }

    destroy() {
        this.isGameActive = false;
        this.container.innerHTML = '';
    }
}
