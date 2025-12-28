import { Utils } from './utils.js';

export default class UNO {
    constructor(container) {
        this.container = container;
        this.name = "UNO";
        this.players = []; // 0: Human, 1-3: Bots
        this.deck = [];
        this.discardPile = [];
        this.currentPlayer = 0; // 0 is Human
        this.direction = 1; // 1 or -1
        this.isActive = false;

        this.colors = ['red', 'yellow', 'green', 'blue'];
        this.special = ['skip', 'reverse', 'draw2'];
        // Wilds handled separately
    }

    init() {
        this.createUI();
        this.start();
    }

    createUI() {
        this.container.innerHTML = '';
        this.container.style.background = '#2c3e50';
        this.container.style.color = 'white';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'space-between';
        this.container.style.padding = '10px';

        // Top: Bots
        const botArea = document.createElement('div');
        botArea.className = 'uno-bots';
        botArea.style.display = 'flex';
        botArea.style.gap = '20px';
        botArea.style.marginBottom = '20px';
        botArea.innerHTML = `
            <div id="bot1" class="bot-card">Bot 1: 7</div>
            <div id="bot2" class="bot-card">Bot 2: 7</div>
            <div id="bot3" class="bot-card">Bot 3: 7</div>
        `;
        this.container.appendChild(botArea);

        // Center: Play Area
        const centerArea = document.createElement('div');
        centerArea.style.display = 'flex';
        centerArea.style.gap = '40px';
        centerArea.style.alignItems = 'center';
        centerArea.style.flex = '1';

        // Deck
        const deckDiv = document.createElement('div');
        deckDiv.className = 'uno-card-back';
        deckDiv.style.width = '80px';
        deckDiv.style.height = '120px';
        deckDiv.style.background = '#000';
        deckDiv.style.border = '2px solid white';
        deckDiv.style.borderRadius = '5px';
        deckDiv.style.display = 'flex';
        deckDiv.style.alignItems = 'center';
        deckDiv.style.justifyContent = 'center';
        deckDiv.textContent = 'UNO';
        deckDiv.style.cursor = 'pointer';
        deckDiv.onclick = () => this.drawCard(0);
        centerArea.appendChild(deckDiv);

        // Discard
        this.discardEl = document.createElement('div');
        this.discardEl.style.width = '80px';
        this.discardEl.style.height = '120px';
        this.discardEl.style.background = '#fff';
        this.discardEl.style.borderRadius = '5px';
        this.discardEl.style.color = '#000';
        this.discardEl.style.display = 'flex';
        this.discardEl.style.alignItems = 'center';
        this.discardEl.style.justifyContent = 'center';
        this.discardEl.style.fontSize = '24px';
        this.discardEl.style.fontWeight = 'bold';
        centerArea.appendChild(this.discardEl);

        // Turn Indicator
        this.infoEl = document.createElement('div');
        this.infoEl.textContent = "Your Turn";
        this.infoEl.style.fontSize = '20px';
        centerArea.appendChild(this.infoEl);

        this.container.appendChild(centerArea);

        // Bottom: Human Hand
        this.handEl = document.createElement('div');
        this.handEl.style.display = 'flex';
        this.handEl.style.gap = '10px';
        this.handEl.style.flexWrap = 'wrap';
        this.handEl.style.justifyContent = 'center';
        this.handEl.style.padding = '10px';
        this.handEl.style.background = 'rgba(0,0,0,0.2)';
        this.handEl.style.width = '100%';
        this.handEl.style.minHeight = '140px';
        this.container.appendChild(this.handEl);

        // Color Picker Modal (Quick implementation)
        this.colorPicker = document.createElement('div');
        this.colorPicker.style.position = 'absolute';
        this.colorPicker.style.top = '50%';
        this.colorPicker.style.left = '50%';
        this.colorPicker.style.transform = 'translate(-50%, -50%)';
        this.colorPicker.style.background = 'white';
        this.colorPicker.style.padding = '20px';
        this.colorPicker.style.display = 'none';
        this.colorPicker.style.gap = '10px';
        this.colors.forEach(c => {
            const btn = document.createElement('div');
            btn.style.width = '50px';
            btn.style.height = '50px';
            btn.style.background = c;
            btn.onclick = () => this.pickColor(c);
            this.colorPicker.appendChild(btn);
        });
        this.container.appendChild(this.colorPicker);
    }

    start() {
        this.createDeck();
        this.shuffleDeck();
        this.players = [[], [], [], []]; // 4 players

        // Deal 7 cards
        for (let i = 0; i < 7; i++) {
            this.players.forEach(p => p.push(this.deck.pop()));
        }

        // Start card
        let startCard = this.deck.pop();
        while (startCard.type === 'wild' || startCard.type === 'wild4') {
            this.deck.unshift(startCard);
            this.shuffleDeck();
            startCard = this.deck.pop();
        }
        this.discardPile.push(startCard);

        this.isActive = true;
        this.currentPlayer = 0;
        this.updateUI();
    }

    createDeck() {
        this.deck = [];
        this.colors.forEach(c => {
            this.deck.push({ color: c, type: 'number', val: 0 }); // 0
            for (let i = 1; i <= 9; i++) {
                this.deck.push({ color: c, type: 'number', val: i });
                this.deck.push({ color: c, type: 'number', val: i });
            }
            this.special.forEach(s => {
                this.deck.push({ color: c, type: 'special', val: s });
                this.deck.push({ color: c, type: 'special', val: s });
            });
        });

        for (let i = 0; i < 4; i++) {
            this.deck.push({ color: 'black', type: 'wild' });
            this.deck.push({ color: 'black', type: 'wild4' });
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    updateUI() {
        // Discard
        const top = this.discardPile[this.discardPile.length - 1];
        this.discardEl.style.background = top.color;

        if (this.shouldAnimateDiscard) {
            this.discardEl.classList.remove('anim-pop');
            void this.discardEl.offsetWidth;
            this.discardEl.classList.add('anim-pop');
            this.shouldAnimateDiscard = false;
        }

        if (this.shouldSwirl) {
            this.discardEl.style.animation = 'swirlColor 1s';
            setTimeout(() => this.discardEl.style.animation = '', 1000);
            this.shouldSwirl = false;
        }

        this.discardEl.innerText = top.val !== undefined ? top.val : (top.type === 'wild' ? 'W' : 'W4');

        // Bots
        for (let i = 1; i <= 3; i++) {
            document.getElementById(`bot${i}`).innerText = `Bot ${i}: ${this.players[i].length} cards`;
            document.getElementById(`bot${i}`).style.color = this.currentPlayer === i ? '#f1c40f' : 'white';
        }

        // Human Turn
        if (this.currentPlayer === 0) {
            this.handEl.innerHTML = '';
            this.players[0].forEach((card, idx) => {
                const cardEl = document.createElement('div');
                cardEl.style.width = '60px';
                cardEl.style.height = '90px';
                cardEl.style.background = card.color;
                cardEl.style.border = '1px solid white';
                cardEl.style.borderRadius = '4px';
                cardEl.style.display = 'flex';
                cardEl.style.alignItems = 'center';
                cardEl.style.justifyContent = 'center';
                cardEl.style.cursor = 'pointer';
                cardEl.style.color = ['yellow', 'white'].includes(card.color) ? 'black' : 'white';
                cardEl.style.fontWeight = 'bold';

                let label = card.val;
                if (card.type === 'wild') label = 'W';
                if (card.type === 'wild4') label = '+4';
                if (card.val === 'skip') label = '⊘';
                if (card.val === 'reverse') label = '⇄';
                if (card.val === 'draw2') label = '+2';

                cardEl.innerText = label;

                cardEl.onclick = () => this.humanPlay(idx);
                this.handEl.appendChild(cardEl);
            });
            this.infoEl.innerText = " Your Turn";
        } else {
            this.infoEl.innerText = `Bot ${this.currentPlayer}'s Turn...`;
            setTimeout(() => this.botPlay(), 1000); // delay for realism
        }
    }

    isValid(card) {
        const top = this.discardPile[this.discardPile.length - 1];
        if (card.color === 'black') return true;
        if (card.color === top.color) return true;
        if (card.val !== undefined && card.val === top.val) return true;
        return false;
    }

    humanPlay(idx) {
        if (this.currentPlayer !== 0) return;

        const card = this.players[0][idx];
        if (this.isValid(card)) {
            // Check wild
            if (card.color === 'black') {
                this.pendingCardIdx = idx;
                this.colorPicker.style.display = 'flex';
                return;
            }

            this.playCard(0, idx);
        } else {
            // Shake visual? invalid
        }
    }

    pickColor(c) {
        const card = this.players[0][this.pendingCardIdx];
        card.color = c; // temporary mutate for play
        this.colorPicker.style.display = 'none';

        // Swirl effect on discard
        this.shouldSwirl = true;
        this.playCard(0, this.pendingCardIdx);
    }

    playCard(playerIdx, cardIdx) {
        const card = this.players[playerIdx][cardIdx]; // Access before splice to modify if needed, but splice removes it text

        // Remove from hand is instant, but add to discard can animate
        this.players[playerIdx].splice(cardIdx, 1);
        this.discardPile.push(card);

        // Anim: Re-render UI will show new discard.
        // To animate flip, we might need to query the element before remove?
        // Simpler: Just rely on UI update standard.
        // Add "animate-flip" class to discardEl in updateUI temporarily?
        this.shouldAnimateDiscard = true;


        // Handle effects
        let nextOffset = 1;

        if (card.val === 'skip') nextOffset = 2;
        if (card.val === 'reverse') this.direction *= -1;
        if (card.val === 'draw2') {
            const victim = this.getNextPlayer(1);
            this.drawFor(victim, 2);
            nextOffset = 2; // Skip victim
        }
        if (card.type === 'wild4') {
            const victim = this.getNextPlayer(1);
            this.drawFor(victim, 4);
            nextOffset = 2;
        }

        // Reset wildcard to black for future logic if reshuffled (not handling full deck recycle perfection here)

        // Check Win
        if (this.players[playerIdx].length === 0) {
            alert(playerIdx === 0 ? "YOU WON!" : `Bot ${playerIdx} WON!`);
            this.isActive = false;
            return;
        }

        this.currentPlayer = this.getNextPlayer(nextOffset);
        this.updateUI();
    }

    drawCard(playerIdx) {
        if (this.deck.length === 0) {
            // Reshuffle discard
            const top = this.discardPile.pop();
            this.deck = this.discardPile;
            this.discardPile = [top];
            this.shuffleDeck();
            // Reset colors of wilds in deck? simplified: keep as is
        }

        const card = this.deck.pop();
        this.players[playerIdx].push(card);

        if (playerIdx === 0) { // human turn
            this.updateUI();
            // Pass turn if drawn? Usually optional play. For simplicity: auto pass if can't play, or just allow play of drawn.
            // Simple rule: Draw 1 pass.
            // Check if playable immediately?
            if (!this.isValid(card)) {
                this.currentPlayer = this.getNextPlayer(1);
                setTimeout(() => this.updateUI(), 500);
            } else {
                // Update UI to show new card, user must click it to play
                this.updateUI();
                // Actually standard rules allow playing drawn card.
            }
        }
    }

    drawFor(playerIdx, count) {
        for (let i = 0; i < count; i++) {
            if (this.deck.length > 0) this.players[playerIdx].push(this.deck.pop());
        }
    }

    getNextPlayer(offset = 1) {
        let next = this.currentPlayer + (this.direction * offset);
        // Wrap
        while (next < 0) next += 4;
        while (next >= 4) next -= 4;
        return next;
    }

    botPlay() {
        if (!this.isActive) return;
        const hand = this.players[this.currentPlayer];
        const validCards = hand.filter(c => this.isValid(c));

        if (validCards.length > 0) {
            // Play random valid
            const card = validCards[Math.floor(Math.random() * validCards.length)];
            const idx = hand.indexOf(card);

            if (card.color === 'black') {
                // Pick random color
                card.color = this.colors[Math.floor(Math.random() * 4)];
            }

            this.playCard(this.currentPlayer, idx);
        } else {
            // Draw
            this.drawCard(this.currentPlayer);
            // If valid now, play? Simplified: Bot passes after draw
            this.currentPlayer = this.getNextPlayer(1);
            this.updateUI();
        }
    }

    destroy() {
        this.isActive = false;
        this.container.innerHTML = '';
    }
}
