// characters.js - Character Animation and Interaction System

class CharacterManager {
    constructor(effectsManager) {
        this.effectsManager = effectsManager;
        this.characters = {
            dante: {
                element: document.getElementById('dante'),
                color: 'rgb(220, 20, 60)',
                actionAnimating: false
            },
            vergil: {
                element: document.getElementById('vergil'),
                color: 'rgb(96, 165, 250)',
                actionAnimating: false
            },
            nero: {
                element: document.getElementById('nero'),
                color: 'rgb(59, 130, 246)',
                actionAnimating: false
            },
            v: {
                element: document.getElementById('vCharacter'),
                color: 'rgb(124, 58, 237)',
                actionAnimating: false
            }
        };

        this.init();
    }

    init() {
        Object.keys(this.characters).forEach(charName => {
            const char = this.characters[charName];

            // Hover interactions
            char.element.addEventListener('mouseenter', () => {
                this.onCharacterHover(charName);
            });

            // Click interactions
            char.element.addEventListener('click', () => {
                this.onCharacterClick(charName);
            });
        });
    }

    onCharacterHover(charName) {
        const char = this.characters[charName];

        // Trigger rank points
        if (window.rankSystem) {
            window.rankSystem.addPoints(25);
        }

        // Play hover animation
        this.playHoverAnimation(charName);
    }

    onCharacterClick(charName) {
        const char = this.characters[charName];

        // Trigger rank points
        if (window.rankSystem) {
            window.rankSystem.addPoints(50);
        }

        // Play action animation
        this.playActionAnimation(charName);
    }

    playHoverAnimation(charName) {
        const char = this.characters[charName];

        if (!window.gsap) return;

        // Enhanced glow effect
        window.gsap.to(char.element, {
            filter: `drop-shadow(0 0 40px ${char.color})`,
            duration: 0.3
        });

        window.gsap.to(char.element, {
            filter: `drop-shadow(0 0 20px ${char.color})`,
            duration: 0.3,
            delay: 0.3
        });
    }

    playActionAnimation(charName) {
        const char = this.characters[charName];

        if (char.actionAnimating) return;
        char.actionAnimating = true;

        const rect = char.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        switch (charName) {
            case 'dante':
                this.danteAction(char, centerX, centerY);
                break;
            case 'vergil':
                this.vergilAction(char, centerX, centerY);
                break;
            case 'nero':
                this.neroAction(char, centerX, centerY);
                break;
            case 'v':
                this.vAction(char, centerX, centerY);
                break;
        }
    }

    danteAction(char, x, y) {
        if (!window.gsap) return;

        const tl = window.gsap.timeline({
            onComplete: () => { char.actionAnimating = false; }
        });

        // Quick slash motion
        tl.to(char.element, {
            rotation: 15,
            x: '+=30',
            duration: 0.1,
            ease: 'power4.out'
        })
            .to(char.element, {
                rotation: -15,
                x: '-=60',
                duration: 0.15,
                ease: 'power4.in'
            })
            .to(char.element, {
                rotation: 0,
                x: '+=30',
                duration: 0.15,
                ease: 'elastic.out(1, 0.5)'
            });

        // Muzzle flash effect
        setTimeout(() => {
            this.effectsManager.createEnergyTrail(x - 50, y - 30, char.color, 15);
            this.effectsManager.createEnergyTrail(x + 50, y - 30, char.color, 15);
        }, 100);

        // Slash trail
        setTimeout(() => {
            this.effectsManager.createEnergyTrail(x, y, char.color, 25);
        }, 150);
    }

    vergilAction(char, x, y) {
        if (!window.gsap) return;

        const tl = window.gsap.timeline({
            onComplete: () => { char.actionAnimating = false; }
        });

        // Teleport effect (disappear)
        tl.to(char.element, {
            opacity: 0,
            scale: 0.8,
            duration: 0.1,
            ease: 'power4.in'
        })
            // Reappear with slash
            .to(char.element, {
                x: '+=100',
                opacity: 1,
                scale: 1.2,
                duration: 0.1,
                ease: 'power4.out'
            })
            // Return to position
            .to(char.element, {
                x: '-=100',
                scale: 1,
                duration: 0.3,
                ease: 'power2.inOut'
            });

        // Afterimage trail
        setTimeout(() => {
            this.effectsManager.createEnergyTrail(x, y, char.color, 20);
            this.effectsManager.createEnergyTrail(x + 100, y, char.color, 20);
        }, 200);
    }

    neroAction(char, x, y) {
        if (!window.gsap) return;

        const tl = window.gsap.timeline({
            onComplete: () => { char.actionAnimating = false; }
        });

        // Punch forward
        tl.to(char.element, {
            x: '+=50',
            scale: 1.15,
            duration: 0.15,
            ease: 'power4.out'
        })
            // Recoil
            .to(char.element, {
                x: '-=50',
                scale: 1,
                duration: 0.2,
                ease: 'elastic.out(1, 0.3)'
            });

        // Explosive sparks
        setTimeout(() => {
            this.effectsManager.createSparkBurst(x + 80, y, char.color, 30);
            this.effectsManager.screenShake(15, 300);
        }, 150);
    }

    vAction(char, x, y) {
        if (!window.gsap) return;

        const tl = window.gsap.timeline({
            onComplete: () => { char.actionAnimating = false; }
        });

        // Eerie sway
        tl.to(char.element, {
            rotation: 5,
            y: '-=20',
            duration: 0.3,
            ease: 'power1.inOut'
        })
            .to(char.element, {
                rotation: -5,
                y: '+=40',
                duration: 0.4,
                ease: 'power1.inOut'
            })
            .to(char.element, {
                rotation: 0,
                y: '-=20',
                duration: 0.3,
                ease: 'power1.inOut'
            });

        // Shadow pulses
        setTimeout(() => {
            this.effectsManager.createEnergyTrail(x - 50, y + 50, char.color, 15);
            this.effectsManager.createEnergyTrail(x + 50, y - 50, char.color, 15);
        }, 300);

        setTimeout(() => {
            this.effectsManager.createEnergyTrail(x, y, char.color, 20);
        }, 600);
    }

    // Intro animation for all characters
    playIntroAnimation() {
        if (!window.gsap) return;

        const tl = window.gsap.timeline();

        tl.from('#dante', {
            opacity: 0,
            y: 100,
            duration: 0.5,
            ease: 'power2.out'
        }, '+=0.5')
            .from('#vergil', {
                opacity: 0,
                y: 100,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.2')
            .from('#nero', {
                opacity: 0,
                y: 100,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.2')
            .from('#vCharacter', {
                opacity: 0,
                y: 100,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.2');
    }
}

window.CharacterManager = CharacterManager;
