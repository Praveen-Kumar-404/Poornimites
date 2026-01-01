export class VirtualList {
    constructor(container, renderItem, itemHeight = 50) {
        this.container = container;
        this.renderItem = renderItem;
        this.itemHeight = itemHeight;
        this.items = [];

        this.scroller = document.createElement('div');
        this.scroller.style.position = 'relative';
        this.container.appendChild(this.scroller);

        this.container.addEventListener('scroll', () => this.render());

        // Resize observer to handle dynamic sizing if needed
        this.resizeObserver = new ResizeObserver(() => this.render());
        this.resizeObserver.observe(this.container);
    }

    setItems(items) {
        this.items = items;
        this.scroller.style.height = `${items.length * this.itemHeight}px`;
        this.render();

        // Auto-scroll to bottom if near bottom
        // Simplified for now: always scroll to bottom on new messages
        this.container.scrollTop = this.container.scrollHeight;
    }

    render() {
        const scrollTop = this.container.scrollTop;
        const containerHeight = this.container.clientHeight;

        const startIndex = Math.floor(scrollTop / this.itemHeight);
        const endIndex = Math.min(
            this.items.length - 1,
            Math.floor((scrollTop + containerHeight) / this.itemHeight)
        );

        // Clear current view
        this.scroller.innerHTML = '';

        // Render visible items
        // Add buffer
        const buffer = 5;
        const start = Math.max(0, startIndex - buffer);
        const end = Math.min(this.items.length - 1, endIndex + buffer);

        for (let i = start; i <= end; i++) {
            const item = this.items[i];
            const node = this.renderItem(item);
            node.style.position = 'absolute';
            node.style.top = `${i * this.itemHeight}px`;
            node.style.width = '100%';
            this.scroller.appendChild(node);
        }
    }
}
