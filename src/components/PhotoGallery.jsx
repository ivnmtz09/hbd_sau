import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, RefreshCw, Video, Play } from 'lucide-react';

// --- TU BASE DE DATOS DE RECUERDOS ---
const ALL_MEMORIES = [
    // FOTOS (type: 'image') - IDs 1 a 187
    ...Array.from({ length: 187 }, (_, i) => ({
        id: i + 1,
        type: 'image',
        url: `/fotos/foto_ (${i + 1}).jpg`
    })),
    // VIDEOS (type: 'video') - IDs 188 a 216
    ...Array.from({ length: 29 }, (_, i) => ({
        id: 187 + i + 1,
        type: 'video',
        url: `/fotos/video_ (${i + 1}).mp4`
    }))
];

const PhotoGallery = () => {
    const [displayedItems, setDisplayedItems] = useState([]);

    const shuffleMemories = () => {
        if (ALL_MEMORIES.length === 0) return;

        const shuffled = [...ALL_MEMORIES];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        // CAMBIO 1: Ahora mostramos 20 elementos en lugar de 10
        setDisplayedItems(shuffled.slice(0, 20));
    };

    const handleRefresh = () => {
        shuffleMemories();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        // Carga inicial
        shuffleMemories();

        // CAMBIO 2: Actualización automática cada 2 minutos (120,000 ms)
        const intervalId = setInterval(() => {
            shuffleMemories();
        }, 120000);

        // Limpieza del intervalo cuando se sale de la galería
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="animate-fade-in pb-32">
            {/* Botón Superior */}
            <div className="flex justify-end items-center mb-6 px-2">
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 text-indigo-400 hover:text-white text-sm transition-colors"
                >
                    <RefreshCw size={14} /> Cargar nuevos
                </button>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 mx-auto max-w-5xl">
                {displayedItems.map((item) => (
                    <div key={item.id} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">

                        {item.type === 'video' ? (
                            <div className="relative">
                                <video
                                    src={item.url}
                                    className="w-full h-auto object-cover"
                                    controls
                                    preload="metadata"
                                />
                                <div className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full text-white pointer-events-none">
                                    <Video size={14} />
                                </div>
                            </div>
                        ) : (
                            <img
                                src={item.url}
                                alt=""
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                            <p className="text-white text-sm font-medium flex items-center gap-2">
                                {item.type === 'video' ? <Play size={14} className="text-indigo-400" /> : <ImageIcon size={14} className="text-indigo-400" />}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botón Inferior */}
            <div className="flex justify-center items-center mt-12 px-2">
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 text-indigo-400 hover:text-white text-sm transition-colors"
                >
                    <RefreshCw size={14} /> Cargar nuevos
                </button>
            </div>
        </div>
    );
};

export default PhotoGallery;