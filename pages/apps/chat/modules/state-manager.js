// State Manager - Centralized state management for chat application
export class StateManager {
    constructor() {
        this.state = {
            currentUser: null,
            servers: [],
            channels: [],
            members: [],
            messages: {}, // keyed by channelId
            activeServerId: null,
            activeChannelId: null,
            presence: {}, // keyed by userId
            scrollPositions: {}, // track scroll per channel
            isScrolledUp: false
        };

        this.listeners = [];
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Update state and notify listeners
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Get active channel
    getActiveChannel() {
        return this.state.channels.find(c => c.id === this.state.activeChannelId);
    }

    // Get active server
    getActiveServer() {
        return this.state.servers.find(s => s.id === this.state.activeServerId);
    }

    // Get messages for a channel
    getChannelMessages(channelId) {
        return this.state.messages[channelId] || [];
    }

    // Add message to channel
    addMessage(channelId, message) {
        const messages = this.getChannelMessages(channelId);
        this.state.messages[channelId] = [...messages, message];
        this.notifyListeners();
    }

    // Update message
    updateMessage(channelId, messageId, updates) {
        const messages = this.getChannelMessages(channelId);
        const index = messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
            messages[index] = { ...messages[index], ...updates };
            this.state.messages[channelId] = [...messages];
            this.notifyListeners();
        }
    }

    // Delete message
    deleteMessage(channelId, messageId) {
        const messages = this.getChannelMessages(channelId);
        this.state.messages[channelId] = messages.filter(m => m.id !== messageId);
        this.notifyListeners();
    }

    // Set messages for channel (replace all)
    setChannelMessages(channelId, messages) {
        this.state.messages[channelId] = messages;
        this.notifyListeners();
    }

    // Update presence for a user
    updatePresence(userId, status) {
        this.state.presence[userId] = status;
        this.notifyListeners();
    }

    // Get presence for a user
    getPresence(userId) {
        return this.state.presence[userId] || 'offline';
    }

    // Set scroll position for channel
    setScrollPosition(channelId, position) {
        this.state.scrollPositions[channelId] = position;
    }

    // Get scroll position for channel
    getScrollPosition(channelId) {
        return this.state.scrollPositions[channelId] || 0;
    }

    // Set active channel
    setActiveChannel(channelId) {
        this.setState({ activeChannelId: channelId });
    }

    // Set active server
    setActiveServer(serverId) {
        this.setState({ activeServerId: serverId });
    }

    // Set current user
    setCurrentUser(user) {
        this.setState({ currentUser: user });
    }

    // Set servers
    setServers(servers) {
        this.setState({ servers });
    }

    // Set channels
    setChannels(channels) {
        this.setState({ channels });
    }

    // Set members
    setMembers(members) {
        this.setState({ members });
    }

    // Set scroll state
    setScrolledUp(isScrolledUp) {
        this.state.isScrolledUp = isScrolledUp;
        // Don't notify listeners for scroll state to avoid re-renders
    }

    // Get scroll state
    isScrolledUp() {
        return this.state.isScrolledUp;
    }
}

// Create singleton instance
export const stateManager = new StateManager();
