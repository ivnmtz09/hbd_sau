import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download, Video, Image as ImageIcon, Sparkles } from 'lucide-react';
import { audioBridge } from '../utils/audioBridge';

const LightboxModal = ({ item, items = [], isOpen, onClose, onNavigate }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Bloquear scroll de la página de fondo mientras el modal está abierto
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Pausar música si el elemento abierto es un video
    if (item?.type === 'video') {
      audioBridge.pauseMusic();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
      if (item?.type === 'video') {
        audioBridge.resumeMusic();
      }
    };
  }, [isOpen, item, onClose, onNavigate]);

  if (!isOpen || !item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const total = items.length;

  const modalNode = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in select-none"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100dvh' }}
    >
      {/* Click outside backdrop para cerrar */}
      <div
        className="absolute inset-0 bg-black/60 cursor-pointer"
        onClick={onClose}
        title="Haz clic para cerrar"
      />

      {/* Barra superior flotante Claymorphic */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none max-w-5xl mx-auto">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 border border-white/20 px-4 py-2 rounded-full shadow-clay-card text-xs font-mono font-bold text-indigo-300 backdrop-blur-md">
          {item.type === 'video' ? (
            <Video size={14} className="text-pink-400" />
          ) : (
            <ImageIcon size={14} className="text-yellow-400" />
          )}
          <span>
            {currentIndex >= 0 ? `${currentIndex + 1} / ${total}` : 'Recuerdo'}
          </span>
          {item.title && (
            <span className="hidden sm:inline text-slate-400 border-l border-white/10 pl-2 truncate max-w-[240px]">
              {item.title}
            </span>
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-2.5">
          <a
            href={item.url}
            download={`recuerdo-saudi-${item.id}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 bg-slate-900/90 hover:bg-indigo-600 border border-white/20 rounded-full text-white shadow-clay-btn active:scale-95 transition-all backdrop-blur-md"
            title="Descargar recuerdo"
          >
            <Download size={18} />
          </a>

          <button
            onClick={onClose}
            className="p-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white rounded-full shadow-clay-pink active:scale-95 transition-all backdrop-blur-md"
            title="Cerrar (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Botón Anterior */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(-1);
        }}
        className="absolute left-3 sm:left-6 z-30 p-3 sm:p-4 bg-slate-900/80 hover:bg-indigo-600 border border-white/20 rounded-full text-white shadow-clay-btn active:scale-95 transition-all backdrop-blur-md group"
        title="Anterior (Flecha izquierda)"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Contenedor del contenido con marco Claymorphic */}
      <div
        className="relative z-20 max-w-5xl max-h-[82vh] w-auto max-w-[94vw] flex items-center justify-center p-2 sm:p-3 bg-slate-900/85 border border-white/20 rounded-3xl shadow-clay-card overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'video' ? (
          item.isDrive ? (
            <iframe
              src={item.url}
              title={item.title || "Video Recuerdo"}
              className="w-[85vw] max-w-4xl h-[70vh] rounded-2xl border-0 shadow-2xl"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={item.url}
              controls
              autoPlay
              playsInline
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              onPlay={() => audioBridge.pauseMusic()}
              onPause={() => audioBridge.resumeMusic()}
              onEnded={() => audioBridge.resumeMusic()}
            />
          )
        ) : (
          <img
            src={item.url}
            alt={item.title || "Recuerdo Saudí"}
            className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl select-none"
          />
        )}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(1);
        }}
        className="absolute right-3 sm:right-6 z-30 p-3 sm:p-4 bg-slate-900/80 hover:bg-indigo-600 border border-white/20 rounded-full text-white shadow-clay-btn active:scale-95 transition-all backdrop-blur-md group"
        title="Siguiente (Flecha derecha)"
      >
        <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export default LightboxModal;
