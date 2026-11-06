/**
 * Puente de eventos ligero para pausar o reanudar el reproductor de música global
 * cuando otros elementos multimedia (videos de galería o Lightbox) se reproducen.
 */

class AudioBridge {
  constructor() {
    this.listeners = new Set();
    this.isPausedByMedia = false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  pauseMusic() {
    this.isPausedByMedia = true;
    this.listeners.forEach((listener) => {
      try {
        listener(true);
      } catch (err) {
        console.error("Error en audioBridge listener:", err);
      }
    });
  }

  resumeMusic() {
    if (this.isPausedByMedia) {
      this.isPausedByMedia = false;
      this.listeners.forEach((listener) => {
        try {
          listener(false);
        } catch (err) {
          console.error("Error en audioBridge listener:", err);
        }
      });
    }
  }
}

export const audioBridge = new AudioBridge();
