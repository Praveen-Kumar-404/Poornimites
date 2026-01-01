export default class TypingChallenge {
    constructor(container) {
        this.container = container;
        this.name = "Typing Challenge";
        this.text = "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Simplicity is the soul of efficiency.";
        this.words = this.text.split(' ');
        this.currentWordIndex = 0;
        this.startTime = 0;
        this.isActive = false;
        this.inputEl = null;
        this.displayEl = null;
        this.resultsEl = null;
    }

    init() {
        this.createUI();
    }

    createUI() {
        this.container.style.color = '#fff';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.padding = '20px';
        this.container.style.textAlign = 'center';

        // Display Text
        this.displayEl = document.createElement('div');
        this.displayEl.style.fontSize = '26px';
        this.displayEl.style.fontFamily = '"Roboto Mono", monospace';
        this.displayEl.style.lineHeight = '1.6';
        this.displayEl.style.marginBottom = '30px';
        this.displayEl.style.maxWidth = '600px';
        this.displayEl.style.color = '#bdc3c7';
        this.updateDisplay();
        this.container.appendChild(this.displayEl);

        // Input
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        this.inputEl.style.fontSize = '24px';
        this.inputEl.style.fontFamily = '"Roboto Mono", monospace';
        this.inputEl.style.padding = '15px';
        this.inputEl.style.width = '300px';
        this.inputEl.style.borderRadius = '8px';
        this.inputEl.style.border = '2px solid #34495e';
        this.inputEl.style.background = '#34495e';
        this.inputEl.style.color = '#fff';
        this.inputEl.style.outline = 'none';
        this.inputEl.style.textAlign = 'center';
        this.inputEl.style.transition = 'all 0.2s';
        this.inputEl.style.caretColor = '#3498db';

        this.inputEl.placeholder = 'Start typing...';
        this.inputEl.addEventListener('focus', () => this.inputEl.style.borderColor = '#3498db');
        this.inputEl.addEventListener('blur', () => this.inputEl.style.borderColor = '#34495e');

        this.inputEl.addEventListener('input', (e) => this.checkInput(e));
        this.container.appendChild(this.inputEl);

        // Results
        this.resultsEl = document.createElement('div');
        this.resultsEl.style.marginTop = '20px';
        this.resultsEl.style.fontSize = '20px';
        this.resultsEl.style.fontWeight = 'bold';
        this.container.appendChild(this.resultsEl);

        setTimeout(() => this.inputEl.focus(), 100);
    }

    updateDisplay() {
        this.displayEl.innerHTML = this.words.map((word, i) => {
            if (i < this.currentWordIndex) return `<span style="color: #2ecc71">${word}</span>`;
            if (i === this.currentWordIndex) return `<span style="background: #34495e; padding: 0 5px;">${word}</span>`;
            return word;
        }).join(' ');
    }

    checkInput(e) {
        if (!this.isActive && this.currentWordIndex === 0) {
            this.isActive = true;
            this.startTime = Date.now();
        }

        const val = this.inputEl.value.trim();
        const currentTarget = this.words[this.currentWordIndex];

        if (e.data === ' ' || (val === currentTarget && e.inputType === 'insertText')) { // Space or exact match check logic tweak
            // Simple check: if value matches word + space or just word if user hits space
            // Actually better: check on space keyup or if value ends in space
        }

        if (this.inputEl.value.endsWith(' ')) {
            if (val === currentTarget) {
                this.currentWordIndex++;
                this.inputEl.value = '';
                this.updateDisplay();
                // Success feedback
                this.inputEl.classList.add('glow-success');
                setTimeout(() => this.inputEl.classList.remove('glow-success'), 200);

                if (this.currentWordIndex >= this.words.length) {
                    this.endGame();
                }
            } else {
                this.inputEl.classList.add('glow-error');
                setTimeout(() => this.inputEl.classList.remove('glow-error'), 300);
            }
        } else {
            this.inputEl.style.borderColor = ''; // reset border from simple check
            // check prefix
            if (currentTarget.startsWith(val)) {
                this.inputEl.style.color = '#fff';
            } else {
                this.inputEl.style.color = '#e74c3c';
            }

            if (val === currentTarget && this.currentWordIndex === this.words.length - 1) {
                this.currentWordIndex++;
                this.endGame();
            }
        }
    }

    endGame() {
        this.isActive = false;
        const timeMin = (Date.now() - this.startTime) / 1000 / 60;
        const wpm = Math.round(this.words.length / timeMin);

        this.inputEl.disabled = true;
        this.resultsEl.innerText = `DONE! WPM: ${wpm}`;
        this.resultsEl.style.color = '#f1c40f';

        const btn = document.createElement('button');
        btn.innerText = 'Retry';
        btn.style.marginTop = '10px';
        btn.style.padding = '5px 10px';
        btn.addEventListener('click', () => {
            this.container.innerHTML = '';
            this.currentWordIndex = 0;
            this.isActive = false;
            this.init();
        });
        this.resultsEl.appendChild(btn);
    }

    destroy() {
        this.container.innerHTML = '';
    }
}
