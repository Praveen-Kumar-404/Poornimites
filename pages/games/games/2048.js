// 2048 Game

class Game2048 extends GameEngine {
    constructor() {
        super('2048');
        this.grid = [];
        this.size = 4;
        this.gameLoop = null;
    }

    init() {
        const container = document.getElementById('game-container');
        container.innerHTML = '<div class="grid-2048" id="grid-2048"></div>';

        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.addNewTile();
        this.addNewTile();
        this.reset();

        // Keyboard controls
        new KeyboardHandler({
            up: () => this.move('up'),
            down: () => this.move('down'),
            left: () => this.move('left'),
            right: () => this.move('right')
        });

        // Swipe controls
        new SwipeDetector(container, {
            up: () => this.move('up'),
            down: () => this.move('down'),
            left: () => this.move('left'),
            right: () => this.move('right')
        });

        this.render();
    }

    addNewTile() {
        const empty = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) empty.push({ r, c });
            }
        }
        if (empty.length > 0) {
            const { r, c } = this.randomChoice(empty);
            this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        const oldGrid = JSON.stringify(this.grid);

        if (direction === 'left') this.moveLeft();
        else if (direction === 'right') this.moveRight();
        else if (direction === 'up') this.moveUp();
        else if (direction === 'down') this.moveDown();

        if (JSON.stringify(this.grid) !== oldGrid) {
            this.addNewTile();
            this.render();

            if (this.checkWin()) {
                alert('You Win! You reached 2048!');
            } else if (this.checkGameOver()) {
                alert(`Game Over! Score: ${this.score}`);
            }
        }
    }

    moveLeft() {
        for (let r = 0; r < this.size; r++) {
            let row = this.grid[r].filter(val => val !== 0);
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    this.updateScore(row[i]);
                    row.splice(i + 1, 1);
                }
            }
            this.grid[r] = [...row, ...Array(this.size - row.length).fill(0)];
        }
    }

    moveRight() {
        for (let r = 0; r < this.size; r++) {
            let row = this.grid[r].filter(val => val !== 0);
            for (let i = row.length - 1; i > 0; i--) {
                if (row[i] === row[i - 1]) {
                    row[i] *= 2;
                    this.updateScore(row[i]);
                    row.splice(i - 1, 1);
                    i--;
                }
            }
            this.grid[r] = [...Array(this.size - row.length).fill(0), ...row];
        }
    }

    moveUp() {
        for (let c = 0; c < this.size; c++) {
            let col = [];
            for (let r = 0; r < this.size; r++) {
                if (this.grid[r][c] !== 0) col.push(this.grid[r][c]);
            }
            for (let i = 0; i < col.length - 1; i++) {
                if (col[i] === col[i + 1]) {
                    col[i] *= 2;
                    this.updateScore(col[i]);
                    col.splice(i + 1, 1);
                }
            }
            for (let r = 0; r < this.size; r++) {
                this.grid[r][c] = col[r] || 0;
            }
        }
    }

    moveDown() {
        for (let c = 0; c < this.size; c++) {
            let col = [];
            for (let r = 0; r < this.size; r++) {
                if (this.grid[r][c] !== 0) col.push(this.grid[r][c]);
            }
            for (let i = col.length - 1; i > 0; i--) {
                if (col[i] === col[i - 1]) {
                    col[i] *= 2;
                    this.updateScore(col[i]);
                    col.splice(i - 1, 1);
                    i--;
                }
            }
            for (let r = 0; r < this.size; r++) {
                this.grid[r][c] = col[r - (this.size - col.length)] || 0;
            }
        }
    }

    checkWin() {
        return this.grid.some(row => row.includes(2048));
    }

    checkGameOver() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) return false;
                if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) return false;
                if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) return false;
            }
        }
        return true;
    }

    render() {
        const gridEl = document.getElementById('grid-2048');
        gridEl.innerHTML = '';

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const tile = document.createElement('div');
                tile.className = 'tile-2048';
                tile.textContent = this.grid[r][c] || '';
                if (this.grid[r][c]) {
                    tile.setAttribute('data-value', this.grid[r][c]);
                }
                gridEl.appendChild(tile);
            }
        }
    }

    restart() {
        this.init();
    }

    cleanup() { }
}

let game2048 = null;

function init2048() {
    game2048 = new Game2048();
    game2048.init();

    document.getElementById('game-instructions').innerHTML = `
        <h3>How to Play</h3>
        <p><strong>Desktop:</strong> Use arrow keys to move tiles</p>
        <p><strong>Mobile:</strong> Swipe in any direction</p>
        <p>Merge tiles with the same number to reach 2048!</p>
    `;
}
