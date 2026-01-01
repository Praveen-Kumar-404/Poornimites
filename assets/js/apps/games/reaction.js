export default class ReactionTest {
    constructor(container) {
        this.container = container;
        this.name = "Reaction Test";
        this.el = null;
        this.state = 'waiting'; // waiting, ready, clicked
        this.startTime = 0;
        this.timeout = null;
    }

    init() {
        this.el = document.createElement('div');
        this.el.style.width = '100%';
        this.el.style.height = '100%';
        this.el.style.display = 'flex';
        this.el.style.alignItems = 'center';
        this.el.style.justifyContent = 'center';
        this.el.style.fontSize = '30px';
        this.el.style.fontWeight = 'bold';
        this.el.style.color = '#fff';
        this.el.style.cursor = 'pointer';
        this.el.style.userSelect = 'none';

        this.container.appendChild(this.el);
        this.el.addEventListener('mousedown', () => this.handleClick());

        this.setState('start');
    }

    setState(state) {
        this.state = state;
        // Reset classes
        this.el.className = '';
        this.el.style.transition = 'background 0.3s ease';

        if (state === 'start') {
            this.el.style.background = '#3498db';
            this.el.innerHTML = '<div style="font-size: 40px; margin-bottom: 20px">⚡</div><div>Click to Start</div>';
            this.el.classList.add('anim-pulse');
        } else if (state === 'waiting') {
            this.el.style.background = '#c0392b';
            this.el.innerHTML = '<div style="font-size: 80px">...</div><div>Wait for Green</div>';
            const time = Math.random() * 2000 + 1500;
            this.timeout = setTimeout(() => this.setState('ready'), time);
        } else if (state === 'ready') {
            this.el.style.background = '#27ae60';
            this.el.innerHTML = '<div style="font-size: 60px">CLICK!</div>';
            this.el.classList.add('anim-pop');
            this.startTime = Date.now();
        } else if (state === 'too-early') {
            this.el.style.background = '#e67e22';
            this.el.innerHTML = '<div>⚠️ Too Early!</div><div style="font-size: 16px; margin-top: 10px">Click to Try Again</div>';
            this.el.classList.add('anim-shake');
            clearTimeout(this.timeout);
        } else if (state === 'result') {
            this.el.style.background = '#2980b9';
            // Text set by click handler
        }
    }

    handleClick() {
        if (this.state === 'start' || this.state === 'result' || this.state === 'too-early') {
            this.setState('waiting');
        } else if (this.state === 'waiting') {
            this.setState('too-early');
        } else if (this.state === 'ready') {
            const time = Date.now() - this.startTime;
            this.state = 'result';
            this.el.innerHTML = `<div class="card-slide-in">${time} ms</div><div style="font-size:16px">Click to retry</div>`;
        }
    }

    destroy() {
        clearTimeout(this.timeout);
        this.el = null;
    }
}
