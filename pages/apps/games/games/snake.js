// Snake Game

class SnakeGame extends GameEngine {
    constructor() {
        super('snake');
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 20;
        this.tileCount = 20;
        this.snake = [];
        this.food = {};
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.gameLoop = null;
    }

    init() {
        const container = document.getElementById('game-container');
        container.innerHTML = '';

        this.canvas = this.createCanvas(400, 400);
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);

        // Initialize snake
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];

        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.spawnFood();
        this.reset();

        // Controls
        new KeyboardHandler({
            up: () => {
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
            },
            down: () => {
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
            },
            left: () => {
                if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
            },
            right: () => {
                if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
            }
        });

        new SwipeDetector(this.canvas, {
            up: () => {
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
            },
            down: () => {
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
            },
            left: () => {
                if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
            },
            right: () => {
                if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
            }
        });

        this.start();
    }

    start() {
        this.isRunning = true;
        this.gameLoop = new GameLoop(() => this.update(), 10);
        this.gameLoop.start();
    }

    update() {
        if (this.isPaused || !this.isRunning) return;

        this.direction = { ...this.nextDirection };

        // Move snake
        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.updateScore(10);
            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#f5faff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#003366' : '#0066cc';
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw food
        this.ctx.fillStyle = '#d32f2f';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );
    }

    spawnFood() {
        do {
            this.food = {
                x: this.randomInt(0, this.tileCount - 1),
                y: this.randomInt(0, this.tileCount - 1)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    gameOver() {
        this.isRunning = false;
        this.gameLoop.stop();
        alert(`Game Over! Score: ${this.score}`);
    }

    restart() {
        this.gameLoop.stop();
        this.init();
    }

    cleanup() {
        if (this.gameLoop) {
            this.gameLoop.stop();
        }
    }
}

// Global instance
let snakeGame = null;

function initSnake() {
    snakeGame = new SnakeGame();
    snakeGame.init();

    document.getElementById('game-instructions').innerHTML = `
        <h3>How to Play</h3>
        <p><strong>Desktop:</strong> Use arrow keys to control the snake</p>
        <p><strong>Mobile:</strong> Swipe in the direction you want to move</p>
        <p>Eat the red food to grow and score points. Don't hit the walls or yourself!</p>
    `;
}
