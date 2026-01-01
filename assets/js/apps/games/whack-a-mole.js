import { Utils } from './utils.js';

export default class WhackAMole {
    constructor(container) {
        this.container = container;
        this.name = "Whack-a-Mole";
        this.holes = [];
        this.score = 0;
        this.timeLeft = 30;
        this.activeMole = null;
        this.gameInterval = null;
        this.timerInterval = null;
        this.isPlaying = false;
        this.grid = null;
    }

    init() {
        this.createUI();
    }

    createUI() {
        // Wrapper
        const wrapper = document.createElement('div');
        wrapper.style.textAlign = 'center';
        wrapper.style.color = '#fff';
        wrapper.style.width = '100%';
        wrapper.style.background = '#8BC34A'; // Grass
        wrapper.style.padding = '20px';
        wrapper.style.borderRadius = '10px';

        // Stats
        const stats = document.createElement('div');
        stats.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 20px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                Time: <span id="mole-time">30</span>s | Score: <span id="mole-score">0</span>
            </div>
            <button id="mole-start-btn" style="padding: 10px 30px; font-size: 20px; cursor: pointer; border: none; background: #FF5722; color: white; border-radius: 5px; box-shadow: 0 4px #E64A19;">Start Hamming!</button>
        `;
        wrapper.appendChild(stats);

        // Grid
        this.grid = document.createElement('div');
        this.grid.style.display = 'grid';
        this.grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        this.grid.style.gap = '20px';
        this.grid.style.maxWidth = '400px';
        this.grid.style.margin = '20px auto';

        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.style.width = '100px';
            hole.style.height = '100px';
            hole.style.background = '#5D4037'; // Dirt
            hole.style.borderRadius = '50%';
            hole.style.position = 'relative';
            hole.style.overflow = 'hidden';
            hole.style.boxShadow = 'inset 0 10px 10px rgba(0,0,0,0.5)';
            hole.style.border = '4px solid #3E2723';
            hole.dataset.id = i;

            // Mole Image/Div
            const mole = document.createElement('div');
            mole.style.width = '80px';
            mole.style.height = '80px';
            mole.style.background = '#8D6E63'; // Mole Fur
            mole.style.borderRadius = '50% 50% 0 0';
            mole.style.position = 'absolute';
            mole.style.top = '100%'; // hidden
            mole.style.left = '10px';
            mole.style.transition = 'top 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            mole.classList.add('mole');

            // Mole Face
            const nose = document.createElement('div');
            nose.style.width = '15px';
            nose.style.height = '12px';
            nose.style.background = '#e57373';
            nose.style.borderRadius = '50%';
            nose.style.position = 'absolute';
            nose.style.top = '30px';
            nose.style.left = '32px';
            mole.appendChild(nose);

            const eyes = document.createElement('div');
            eyes.style.display = 'flex';
            eyes.style.justifyContent = 'space-between';
            eyes.style.width = '40px';
            eyes.style.position = 'absolute';
            eyes.style.top = '15px';
            eyes.style.left = '20px';

            const eyeL = document.createElement('div');
            eyeL.style.width = '8px';
            eyeL.style.height = '8px';
            eyeL.style.background = '#000';
            eyeL.style.borderRadius = '50%';

            const eyeR = eyeL.cloneNode();

            eyes.appendChild(eyeL);
            eyes.appendChild(eyeR);
            mole.appendChild(eyes);


            // Miss click on empty hole check not easily bound here without changing logic.
            // Bind to grid for explicit miss?

            hole.appendChild(mole);
            hole.addEventListener('mousedown', (e) => {
                e.stopPropagation(); // Stop grid click
                this.whack(hole);
            });

            this.grid.appendChild(hole);
            this.holes.push({ el: hole, mole: mole });
        }

        // Grid miss
        this.grid.addEventListener('mousedown', (e) => {
            if (e.target === this.grid || (e.target.classList.contains('mole') === false && e.target.tagName !== 'BUTTON')) {
                this.container.classList.add('anim-shake');
                setTimeout(() => this.container.classList.remove('anim-shake'), 300);
            }
        });

        wrapper.appendChild(this.grid);
        this.container.appendChild(wrapper);

        document.getElementById('mole-start-btn').addEventListener('click', () => this.start());
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.score = 0;
        this.timeLeft = 30;
        this.updateStats();
        document.getElementById('mole-start-btn').style.display = 'none';

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateStats();
            if (this.timeLeft <= 0) this.endGame();
        }, 1000);

        this.popUp();
    }

    popUp() {
        if (!this.isPlaying) return;

        // Hide previous
        this.holes.forEach(h => h.mole.style.top = '100%');

        const randomHole = this.holes[Utils.randomInt(0, 8)];
        randomHole.mole.style.top = '10%';
        randomHole.mole.classList.remove('mole-pop');
        void randomHole.mole.offsetWidth; // reset anim
        randomHole.mole.classList.add('mole-pop');

        this.activeMole = randomHole;

        const time = Utils.random(500, 1000);
        this.gameInterval = setTimeout(() => {
            if (this.isPlaying) this.popUp();
        }, time);
    }

    whack(hole) {
        if (!this.isPlaying || hole !== this.activeMole) return;

        this.score++;
        this.updateStats();
        hole.mole.style.top = '100%'; // hide

        // Burst
        const burst = document.createElement('div');
        burst.innerText = '💥';
        burst.style.position = 'absolute';
        burst.style.left = '50%';
        burst.style.top = '50%';
        burst.style.transform = 'translate(-50%, -50%)';
        burst.style.fontSize = '40px';
        burst.style.pointerEvents = 'none';
        burst.animate([
            { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 }
        ], { duration: 300 });
        hole.appendChild(burst);
        setTimeout(() => burst.remove(), 300);

        this.activeMole = null;
        Utils.Audio.play(600, 'square', 0.1);

        // instant next
        clearTimeout(this.gameInterval);
        setTimeout(() => this.popUp(), 200);
    }

    updateStats() {
        const timeEl = document.getElementById('mole-time');
        const scoreEl = document.getElementById('mole-score');
        if (timeEl) timeEl.innerText = this.timeLeft;
        if (scoreEl) scoreEl.innerText = this.score;
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        clearTimeout(this.gameInterval);
        this.holes.forEach(h => h.mole.style.top = '100%');
        document.getElementById('mole-start-btn').style.display = 'inline-block';
        document.getElementById('mole-start-btn').innerText = 'Play Again';
        Utils.Audio.play(200, 'sawtooth', 0.5);
    }

    destroy() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        clearTimeout(this.gameInterval);
    }
}
