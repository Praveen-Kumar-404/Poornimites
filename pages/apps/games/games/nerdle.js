// Nerdle Game (Math equation Wordle)

const EQUATIONS = [
    '12+34=46',
    '56-12=44',
    '8*7=56',
    '48/6=8',
    '9+15=24',
    '72-18=54',
    '6*9=54',
    '81/9=9'
];

class NerdleGame extends GameEngine {
    constructor() {
        super('nerdle');
        this.equation = '';
        this.guesses = [];
        this.currentGuess = '';
        this.maxGuesses = 6;
        this.currentRow = 0;
    }

    init() {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="word-game-container">
                <div class="word-boards">
                    <div id="nerdle-board" class="word-board"></div>
                </div>
                <div class="game-keyboard" id="nerdle-keyboard"></div>
            </div>
        `;

        this.equation = this.randomChoice(EQUATIONS);
        this.guesses = [];
        this.currentGuess = '';
        this.currentRow = 0;
        this.reset();

        this.renderBoard();
        this.renderKeyboard();
        this.setupInput();

        document.getElementById('game-instructions').innerHTML = `
            <h3>How to Play</h3>
            <p>Guess the math equation in 6 tries</p>
            <p>Use numbers (0-9) and operators (+, -, *, /, =)</p>
            <p>Green = correct, Yellow = wrong position, Gray = not in equation</p>
        `;
    }

    renderBoard() {
        const board = document.getElementById('nerdle-board');
        board.innerHTML = '';

        for (let i = 0; i < this.maxGuesses; i++) {
            const row = document.createElement('div');
            row.className = 'word-row';

            for (let j = 0; j < 8; j++) {
                const tile = document.createElement('div');
                tile.className = 'word-tile';
                tile.id = `ntile-${i}-${j}`;
                row.appendChild(tile);
            }
            board.appendChild(row);
        }
    }

    renderKeyboard() {
        const keyboard = document.getElementById('nerdle-keyboard');
        const rows = [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['+', '-', '*', '/', '='],
            ['ENTER', '⌫']
        ];

        rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';

            row.forEach(key => {
                const btn = document.createElement('button');
                btn.className = 'key-btn' + (key.length > 1 ? ' wide' : '');
                btn.textContent = key;
                btn.onclick = () => this.handleKey(key);
                rowDiv.appendChild(btn);
            });

            keyboard.appendChild(rowDiv);
        });
    }

    setupInput() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleKey('ENTER');
            else if (e.key === 'Backspace') this.handleKey('⌫');
            else if (/^[0-9+\-*/=]$/.test(e.key)) this.handleKey(e.key);
        });
    }

    handleKey(key) {
        if (this.currentRow >= this.maxGuesses) return;

        if (key === 'ENTER') {
            if (this.currentGuess.length === 8) {
                this.submitGuess();
            }
        } else if (key === '⌫') {
            this.currentGuess = this.currentGuess.slice(0, -1);
            this.updateDisplay();
        } else if (this.currentGuess.length < 8) {
            this.currentGuess += key;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        for (let i = 0; i < 8; i++) {
            const tile = document.getElementById(`ntile-${this.currentRow}-${i}`);
            tile.textContent = this.currentGuess[i] || '';
            tile.className = 'word-tile' + (this.currentGuess[i] ? ' filled' : '');
        }
    }

    submitGuess() {
        this.guesses.push(this.currentGuess);
        this.colorTiles(this.currentRow, this.currentGuess, this.equation);

        if (this.currentGuess === this.equation) {
            setTimeout(() => alert('You Win!'), 100);
        } else if (this.currentRow >= this.maxGuesses - 1) {
            setTimeout(() => alert(`Game Over! Equation was: ${this.equation}`), 100);
        }

        this.currentGuess = '';
        this.currentRow++;
    }

    colorTiles(row, guess, equation) {
        for (let i = 0; i < 8; i++) {
            const tile = document.getElementById(`ntile-${row}-${i}`);
            const char = guess[i];

            if (char === equation[i]) {
                tile.className = 'word-tile correct';
            } else if (equation.includes(char)) {
                tile.className = 'word-tile present';
            } else {
                tile.className = 'word-tile absent';
            }
        }
    }

    restart() {
        this.init();
    }

    cleanup() { }
}

let nerdleGame = null;

function initNerdle() {
    nerdleGame = new NerdleGame();
    nerdleGame.init();
}
