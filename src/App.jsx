import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Camera, 
  MessageSquare, 
  Gamepad2, 
  Crown, 
  PartyPopper, 
  PlayCircle, 
  SkipForward, 
  Sparkles
} from 'lucide-react';
import PhotoGallery from './components/PhotoGallery';
import MemoryWall from './components/MemoryWall';
import BackgroundTheme from './components/BackgroundTheme';
import MusicPlayer from './components/MusicPlayer';
import TriviaPlayer from './components/TriviaPlayer';
import TriviaStudio from './components/TriviaStudio';
import SaudiAvatarClay from './components/SaudiAvatarClay';
import { signInAnonymously } from "firebase/auth";
import { auth, isConfigured } from "./firebase";
import { triggerBirthdayBlast, triggerAnimeVictory } from './utils/confetti';

const FRIENDS = ["Ivan", "Julio", "Hasmith", "Maurith", "Carlos", "Elisa"];

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['gallery', 'wishes', 'trivia', 'studio'].includes(hash)) {
      return hash;
    }
    return 'gallery';
  });

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const videoRef = useRef(null);

  // Detección de scroll para ajustar el header estático
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sincronizar ruta en la URL (Hash routing limpio)
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['gallery', 'wishes', 'trivia', 'studio'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Firebase auth anónimo
  useEffect(() => {
    if (isConfigured && auth) {
      signInAnonymously(auth).catch((error) => {
        console.warn("Nota: Autenticación anónima Firebase omitida:", error);
      });
    }
  }, []);

  // Nombres flotantes memoizados para evitar re-renders y saltos bruscos
  const floatingFriends = useMemo(() => {
    return FRIENDS.map((name, index) => {
      const top = ((index * 29 + 17) % 75) + 10;
      const left = ((index * 37 + 13) % 75) + 10;
      const rotate = ((index * 47) % 40) - 20;
      const duration = 12 + (index % 5) * 3;

      return {
        name,
        style: {
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          transform: `rotate(${rotate}deg)`
        }
      };
    });
  }, []);

  const startVideo = () => {
    setVideoPlaying(true);
    triggerBirthdayBlast();

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.warn("Error reproduciendo video intro:", err);
        });
      }
    }, 150);
  };

  const handleVideoEnd = () => {
    setShowPopup(true);
    triggerBirthdayBlast();
  };

  const handleBeginCelebration = () => {
    setHasStarted(true);
    triggerAnimeVictory();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden relative">
      <BackgroundTheme />

      {/* PANTALLA DE BIENVENIDA / VIDEO MEME INTRO */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          {/* Fondo animado con nombres de los amigos (Memoizado) */}
          {!videoPlaying && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {floatingFriends.map((f, i) => (
                <div
                  key={i}
                  className="absolute text-slate-800/25 font-black text-4xl md:text-7xl whitespace-nowrap animate-float select-none"
                  style={f.style}
                >
                  {f.name}
                </div>
              ))}
            </div>
          )}

          {/* Tarjeta de Inicio Claymorphic 3D */}
          {!videoPlaying && (
            <div className="relative max-w-lg w-full bg-slate-900/90 border border-white/20 rounded-3xl p-8 md:p-12 text-center shadow-clay-card animate-scale-in">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-clay-pink transform -rotate-3 hover:rotate-0 transition-transform">
                <PartyPopper size={40} className="text-white" />
              </div>

              <div className="inline-block px-3.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-clay-yellow mb-4">
                Edición Especial 2026
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                HBD <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400">Saudí</span>
              </h1>

              <p className="text-base text-slate-300 mb-8 leading-relaxed">
                Una experiencia digital interactiva creada con mucho cariño por tus amigos:
                <br />
                <span className="text-indigo-300 font-bold text-xs mt-3 block tracking-wide font-mono">
                  {FRIENDS.join(" • ")}
                </span>
              </p>

              <button
                onClick={startVideo}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-clay-pink active:scale-95 transition-all w-full sm:w-auto"
              >
                <PlayCircle size={24} className="group-hover:rotate-12 transition-transform" />
                <span>Iniciar Celebración</span>
              </button>
            </div>
          )}

          {/* Video The Rock HBD */}
          {videoPlaying && !showPopup && (
            <div className="relative z-10 w-full flex flex-col items-center justify-center animate-fade-in px-2">
              <video
                ref={videoRef}
                src="/fotos/the-rock-hbd.mp4"
                playsInline
                className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-3xl shadow-clay-card border-2 border-indigo-400/60 bg-black mb-6"
                onEnded={handleVideoEnd}
              />

              <button
                onClick={handleVideoEnd}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900/90 hover:bg-slate-800 border border-white/20 rounded-2xl text-white text-sm font-black shadow-clay-btn active:scale-95 transition-all"
              >
                <SkipForward size={16} />
                <span>Saltar a la Roca</span>
              </button>
            </div>
          )}

          {/* Modal Pop-up al terminar video */}
          {showPopup && (
            <div className="relative max-w-md w-full bg-slate-900/90 border border-white/20 rounded-3xl p-8 text-center shadow-clay-card animate-scale-in z-20">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-clay-yellow">
                <Sparkles size={32} className="text-slate-950" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                ¡Que empiece la fiesta! 🎂
              </h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Hemos recopilado recuerdos, fotos, videos y hasta una trivia especial sobre ti.
              </p>
              <button
                onClick={handleBeginCelebration}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-base rounded-2xl shadow-clay-pink active:scale-95 transition-all"
              >
                Comenzar Celebración ✨
              </button>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className={`transition-opacity duration-700 ${hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

        {/* Header Claymorphism Flotante Fijo y Estático al Scroll */}
        <header className="fixed top-2 sm:top-4 left-0 right-0 z-40 max-w-5xl mx-auto px-3 sm:px-6 pointer-events-none">
          <div className={`pointer-events-auto bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-full px-3.5 sm:px-6 h-16 sm:h-18 flex items-center justify-between shadow-clay-header transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 border-white/25 shadow-clay-card scale-[0.99]' : ''}`}>
            {/* Avatar Claymorphic de Saudí y Saludo de Cumpleaños Emotivo */}
            <div 
              onClick={() => setActiveTab('gallery')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
            >
              <SaudiAvatarClay size={46} className="sm:w-[48px] sm:h-[48px]" />
              <div className="flex flex-col justify-center">
                <span className="font-['Pacifico',cursive] text-lg sm:text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 drop-shadow-sm group-hover:scale-[1.02] transition-transform origin-left leading-tight py-0.5">
                  ¡Feliz Cumple Saudí!
                </span>
              </div>
            </div>

            {/* Navegación por Pestañas Claymorphic */}
            <nav className="flex items-center gap-1.5 bg-slate-950/70 border border-white/10 p-1.5 rounded-full shadow-inner overflow-x-auto max-w-[65%] sm:max-w-none">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition-all shrink-0 ${
                  activeTab === 'gallery'
                    ? 'text-white bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-clay-indigo scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Camera size={15} />
                <span>Galería</span>
              </button>

              <button
                onClick={() => setActiveTab('wishes')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition-all shrink-0 ${
                  activeTab === 'wishes'
                    ? 'text-white bg-gradient-to-r from-pink-500 to-rose-600 shadow-clay-pink scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare size={15} />
                <span>Deseos</span>
              </button>

              <button
                onClick={() => setActiveTab('trivia')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition-all shrink-0 ${
                  activeTab === 'trivia'
                    ? 'text-slate-950 bg-gradient-to-r from-yellow-400 to-amber-500 shadow-clay-yellow scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Gamepad2 size={15} />
                <span>Trivia</span>
              </button>

              <button
                onClick={() => setActiveTab('studio')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition-all shrink-0 ${
                  activeTab === 'studio'
                    ? 'text-white bg-gradient-to-r from-purple-500 to-indigo-600 shadow-clay-card scale-105'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
                }`}
                title="Módulo exclusivo para que Saudí cree o edite su trivia y galería"
              >
                <Crown size={15} className="text-yellow-400" />
                <span className="hidden sm:inline">Studio</span>
              </button>

              {/* Botón Tirar Confeti */}
              <button
                onClick={() => triggerBirthdayBlast()}
                className="w-9 h-9 flex items-center justify-center bg-pink-500/20 hover:bg-pink-500 text-pink-400 hover:text-white rounded-full shadow-clay-btn active:scale-95 transition-all shrink-0"
                title="¡Lanzar confeti festivo!"
              >
                <PartyPopper size={16} />
              </button>
            </nav>
          </div>
        </header>

        {/* Contenido Dinámico de la Pestaña Activa */}
        <main className="pt-28 px-4 min-h-screen pb-36">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'gallery' && <PhotoGallery />}
            {activeTab === 'wishes' && <MemoryWall />}
            {activeTab === 'trivia' && (
              <TriviaPlayer 
                onGoToWishes={() => setActiveTab('wishes')}
                onSwitchToStudio={() => setActiveTab('studio')}
              />
            )}
            {activeTab === 'studio' && (
              <TriviaStudio 
                onSwitchToPlayer={() => setActiveTab('trivia')}
              />
            )}
          </div>
        </main>
      </div>

      {/* Reproductor de Música Vinilo Global */}
      <MusicPlayer startPlaying={hasStarted} />
    </div>
  );
}

export default App;
