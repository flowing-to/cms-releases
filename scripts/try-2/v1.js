window.flowing = window.flowing || {};
window.flowing["try-2"] = {
  run(config) {
    // GSAP Scramble Text Effect on Button Hover
    // Supports both LTR and RTL animation directions

    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
      gsap.registerPlugin(TextPlugin);
    }

    // Get button elements
    const button = document.querySelector('.scramble-btn');
    const buttonText = document.querySelector('.btn-text');

    if (button && buttonText) {
      // Set initial text from config
      const originalText = config.buttonText || 'Hover Me';
      buttonText.textContent = originalText;

      // Characters to use for scrambling effect
      const scrambleChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      let scrambleTimeline = null;
      let isAnimating = false;

      // Create scramble effect function
      function createScrambleEffect(text, direction = 'ltr', duration = 0.8) {
        const chars = text.split('');
        const len = chars.length;

        // Create timeline
        const tl = gsap.timeline({
          onStart: () => { isAnimating = true; },
          onComplete: () => { isAnimating = false; }
        });

        // Determine animation order based on direction
        const indices = direction === 'ltr'
          ? chars.map((_, i) => i)
          : chars.map((_, i) => len - 1 - i);

        // Create a temporary element for each character
        buttonText.innerHTML = '';
        const charElements = chars.map((char, i) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          buttonText.appendChild(span);
          return span;
        });

        // Animate each character with stagger based on direction
        indices.forEach((charIndex, orderIndex) => {
          const charElement = charElements[charIndex];
          const delay = (orderIndex * duration) / len;

          // Create scramble animation for this character
          let scrambleCount = 0;
          const maxScrambles = config.scrambleIntensity || 8;

          tl.to(charElement, {
            duration: duration / 2,
            ease: "none",
            onUpdate: function() {
              if (scrambleCount < maxScrambles) {
                if (Math.random() > 0.5) {
                  charElement.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                  scrambleCount++;
                }
              }
            },
            onComplete: function() {
              charElement.textContent = chars[charIndex];
            }
          }, delay);
        });

        return tl;
      }

      // Mouse enter handler
      button.addEventListener('mouseenter', () => {
        if (isAnimating) return;

        // Kill any existing timeline
        if (scrambleTimeline) {
          scrambleTimeline.kill();
        }

        // Create and play scramble effect
        scrambleTimeline = createScrambleEffect(
          originalText,
          config.scrambleDirection || 'ltr',
          config.scrambleDuration || 0.8
        );
      });

      // Mouse leave handler
      button.addEventListener('mouseleave', () => {
        if (isAnimating) return;

        // Kill any existing timeline
        if (scrambleTimeline) {
          scrambleTimeline.kill();
        }

        // Create reverse scramble effect (opposite direction)
        const reverseDirection = config.scrambleDirection === 'ltr' ? 'rtl' : 'ltr';
        scrambleTimeline = createScrambleEffect(
          originalText,
          reverseDirection,
          config.scrambleDuration || 0.8
        );
      });

      // Add some visual feedback
      button.addEventListener('click', () => {
        // Quick pulse animation on click
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      });
    }
  }
};
