// main.js - Core System and Character Rotation

class DMC404 {
    constructor() {
        this.currentChar = 0;
        this.characters = ['dante', 'vergil', 'nero', 'v'];
        this.characterCards = document.querySelectorAll('.character-card');
        this.quotes = {
            dante: '"This party\'s getting crazy! Let\'s rock!"',
            vergil: '"Power. Give me more power!"',
            nero: '"Jackpot! ...wait, that\'s not my line."',
            v: '"As the air to a bird or the sea to a fish..."'
        };

        this.effects = null;
        this.rank = 'D';
        this.hits = 0;

        this.rankThresholds = [
            { min: 0, max: 10, rank: 'D', color: '#888' },
            { min: 11, max: 25, rank: 'C', color: '#CD7F32' },
            { min: 26, max: 50, rank: 'B', color: '#C0C0C0' },
            { min: 51, max: 80, rank: 'A', color: '#FFD700' },
            { min: 81, max: 120, rank: 'S', color: '#FF4500' },
            { min: 121, max: 200, rank: 'SS', color: '#DC143C' },
            { min: 201, max: Infinity, rank: 'SSS', color: '#FF0080' }
        ];

        this.init();
    }

    init() {
        // Initialize effects
        this.effects = new window.EffectsSystem();
        window.effects = this.effects;

        // Show first character
        this.showCharacter(0);

        // Auto rotate characters
        setInterval(() => {
            this.nextCharacter();
        }, 5000);

        // Setup interactions
        this.setupInteractions();

        // Intro sequence
        this.playIntro();
    }

    playIntro() {
        if (!window.gsap) {
            return;
        }

        const tl = window.gsap.timeline();

        tl.from('.error-display', {
            opacity: 0,
            scale: 0,
            rotation: 360,
            duration: 1,
            ease: 'back.out(2)'
        })
            .from('.mission-failed', {
                opacity: 0,
                x: 200,
                duration: 0.8,
                ease: 'power4.out'
            }, '-=0.5')
            .from('.rank-hud', {
                opacity: 0,
                x: -200,
                duration: 0.8,
                ease: 'power4.out'
            }, '-=0.6')
            .from('.devil-quote', {
                opacity: 0,
                y: 50,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.4')
            .from('.return-btn', {
                opacity: 0,
                scale: 0,
                duration: 0.6,
                ease: 'back.out(2)'
            }, '-=0.3');
    }

    showCharacter(index) {
        // Hide all
        this.characterCards.forEach(card => {
            card.classList.remove('active');
        });

        // Show current
        const currentCard = this.characterCards[index];

        if (window.gsap) {
            window.gsap.to(currentCard, {
                opacity: 1,
                rotationY: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                onStart: () => {
                    currentCard.classList.add('active');
                }
            });
        } else {
            currentCard.classList.add('active');
        }

        // Update quote
        const charName = this.characters[index];
        document.getElementById('quote').textContent = this.quotes[charName];

        // Particle burst
        const rect = currentCard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const colors = {
            dante: 'rgba(220, 20, 60, ',
            vergil: 'rgba(96, 165, 250, ',
            nero: 'rgba(59, 130, 246, ',
            v: 'rgba(124, 58, 237, '
        };

        this.effects.createExplosion(centerX, centerY, colors[charName], 40);
    }

    nextCharacter() {
        this.currentChar = (this.currentChar + 1) % this.characters.length;
        this.showCharacter(this.currentChar);
        this.addHit(3);
    }

    setupInteractions() {
        // Character card clicks
        this.characterCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.currentChar = index;
                this.showCharacter(index);
                this.addHit(10);

                // Extra effects
                const rect = card.getBoundingClientRect();
                this.effects.createExplosion(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    null,
                    50
                );
            });
        });

        // Mouse movement generates particles
        document.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.1) {
                this.effects.createParticle(e.clientX, e.clientY, null, 2);
                this.addHit(1);
            }
        });

        // Return button
        document.getElementById('returnBtn').addEventListener('click', () => {
            this.exitSequence();
        });

        // Hover on return button
        document.getElementById('returnBtn').addEventListener('mouseenter', () => {
            this.addHit(5);
            const btn = document.getElementById('returnBtn');
            const rect = btn.getBoundingClientRect();
            this.effects.createTrail(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                'rgba(220, 20, 60, ',
                20
            );
        });
    }

    addHit(points = 1) {
        this.hits += points;
        document.getElementById('hitCount').textContent = this.hits;

        // Check rank up
        const newRank = this.getRankForHits(this.hits);
        if (newRank.rank !== this.rank) {
            this.rankUp(newRank);
        }
    }

    getRankForHits(hits) {
        return this.rankThresholds.find(t => hits >= t.min && hits <= t.max) || this.rankThresholds[0];
    }

    rankUp(rankData) {
        this.rank = rankData.rank;
        const rankEl = document.getElementById('rankValue');
        rankEl.textContent = rankData.rank;
        rankEl.style.color = rankData.color;
        rankEl.style.textShadow = `0 0 30px ${rankData.color}`;

        if (window.gsap) {
            window.gsap.fromTo(rankEl,
                { scale: 1 },
                {
                    scale: 1.5,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                }
            );
        }

        // Screen flash
        this.effects.glitchEffect();

        // Explosion
        const rect = document.querySelector('.rank-hud').getBoundingClientRect();
        this.effects.createExplosion(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            `rgba(${this.hexToRgb(rankData.color)}, `,
            60
        );
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '255, 255, 255';
    }

    exitSequence() {
        if (!window.gsap) {
            window.location.href = '/';
            return;
        }

        // Massive explosion
        this.effects.createExplosion(
            window.innerWidth / 2,
            window.innerHeight / 2,
            'rgba(220, 20, 60, ',
            200
        );

        // Slash wipe
        const slash = document.createElement('div');
        slash.style.position = 'fixed';
        slash.style.top = '0';
        slash.style.left = '0';
        slash.style.width = '200%';
        slash.style.height = '200%';
        slash.style.background = 'linear-gradient(135deg, transparent 45%, #DC143C 50%, transparent 55%)';
        slash.style.zIndex = '10000';
        document.body.appendChild(slash);

        window.gsap.to(slash, {
            x: window.innerWidth,
            y: window.innerHeight,
            duration: 0.8,
            ease: 'power4.in',
            onComplete: () => {
                window.location.href = '/';
            }
        });
    }
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DMC404());
} else {
    new DMC404();
}
