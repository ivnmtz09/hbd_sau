import React, { useState, useRef, useEffect } from 'react';
import { Camera, Music, PartyPopper, PlayCircle, PauseCircle, SkipForward, Volume2, VolumeX } from 'lucide-react';
import PhotoGallery from './components/PhotoGallery';
import MemoryWall from './components/MemoryWall';
import BackgroundTheme from './components/BackgroundTheme';
import MusicPlayer from './components/MusicPlayer';
import { getAuth, signInAnonymously } from "firebase/auth";

function App() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef(null);

  // Nombres de los amigos para la animación de fondo
  const friends = ["Ivan", "Julio", "Hasmith", "Maurith", "Carlos", "Elisa"];

  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log("Signed in anonymously");
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
      });
  }, []);

  // Función para iniciar el video
  const startVideo = () => {
    console.log("Iniciando video...");
    setVideoPlaying(true);
    // Usar setTimeout para asegurar que el video esté en el DOM
    setTimeout(() => {
      if (videoRef.current) {
        console.log("Video encontrado, intentando reproducir...");
        videoRef.current.play()
          .then(() => {
            console.log("Video reproduciéndose correctamente");
          })
          .catch(error => {
            console.error("Error al reproducir el video:", error);
          });
      } else {
        console.error("No se encontró la referencia al video");
      }
    }, 100);
  };

  const handleVideoEnd = () => {
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      <BackgroundTheme />

      {/* PANTALLA DE BIENVENIDA / VIDEO */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">

          {/* Fondo animado con nombres (Solo visible en los popups, no durante el video) */}
          {!videoPlaying && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {friends.map((name, index) => (
                <div
                  key={index}
                  className="absolute text-slate-800/20 font-bold text-4xl md:text-6xl whitespace-nowrap animate-float"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${10 + Math.random() * 20}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}

          {!videoPlaying && (
            <div className="relative max-w-lg w-full bg-slate-900/90 border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-indigo-500/20 animate-scale-in backdrop-blur-xl">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <PartyPopper size={40} className="text-indigo-400" />
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                HBD <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Saudí</span>
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Una experiencia digital creada con mucho cariño por tus amigos:
                <br />
                <span className="text-indigo-400 font-medium text-sm mt-2 block">
                  {friends.join(" • ")}
                </span>
              </p>

              <button
                onClick={startVideo}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] w-full sm:w-auto"
              >
                <PlayCircle size={24} className="group-hover:rotate-12 transition-transform" />
                <span>Iniciar Celebración</span>
              </button>
            </div>
          )}

          {videoPlaying && !showPopup && (
            <div className="relative z-10 w-full flex flex-col items-center justify-center animate-fade-in px-2 md:px-0">
              <video
                ref={videoRef}
                src="/fotos/the-rock-hbd.mp4"
                playsInline
                className="
                  w-auto 
                  h-auto
                  max-w-full 
                  max-h-[75vh]
                  object-contain
                  rounded-xl md:rounded-3xl
                  shadow-2xl
                  border-2 md:border-4 border-white/10
                  bg-black
                  mb-6
                "
                onEnded={handleVideoEnd}
              />

              <button
                onClick={handleVideoEnd}
                className="
                  flex items-center gap-2 
                  px-6 py-3 
                  bg-white/10 hover:bg-white/20 
                  backdrop-blur-md 
                  border border-white/10 
                  rounded-full 
                  text-white text-sm font-medium 
                  transition-all duration-300 
                  hover:scale-105
                "
              >
                <SkipForward size={16} />
                Saltar a la Roca
              </button>
            </div>
          )}

          {showPopup && (
            <div className="relative max-w-md w-full bg-slate-900/90 border border-white/10 rounded-3xl p-8 text-center shadow-2xl animate-scale-in backdrop-blur-xl z-20">
              <h2 className="text-3xl font-bold text-white mb-4">¡Que comience la fiesta! 🎂</h2>
              <p className="text-slate-300 mb-8">
                Hemos recopilado nuestros mejores momentos contigo.
                <br />
                ¡Esperamos que te guste!
              </p>
              <button
                onClick={() => setHasStarted(true)}
                className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1"
              >
                Comenzar Celebración
              </button>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className={`transition-all duration-1000 ${hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none absolute inset-0'}`}>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">S</span>
              </div>
              <span className="font-bold text-lg tracking-tight">HBD Saudí</span>
            </div>

            <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'gallery'
                  ? 'text-white bg-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Camera size={16} className={activeTab === 'gallery' ? 'text-indigo-400' : ''} />
                <span>Galería</span>
              </button>

              <button
                onClick={() => setActiveTab('wishes')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'wishes'
                  ? 'text-white bg-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <PartyPopper size={16} className={activeTab === 'wishes' ? 'text-purple-400' : ''} />
                <span>Deseos</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 px-4 min-h-screen pb-32">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'gallery' ? (
              <PhotoGallery />
            ) : (
              <MemoryWall />
            )}
          </div>
        </main>
      </div>

      {/* Reproductor Global */}
      <MusicPlayer startPlaying={hasStarted} />

    </div>
  );
}

export default App;