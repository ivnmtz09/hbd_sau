import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, RefreshCw, Video, Play } from 'lucide-react';

// --- TU BASE DE DATOS DE RECUERDOS ---
const ALL_MEMORIES = [
    // FOTOS (type: 'image')
    { id: 1, type: 'image', url: "/fotos/foto1.jpg", caption: "🧑‍🎄 en dollarcity" },
    { id: 2, type: 'image', url: "/fotos/foto2.jpg", caption: "selfie en dollarcity" },
    { id: 3, type: 'image', url: "/fotos/foto3.jpg", caption: "xdd" },
    { id: 4, type: 'image', url: "/fotos/foto4.jpg", caption: "🤘🤘" },
    { id: 5, type: 'image', url: "/fotos/foto5.jpg", caption: "🤘/🖕" },
    { id: 6, type: 'image', url: "/fotos/foto6.jpg", caption: "uwu" },
    { id: 7, type: 'image', url: "/fotos/foto7.jpg", caption: "ñom ñom" },
    { id: 8, type: 'image', url: "/fotos/foto8.jpg", caption: "JKAAJSJAS 🤪" },
    { id: 9, type: 'image', url: "/fotos/foto9.jpg", caption: "xD 2" },
    { id: 10, type: 'image', url: "/fotos/foto10.jpg", caption: "En la playa" },
    { id: 11, type: 'image', url: "/fotos/foto11.jpg", caption: "En la playa - Ivan" },
    { id: 12, type: 'image', url: "/fotos/foto12.jpg", caption: "En playita" },
    { id: 13, type: 'image', url: "/fotos/foto13.jpg", caption: "camita del oka 🗿" },
    { id: 14, type: 'image', url: "/fotos/foto14.jpg", caption: "Onde el Oskar" },
    { id: 15, type: 'image', url: "/fotos/foto15.jpg", caption: "Gafas en Miniso" },
    { id: 16, type: 'image', url: "/fotos/foto16.jpg", caption: "Lenwa 😛" },
    { id: 17, type: 'image', url: "/fotos/foto17.jpg", caption: "Saudí chirretaMode" },
    { id: 18, type: 'image', url: "/fotos/foto18.jpg", caption: "En la rutona" },
    { id: 19, type: 'image', url: "/fotos/foto19.jpg", caption: "EspejoFoto" },
    { id: 20, type: 'image', url: "/fotos/foto20.jpg", caption: "enel Espejo" },
    { id: 21, type: 'image', url: "/fotos/foto21.jpg", caption: "JAJSKAJS 😦" },
    { id: 22, type: 'image', url: "/fotos/foto22.jpg", caption: "lenguita 😛" },
    { id: 23, type: 'image', url: "/fotos/foto23.jpg", caption: "comiendo perritos 😛" },
    { id: 24, type: 'image', url: "/fotos/foto24.jpg", caption: "buzo e' mototaxi" },
    { id: 25, type: 'image', url: "/fotos/foto25.jpg", caption: "en la uni wuw" },
    { id: 26, type: 'image', url: "/fotos/foto26.jpg", caption: "" },
    { id: 27, type: 'image', url: "/fotos/foto27.jpg", caption: "" },
    { id: 28, type: 'image', url: "/fotos/foto28.jpg", caption: "" },
    { id: 29, type: 'image', url: "/fotos/foto29.jpg", caption: "" },
    { id: 30, type: 'image', url: "/fotos/foto30.jpg", caption: "" },
    { id: 31, type: 'image', url: "/fotos/foto31.jpg", caption: "" },
    { id: 32, type: 'image', url: "/fotos/foto32.jpg", caption: "" },
    { id: 33, type: 'image', url: "/fotos/foto33.jpg", caption: "" },
    { id: 34, type: 'image', url: "/fotos/foto34.jpg", caption: "" },
    { id: 35, type: 'image', url: "/fotos/foto35.jpg", caption: "" },
    { id: 36, type: 'image', url: "/fotos/foto36.jpg", caption: "" },
    { id: 37, type: 'image', url: "/fotos/foto37.jpg", caption: "" },
    { id: 38, type: 'image', url: "/fotos/foto38.jpg", caption: "" },
    { id: 39, type: 'image', url: "/fotos/foto39.jpg", caption: "" },
    { id: 40, type: 'image', url: "/fotos/foto40.jpg", caption: "" },
    { id: 41, type: 'video', url: "/fotos/video1.mp4", caption: "nosequé mondá en la moto" },
    { id: 42, type: 'video', url: "/fotos/video2.mp4", caption: "prohibidos en el Dollarcity" },
    { id: 43, type: 'video', url: "/fotos/video3.mp4", caption: "con el jasmí en la motora" },
    { id: 44, type: 'video', url: "/fotos/video4.mp4", caption: "el siuuu 😉" },
    { id: 45, type: 'video', url: "/fotos/video5.mp4", caption: "el tikitoki" },
    { id: 46, type: 'video', url: "/fotos/video6.mp4", caption: "" },
    { id: 47, type: 'video', url: "/fotos/video7.mp4", caption: "" },
    { id: 48, type: 'video', url: "/fotos/video8.mp4", caption: "" },
    { id: 49, type: 'video', url: "/fotos/video9.mp4", caption: "" },
    { id: 50, type: 'video', url: "/fotos/video10.mp4", caption: "" },
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
            <div className="flex justify-end items-center mb-6 px-2">
                <button
                    onClick={shuffleMemories}
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
                                alt={item.caption}
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                            <p className="text-white text-sm font-medium flex items-center gap-2">
                                {item.type === 'video' ? <Play size={14} className="text-indigo-400" /> : <ImageIcon size={14} className="text-indigo-400" />}
                                {item.caption}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoGallery;