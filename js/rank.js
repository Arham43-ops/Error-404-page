// rank.js - Stylish Rank System

class RankSystem {
    constructor() {
        this.score = 0;
        this.currentRank = 'DISMAL';

        this.rankValueEl = document.getElementById('rankValue');
        this.rankScoreEl = document.getElementById('rankScore');

        this.ranks = [
            { min: 0, max: 50, name: 'DISMAL', color: '#888' },
            { min: 51, max: 150, name: 'CRAZY', color: '#FFD700' },
            { min: 151, max: 300, name: 'BADASS', color: '#FF8C00' },
            { min: 301, max: 500, name: 'APOCALYPTIC', color: '#DC143C' },
            { min: 501, max: Infinity, name: 'STYLISH!', color: 'linear-gradient(90deg, #FF0080, #7928CA, #FF0080)' }
        ];

        this.init();
    }

    init() {
        // Track mouse movement
        let mouseMovePoints = 0;
        document.addEventListener('mousemove', () => {
            if (mouseMovePoints < 50) {
                mouseMovePoints += 0.5;
                this.addPoints(0.5);
            }
        });

        // Reset mouse move points periodically
        setInterval(() => {
            mouseMovePoints = 0;
        }, 5000);
    }

    addPoints(points) {
        this.score += points;
        this.updateDisplay();
        this.checkRankUp();
    }

    updateDisplay() {
        if (this.rankScoreEl) {
            // Animate number
            const targetScore = Math.floor(this.score);
            const currentScore = parseInt(this.rankScoreEl.textContent) || 0;

            if (targetScore !== currentScore) {
                this.animateNumber(currentScore, targetScore);
            }
        }
    }

    animateNumber(from, to) {
        const duration = 300;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.floor(from + (to - from) * progress);
            this.rankScoreEl.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    checkRankUp() {
        const newRank = this.getRankForScore(this.score);

        if (newRank.name !== this.currentRank) {
            this.currentRank = newRank.name;
            this.onRankUp(newRank);
        }
    }

    getRankForScore(score) {
        return this.ranks.find(rank => score >= rank.min && score <= rank.max) || this.ranks[0];
    }

    onRankUp(rank) {
        // Update text
        if (this.rankValueEl) {
            this.rankValueEl.textContent = rank.name;

            // Update color
            if (rank.name === 'STYLISH!') {
                this.rankValueEl.style.background = rank.color;
                this.rankValueEl.style.backgroundClip = 'text';
                this.rankValueEl.style.webkitBackgroundClip = 'text';
                this.rankValueEl.style.webkitTextFillColor = 'transparent';
                this.rankValueEl.style.backgroundSize = '200% auto';

                // Animated gradient
                if (window.gsap) {
                    window.gsap.to(this.rankValueEl, {
                        backgroundPosition: '200% center',
                        duration: 2,
                        repeat: -1,
                        ease: 'none'
                    });
                }
            } else {
                this.rankValueEl.style.color = rank.color;
                this.rankValueEl.style.background = 'none';
                this.rankValueEl.style.webkitTextFillColor = 'unset';
            }

            // Pulse animation
            if (window.gsap) {
                window.gsap.fromTo(this.rankValueEl,
                    { scale: 1 },
                    {
                        scale: 1.3,
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    }
                );
            }
        }

        // Particle burst effect
        if (window.effectsManager) {
            const container = document.getElementById('rankContainer');
            const rect = container.getBoundingClientRect();
            window.effectsManager.createSparkBurst(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                rank.color,
                30
            );
        }

        // Screen flash
        this.screenFlash();
    }

    screenFlash() {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'rgba(255, 255, 255, 0.5)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '9998';
        document.body.appendChild(flash);

        if (window.gsap) {
            window.gsap.to(flash, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    document.body.removeChild(flash);
                }
            });
        } else {
            setTimeout(() => {
                if (flash.parentNode) {
                    document.body.removeChild(flash);
                }
            }, 300);
        }
    }

    // Intro animation
    playIntroAnimation() {
        if (window.gsap) {
            window.gsap.from('#rankContainer', {
                opacity: 0,
                x: 100,
                duration: 0.8,
                ease: 'power2.out',
                delay: 4.5
            });
        }
    }
}

window.RankSystem = RankSystem;
