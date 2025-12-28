/**
 * Game Hub Controller
 * Handles looking up game modules and managing the modal state.
 */

const GameHub = {
    currentModule: null,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('.game-card').forEach(card => {
            // Entry animation
            card.style.animation = `fadeInScale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

            card.addEventListener('click', (e) => {
                // Press feedback
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.style.transform = '', 150);

                const gameId = card.dataset.game;
                setTimeout(() => this.openGame(gameId), 100);
            });
        });

        document.getElementById('close-game').addEventListener('click', () => this.closeGame());

        const soundBtn = document.getElementById('sound-toggle');
        soundBtn.addEventListener('click', (e) => {
            // Pulse anim
            soundBtn.classList.remove('anim-pop');
            void soundBtn.offsetWidth;
            soundBtn.classList.add('anim-pop');
            this.toggleSound(soundBtn);
        });
    },

    async openGame(gameId) {
        const modal = document.getElementById('game-modal');
        const container = document.getElementById('game-canvas-area');
        const title = document.getElementById('game-title-display');

        // Load Module
        try {
            // Mapping game IDs to module files
            const moduleName = gameId; // e.g. "flappy" -> assets/js/games/flappy.js
            const module = await import(`./games/${moduleName}.js`);

            if (!module.default) throw new Error("Game module must export default");

            this.currentModule = new module.default(container);

            title.textContent = this.currentModule.name || "Game";
            modal.classList.add('active');

            // Allow module to setup
            if (this.currentModule.init) {
                this.currentModule.init();
            }

        } catch (err) {
            console.error("Failed to load game:", err);
            alert("Could not load game. Check console for details.");
        }
    },

    closeGame() {
        const modal = document.getElementById('game-modal');

        if (this.currentModule && this.currentModule.destroy) {
            this.currentModule.destroy();
        }

        this.currentModule = null;
        modal.classList.remove('active');

        // Clean container
        document.getElementById('game-canvas-area').innerHTML = '';
    },

    toggleSound(btn) {
        import('./games/utils.js').then(({ Utils }) => {
            Utils.Audio.enabled = !Utils.Audio.enabled;
            btn.textContent = Utils.Audio.enabled ? '🔊' : '🔇';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    GameHub.init();
});
