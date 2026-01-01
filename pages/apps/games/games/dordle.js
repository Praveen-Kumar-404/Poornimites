// Dordle Game (2 Wordle boards)

const WORD_LIST = ['REACT', 'SWIFT', 'PYTHON', 'JAVA', 'RUBY', 'SCALA', 'PEARL', 'BASIC', 'COBOL', 'FORTH'];

class DordleGame extends GameEngine {
    constructor() {
        super('dordle');
        this.words = [];
        this.guesses = [];
        this.currentGuess = '';
        this.maxGuesses = 7;
        this.currentRow = 0;
    }

    init() {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="word-game-container">
                <div class="word-boards dordle">
                    <div id="board-1" class="word-board"></div>
                    <div id="board-2" class="word-board"></div>
                </div>
                <div class="game-keyboard" id="keyboard"></div>
            </div>
        `;

        this.words = [this.randomChoice(WORD_LIST), this.randomChoice(WORD_LIST)];
        this.guesses = [];
        this.currentGuess = '';
        this.currentRow = 0;
        this.reset();

        this.renderBoards();
        this.renderKeyboard();
        this.setupInput();

        document.getElementById('game-instructions').innerHTML = `
            <h3>How to Play</h3>
            <p>Guess both 5-letter words in 7 tries</p>
            <p>Green = correct letter and position</p>
            <p>Yellow = correct letter, wrong position</p>
            <p>Gray = letter not in word</p>
        `;
    }

    renderBoards() {
        for (let boardNum = 1; boardNum <= 2; boardNum++) {
            const board = document.getElementById(`board-${boardNum}`);
            board.innerHTML = '';

            for (let i = 0; i < this.maxGuesses; i++) {
                const row = document.createElement('div');
                row.className = 'word-row';

                for (let j = 0; j < 5; j++) {
                    const tile = document.createElement('div');
                    tile.className = 'word-tile';
                    tile.id = `tile-${boardNum}-${i}-${j}`;
                    row.appendChild(tile);
                }
                board.appendChild(row);
            }
        }
    }

    renderKeyboard() {
        const keyboard = document.getElementById('keyboard');
        const rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
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
            else if (/^[a-zA-Z]$/.test(e.key)) this.handleKey(e.key.toUpperCase());
        });
    }

    handleKey(key) {
        if (this.currentRow >= this.maxGuesses) return;

        if (key === 'ENTER') {
            if (this.currentGuess.length === 5) {
                this.submitGuess();
            }
        } else if (key === '⌫') {
            this.currentGuess = this.currentGuess.slice(0, -1);
            this.updateDisplay();
        } else if (this.currentGuess.length < 5) {
            this.currentGuess += key;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        for (let boardNum = 1; boardNum <= 2; boardNum++) {
            for (let i = 0; i < 5; i++) {
                const tile = document.getElementById(`tile-${boardNum}-${this.currentRow}-${i}`);
                tile.textContent = this.currentGuess[i] || '';
                tile.className = 'word-tile' + (this.currentGuess[i] ? ' filled' : '');
            }
        }
    }

    submitGuess() {
        this.guesses.push(this.currentGuess);

        for (let boardNum = 1; boardNum <= 2; boardNum++) {
            this.colorTiles(boardNum, this.currentRow, this.currentGuess, this.words[boardNum - 1]);
        }

        if (this.words.every(word => this.guesses.includes(word))) {
            setTimeout(() => alert('You Win!'), 100);
        } else if (this.currentRow >= this.maxGuesses - 1) {
            setTimeout(() => alert(`Game Over! Words were: ${this.words.join(', ')}`), 100);
        }

        this.currentGuess = '';
        this.currentRow++;
    }

    colorTiles(boardNum, row, guess, word) {
        for (let i = 0; i < 5; i++) {
            const tile = document.getElementById(`tile-${boardNum}-${row}-${i}`);
            const letter = guess[i];

            if (letter === word[i]) {
                tile.className = 'word-tile correct';
            } else if (word.includes(letter)) {
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

let dordleGame = null;

function initDordle() {
    dordleGame = new DordleGame();
    dordleGame.init();
}
