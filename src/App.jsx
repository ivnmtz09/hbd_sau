import React, { useState, useEffect } from 'react';
import { Camera, Heart, Sparkles, PartyPopper, PlayCircle } from 'lucide-react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';

import MusicPlayer from './components/MusicPlayer';
import MemoryWall from './components/MemoryWall';
import PhotoGallery from './components/PhotoGallery';
import BackgroundTheme from './components/BackgroundTheme';

function App() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [user, setUser] = useState(null);
  const [hasStarted, setHasStarted] = useState(false); // Nuevo estado para la Home Screen

  useEffect(() => {
    signInAnonymously(auth).catch((error) => console.error("Auth error", error));
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Función para iniciar la experiencia
  const startCelebration = () => {
    setHasStarted(true);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative bg-[#020617]">
      <BackgroundTheme />

      {/* --- PANTALLA DE BIENVENIDA (HOME SCREEN) --- */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in px-4 text-center overflow-hidden">
          {/* Spotlight Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse-slow"></div>

          <div className="relative z-10 max-w-2xl space-y-12 backdrop-blur-3xl bg-white/5 p-12 rounded-[3rem] border border-white/10 shadow-2xl shadow-indigo-500/10">
            <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 mb-6 animate-float">
              <PartyPopper size={48} className="text-indigo-300 drop-shadow-[0_0_15px_rgba(165,180,252,0.5)]" />
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-indigo-200 drop-shadow-sm">
                HBD Saudí
              </h1>
              <p className="text-xl md:text-2xl text-indigo-200/80 font-light tracking-wide">
                Una experiencia digital creada con mucho cariño por tus amigos.
              </p>
            </div>

            <button
              onClick={startCelebration}
              className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-xl hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-shimmer bg-[length:200%_100%]"></div>
              <PlayCircle size={28} className="group-hover:text-indigo-600 transition-colors duration-300" />
              <span className="relative z-10">Comenzar Celebración</span>
            </button>
          </div>
        </div>
      )}

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className={`transition-all duration-1000 ease-in-out ${hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>

        {/* Header Moderno */}
        <header className="relative pt-32 pb-20 text-center px-6">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-sm font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md shadow-lg shadow-black/20 hover:bg-white/10 transition-colors duration-300">
            <PartyPopper size={16} className="text-indigo-400" />
            <span>06 de Diciembre</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl">
            ¡Feliz Cumpleaños!
          </h1>

          <p className="text-indigo-200/60 max-w-2xl mx-auto text-xl leading-relaxed flex items-center justify-center gap-3 font-light">
            <Sparkles size={20} className="text-amber-300 animate-pulse" />
            <span>Que este nuevo año esté lleno de magia y momentos inolvidables.</span>
            <Sparkles size={20} className="text-amber-300 animate-pulse" />
          </p>
        </header>

        {/* Navegación Floating Dock */}
        <nav className="sticky top-8 z-40 flex justify-center mb-16 px-4">
          <div className="flex p-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/50 ring-1 ring-white/5">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`relative flex items-center gap-3 px-8 py-3 rounded-full text-sm font-bold transition-all duration-500 ${activeTab === 'gallery'
                ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Camera size={18} className={activeTab === 'gallery' ? 'text-indigo-400' : ''} />
              <span>Galería</span>
              {activeTab === 'gallery' && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full shadow-[0_0_10px_currentColor]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('wishes')}
              className={`relative flex items-center gap-3 px-8 py-3 rounded-full text-sm font-bold transition-all duration-500 ${activeTab === 'wishes'
                ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Heart size={18} className={activeTab === 'wishes' ? 'text-pink-400' : ''} />
              <span>Deseos</span>
              {activeTab === 'wishes' && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full shadow-[0_0_10px_currentColor]"></span>
              )}
            </button>
          </div>
        </nav>

        {/* Contenido Dinámico */}
        <main className="px-4 md:px-8 max-w-7xl mx-auto min-h-[600px] pb-32">
          {activeTab === 'gallery' ? <PhotoGallery /> : <MemoryWall />}
        </main>
      </div>

      {/* Reproductor Global */}
      <MusicPlayer startPlaying={hasStarted} />

    </div>
  );
}

export default App;