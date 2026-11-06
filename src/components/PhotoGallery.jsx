import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, RefreshCw, Video, Play, Maximize2, Sparkles, Filter, Cloud, Heart, PartyPopper } from 'lucide-react';
import LightboxModal from './LightboxModal';
import { audioBridge } from '../utils/audioBridge';
import { triggerBirthdayBlast, triggerElementPop } from '../utils/confetti';
import { fetchMemories, DEFAULT_LOCAL_MEMORIES } from '../services/galleryService';

const filterAndShuffle = (pool, type = 'all', count = 30) => {
  if (!Array.isArray(pool) || pool.length === 0) return [];
  let filtered = [...pool];
  if (type === 'image') filtered = filtered.filter(i => i.type === 'image');
  if (type === 'video') filtered = filtered.filter(i => i.type === 'video');

  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  return filtered.slice(0, count);
};

const PhotoGallery = () => {
  const [allMemories, setAllMemories] = useState(DEFAULT_LOCAL_MEMORIES);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'video'
  const [displayedItems, setDisplayedItems] = useState(() => filterAndShuffle(DEFAULT_LOCAL_MEMORIES, 'all', 30));
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem('hbd_sau_gallery_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    let mounted = true;
    fetchMemories().then((data) => {
      if (mounted && Array.isArray(data) && data.length > 0) {
        setAllMemories(data);
        setDisplayedItems(filterAndShuffle(data, 'all', 30));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleFilterChange = (type) => {
    setFilterType(type);
    setDisplayedItems(filterAndShuffle(allMemories, type, 30));
  };

  const handleRefresh = () => {
    setDisplayedItems(filterAndShuffle(allMemories, filterType, 30));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerBirthdayBlast();
  };

  const handleOpenLightbox = (item) => {
    setSelectedItem(item);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedItem(null);
    audioBridge.resumeMusic();
  };

  const handleNavigateLightbox = (direction) => {
    if (!selectedItem) return;
    const currentIndex = displayedItems.findIndex(i => i.id === selectedItem.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + direction + displayedItems.length) % displayedItems.length;
    setSelectedItem(displayedItems[nextIndex]);
  };

  const handleToggleLike = (e, itemId) => {
    e.stopPropagation();
    triggerElementPop(e);
    setLikes((prev) => {
      const current = prev[itemId] || 0;
      const next = { ...prev, [itemId]: current + 1 };
      try {
        localStorage.setItem('hbd_sau_gallery_likes', JSON.stringify(next));
      } catch {
        // Ignorar en caso de cuota excedida
      }
      return next;
    });
  };

  return (
    <div className="animate-fade-in pb-32">
      {/* Barra de Filtros y Acción Claymorphic */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-3.5 sm:p-4 rounded-3xl shadow-clay-card">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-mono font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter size={14} /> Filtro:
          </span>

          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-clay-indigo scale-105'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Todos ({allMemories.length})
          </button>

          <button
            onClick={() => handleFilterChange('image')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
              filterType === 'image'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-clay-pink scale-105'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <ImageIcon size={13} /> Fotos
          </button>

          <button
            onClick={() => handleFilterChange('video')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
              filterType === 'video'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-clay-yellow scale-105'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Video size={13} /> Videos
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-black text-xs rounded-full shadow-clay-btn active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10"
            title="Mezclar y cargar otros recuerdos"
          >
            <RefreshCw size={14} /> Aleatorio ({displayedItems.length})
          </button>

          <button
            onClick={() => triggerBirthdayBlast()}
            className="px-3 py-2.5 bg-pink-500/20 hover:bg-pink-500 text-pink-400 hover:text-white font-black text-xs rounded-full shadow-clay-btn active:scale-95 transition-all flex items-center justify-center gap-1 border border-pink-500/30"
            title="Lanzar confeti de celebración"
          >
            <PartyPopper size={14} />
          </button>
        </div>
      </div>

      {/* Grid Masonry Claymorphic */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 mx-auto max-w-5xl">
        {displayedItems.map((item) => {
          const itemLikes = likes[item.id] || 0;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(item)}
              className="break-inside-avoid relative group rounded-3xl overflow-hidden bg-slate-900/80 border border-white/10 shadow-clay-card hover:shadow-clay-pink transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 hover:scale-[1.01]"
            >
              {item.type === 'video' ? (
                <div className="relative">
                  {item.isDrive ? (
                    <div className="relative w-full aspect-video bg-slate-950 flex items-center justify-center">
                      <img
                        src={item.thumbnail || item.url}
                        alt={item.title || "Video"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center border-2 border-black shadow-clay-pink group-hover:scale-110 transition-transform">
                          <Play size={20} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        src={item.url}
                        className="w-full h-auto object-cover"
                        preload="metadata"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-pink-500/90 text-white flex items-center justify-center border-2 border-black shadow-clay-pink group-hover:scale-110 transition-transform">
                          <Play size={20} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-yellow-400 text-slate-950 font-black text-[10px] uppercase rounded-full shadow-clay-yellow pointer-events-none flex items-center gap-1">
                    <Video size={12} /> {item.isDrive ? 'DRIVE' : 'VIDEO'}
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden">
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title || `Recuerdo #${item.id}`}
                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-indigo-500 text-white font-black text-[10px] uppercase rounded-full shadow-clay-indigo pointer-events-none flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.isDrive ? <Cloud size={12} /> : <ImageIcon size={12} />}
                    <span>{item.isDrive ? 'DRIVE' : 'FOTO'}</span>
                  </div>
                </div>
              )}

              {/* Botón Flotante de Amor / Like */}
              <button
                onClick={(e) => handleToggleLike(e, item.id)}
                className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-clay-btn transition-all duration-200 ${
                  itemLikes > 0
                    ? 'bg-rose-500 text-white scale-105'
                    : 'bg-slate-950/60 backdrop-blur-md text-slate-300 hover:text-rose-400 opacity-80 hover:opacity-100'
                }`}
                title="Celebrar este recuerdo"
              >
                <Heart size={13} fill={itemLikes > 0 ? "currentColor" : "none"} className={itemLikes > 0 ? "animate-pulse" : ""} />
                <span>{itemLikes > 0 ? itemLikes : ''}</span>
              </button>

              {/* Hover Overlay con Botón de Expandir Claymorphic */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 truncate max-w-[75%]">
                  <Sparkles size={13} className="text-yellow-400 shrink-0" />
                  <span className="truncate">{item.title || `#${item.id}`}</span>
                </span>
                <span className="w-8 h-8 rounded-full bg-white/95 text-slate-950 flex items-center justify-center shadow-clay-btn shrink-0 group-hover:scale-105 transition-transform">
                  <Maximize2 size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón Inferior Claymorphic */}
      <div className="flex justify-center items-center mt-12">
        <button
          onClick={handleRefresh}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-sm rounded-full shadow-clay-pink active:scale-95 transition-all flex items-center gap-2.5"
        >
          <RefreshCw size={16} /> Cargar Nuevos Recuerdos
        </button>
      </div>

      {/* Lightbox Modal con React Portal directo al viewport */}
      <LightboxModal
        item={selectedItem}
        items={displayedItems}
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
      />
    </div>
  );
};

export default PhotoGallery;
