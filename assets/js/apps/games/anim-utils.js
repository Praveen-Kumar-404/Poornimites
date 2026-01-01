/**
 * Animation Utilities
 */
export const Anim = {
    // Number Count Up
    countUp(element, endValue, duration = 1000) {
        if (!element) return;
        let startValue = parseInt(element.innerText.replace(/,/g, '')) || 0;
        let startTime = null;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // EaseOutQuad
            const ease = 1 - (1 - progress) * (1 - progress);

            const current = Math.floor(ease * (endValue - startValue) + startValue);
            element.innerText = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.innerText = endValue.toLocaleString(); // Ensure final
            }
        };
        requestAnimationFrame(step);
    },

    // Horizontal Shake
    shake(element) {
        if (!element) return;
        element.classList.remove('anim-shake');
        void element.offsetWidth; // Trigger reflow
        element.classList.add('anim-shake');
    },

    // Pop / Pulse
    pop(element) {
        if (!element) return;
        element.classList.remove('anim-pop');
        void element.offsetWidth;
        element.classList.add('anim-pop');
    },

    // Ripple Effect
    ripple(event, element) {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;
        const rect = element.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple-effect');

        const existing = element.getElementsByClassName('ripple-effect')[0];
        if (existing) existing.remove();

        element.appendChild(circle);
    },

    // Canvas Particle System Helper
    createParticles(ctx, list, x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            list.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    },

    updateParticles(ctx, list) {
        for (let i = list.length - 1; i >= 0; i--) {
            let p = list[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            p.size *= 0.95; // shrink

            if (p.life <= 0) {
                list.splice(i, 1);
            } else {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }
    }
};
