// effects.js - Particle System and Visual Effects

class EffectsSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.glitchOverlay = document.getElementById('glitchOverlay');

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create initial particles
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
    }

    createParticle(x, y, color, count = 1) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x || Math.random() * this.canvas.width,
                y: y || Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 4 + 2,
                color: color || this.randomColor(),
                life: 100,
                maxLife: 100,
                glow: Math.random() * 20 + 10
            });
        }
    }

    randomColor() {
        const colors = [
            'rgba(220, 20, 60, ',
            'rgba(96, 165, 250, ',
            'rgba(59, 130, 246, ',
            'rgba(124, 58, 237, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createExplosion(x, y, color, count = 30) {
        const baseColor = color || this.randomColor();
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 8 + 4;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 6 + 3,
                color: baseColor,
                life: 60,
                maxLife: 60,
                glow: 30,
                gravity: 0.3
            });
        }
    }

    createTrail(x, y, color, count = 15) {
        const baseColor = color || this.randomColor();
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: Math.random() * 5 + 2,
                color: baseColor,
                life: 40,
                maxLife: 40,
                glow: 20
            });
        }
    }

    glitchEffect() {
        const intensity = Math.random() * 5;
        this.glitchOverlay.style.background = `
            linear-gradient(${Math.random() * 360}deg, 
                rgba(255, 0, 0, ${Math.random() * 0.1}), 
                rgba(0, 255, 255, ${Math.random() * 0.1}), 
                transparent)
        `;

        setTimeout(() => {
            this.glitchOverlay.style.background = 'transparent';
        }, 50);
    }

    update() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.gravity) {
                p.vy += p.gravity;
            }

            p.life--;

            // Fade based on life
            p.opacity = p.life / p.maxLife;

            return p.life > 0;
        });

        // Random glitch
        if (Math.random() < 0.02) {
            this.glitchEffect();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size + p.glow
            );

            gradient.addColorStop(0, p.color + (p.opacity || 1) + ')');
            gradient.addColorStop(0.5, p.color + (p.opacity * 0.5 || 0.5) + ')');
            gradient.addColorStop(1, p.color + '0)');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                p.x - p.size - p.glow,
                p.y - p.size - p.glow,
                (p.size + p.glow) * 2,
                (p.size + p.glow) * 2
            );
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

window.EffectsSystem = EffectsSystem;
