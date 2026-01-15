// camera.js - Parallax Camera System

class CameraController {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.lerpFactor = 0.1;

        this.bgLayer = document.getElementById('bgLayer');
        this.charactersLayer = document.getElementById('charactersLayer');

        this.autoRotate = true;
        this.autoRotateAngle = 0;

        this.init();
    }

    init() {
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            this.autoRotate = false;
        });

        // Touch support
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
                this.mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
                this.autoRotate = false;
            }
        });

        // Re-enable auto-rotate after inactivity
        let inactivityTimer;
        document.addEventListener('mousemove', () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                this.autoRotate = true;
            }, 5000);
        });

        this.animate();
    }

    update() {
        if (this.autoRotate) {
            this.autoRotateAngle += 0.001;
            this.mouseX = Math.sin(this.autoRotateAngle) * 0.3;
            this.mouseY = Math.cos(this.autoRotateAngle * 0.7) * 0.2;
        }

        // Smooth interpolation (lerp)
        this.currentX += (this.mouseX - this.currentX) * this.lerpFactor;
        this.currentY += (this.mouseY - this.currentY) * this.lerpFactor;

        // Apply parallax to layers
        if (this.bgLayer) {
            const bgOffset = 15;
            this.bgLayer.style.transform = `translate(${this.currentX * bgOffset}px, ${this.currentY * bgOffset}px)`;
        }

        if (this.charactersLayer) {
            const charOffset = 30;
            this.charactersLayer.style.transform = `translate(${this.currentX * charOffset}px, ${this.currentY * charOffset}px)`;
        }
    }

    // Cinematic zoom on random character
    cinematicZoom() {
        const characters = ['dante', 'vergil', 'nero', 'vCharacter'];
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        const characterEl = document.getElementById(randomChar);

        if (characterEl && window.gsap) {
            window.gsap.to(characterEl, {
                scale: 1.3,
                duration: 2,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: 1
            });
        }
    }

    // Start random cinematic zooms
    startCinematicMode() {
        setInterval(() => {
            if (Math.random() > 0.5) {
                this.cinematicZoom();
            }
        }, 15000);
    }

    animate() {
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

window.CameraController = CameraController;
