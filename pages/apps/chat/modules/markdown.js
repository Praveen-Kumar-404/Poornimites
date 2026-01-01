export const Markdown = {
    parse(text) {
        if (!text) return '';

        // Escape HTML first to prevent XSS
        let html = this.escapeHtml(text);

        // Code Blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

        // Inline Code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bold
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

        // Strikethrough
        html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

        // Blockquote
        html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

        // Links (Simple detection)
        html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

        // Newlines to <br>
        html = html.replace(/\n/g, '<br>');

        return html;
    },

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    }
};
