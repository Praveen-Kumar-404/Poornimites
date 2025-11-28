// Presence Simulator - Simulates realistic presence changes
import { stateManager } from './state-manager.js';

class PresenceSimulator {
    constructor() {
        this.presenceStates = ['online', 'idle', 'dnd', 'offline'];
        this.intervals = new Map();
    }

    // Start simulating presence for members
    start(members) {
        // Initialize all members as online
        members.forEach(member => {
            stateManager.updatePresence(member.id, 'online');
        });

        // Set up random presence changes
        members.forEach(member => {
            this.scheduleNextChange(member.id);
        });
    }

    // Schedule next presence change for a user
    scheduleNextChange(userId) {
        // Random delay between 10-30 seconds
        const delay = 10000 + Math.random() * 20000;

        const timeout = setTimeout(() => {
            this.changePresence(userId);
            this.scheduleNextChange(userId);
        }, delay);

        this.intervals.set(userId, timeout);
    }

    // Change presence for a user
    changePresence(userId) {
        const currentPresence = stateManager.getPresence(userId);
        const currentIndex = this.presenceStates.indexOf(currentPresence);

        // 70% chance to stay in current state
        if (Math.random() < 0.7) {
            return;
        }

        // 30% chance to change to a different state
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.presenceStates.length);
        } while (newIndex === currentIndex);

        const newPresence = this.presenceStates[newIndex];
        stateManager.updatePresence(userId, newPresence);

        console.log(`Presence changed: User ${userId} is now ${newPresence}`);
    }

    // Stop all presence simulations
    stop() {
        this.intervals.forEach(timeout => clearTimeout(timeout));
        this.intervals.clear();
    }

    // Update presence for a specific user
    setPresence(userId, status) {
        if (this.presenceStates.includes(status)) {
            stateManager.updatePresence(userId, status);
        }
    }
}

// Create singleton instance
export const presenceSimulator = new PresenceSimulator();
