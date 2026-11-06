import confetti from 'canvas-confetti';

/**
 * Dispara una explosión festiva de confeti en el centro de la pantalla.
 */
export const triggerBirthdayBlast = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#6366f1', '#ec4899', '#facc15', '#10b981']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#a855f7', '#38bdf8', '#f43f5e']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#ffffff', '#e0e7ff']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
};

/**
 * Dispara una ráfaga desde los extremos de la pantalla (Efecto Anime / Level Up).
 */
export const triggerAnimeVictory = () => {
  const end = Date.now() + 1000;
  const colors = ['#ec4899', '#6366f1', '#facc15', '#06b6d4'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

/**
 * Dispara confeti en una posición específica de un elemento clickeado.
 */
export const triggerElementPop = (event) => {
  if (!event) {
    triggerBirthdayBlast();
    return;
  }
  const rect = event.target?.getBoundingClientRect ? event.target.getBoundingClientRect() : null;
  const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
  const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

  confetti({
    particleCount: 40,
    spread: 70,
    origin: { x, y },
    colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']
  });
};
