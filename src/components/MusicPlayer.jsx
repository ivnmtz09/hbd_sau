import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Disc } from 'lucide-react';

const ORIGINAL_PLAYLIST = [
    { title: "One Way Or Another", artist: "One Direction", id: "36mCEZzzQ3o" },
    { title: "Stressed Out", artist: "Twenty One Pilots", id: "pXRviuL6vMY" },
    { title: "The Nights", artist: "Avicii", id: "UtF6Jej8yb4" },
    { title: "Circles", artist: "Post Malone", id: "wXhTHyIgQ_U" },
    { title: "Drag Me Down", artist: "One Direction", id: "Jwgf3wmiA04" },
    { title: "There's Nothing Holdin' Me Back", artist: "Shawn Mendes", id: "dT2owtxkU8k" },
    { title: "Gone, Gone, Gone", artist: "Phillip Phillips", id: "oozQ4yV__Vw" },
    { title: "On My Own", artist: "Ross Lynch", id: "ZFRMOG82SF0" },
    { title: "Cruisin' for a Bruisin'", artist: "Teen Beach Movie", id: "ZDcr9VrUrgw" },
    { title: "Story of My Life", artist: "One Direction", id: "PJYpZ4hkXJE" },
    { title: "Ride", artist: "Twenty One Pilots", id: "Pw-0pbY9JeU" },
    { title: "Stitches", artist: "Shawn Mendes", id: "VbfpW0pbvaU" },
    { title: "Besos En Guerra", artist: "Morat, Juanes", id: "1oeD2m2UQAI" },
    { title: "Baby", artist: "Justin Bieber", id: "kffacxfA7G4" },
    { title: "Shape of You", artist: "Ed Sheeran", id: "JGwWNGJdvx8" },
    { title: "Señorita", artist: "Shawn Mendes, Camila Cabello", id: "Pkh8UtuejGw" },
    { title: "What Makes You Beautiful", artist: "One Direction", id: "S3IQwuYX_ls" },
    { title: "Never Say Never", artist: "Justin Bieber ft. Jaden", id: "_Z5-P9v3F8w" },
    { title: "Love Me", artist: "Justin Bieber", id: "qdDVtFvJwUc" },
];

const MusicPlayer = ({ startPlaying }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [player, setPlayer] = useState(null);

    // 1. MEZCLAR LISTA AL CARGAR
    useEffect(() => {
        const shuffled = [...ORIGINAL_PLAYLIST];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setPlaylist(shuffled);
    }, []);

    // 2. INICIALIZAR YOUTUBE
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            const initialId = ORIGINAL_PLAYLIST[0].id;

            new window.YT.Player('yt-player-hidden', {
                height: '0', width: '0',
                videoId: initialId,
                playerVars: { 'autoplay': 0, 'controls': 0 },
                events: {
                    'onReady': (e) => {
                        console.log("YouTube Player listo");
                        setPlayer(e.target);
                    },
                    'onStateChange': (e) => {
                        if (e.data === 0) playNext();
                    }
                }
            });
        };
    }, []);

    // 3. INICIAR CUANDO SE DA CLICK EN HOME SCREEN
    useEffect(() => {
        console.log("MusicPlayer - startPlaying:", startPlaying, "player:", !!player, "playlist length:", playlist.length);
        if (startPlaying && player && playlist.length > 0) {
            console.log("Intentando reproducir música automáticamente...");
            player.loadVideoById(playlist[0].id);
            setTimeout(() => {
                player.playVideo();
                setIsPlaying(true);
                console.log("Música iniciada automáticamente");
            }, 500);
        }
    }, [startPlaying, player, playlist]);

    const togglePlay = () => {
        if (!player) return;
        isPlaying ? player.pauseVideo() : player.playVideo();
        setIsPlaying(!isPlaying);
    };

    const playNext = () => {
        if (!player || playlist.length === 0) return;
        const next = (currentIndex + 1) % playlist.length;
        setCurrentIndex(next);
        player.loadVideoById(playlist[next].id);
        setIsPlaying(true);
    };

    // Obtener la URL de la miniatura actual
    const currentVideoId = playlist[currentIndex]?.id;
    const thumbnailUrl = currentVideoId
        ? `https://img.youtube.com/vi/${currentVideoId}/mqdefault.jpg`
        : null;

    if (playlist.length === 0) return null;

    return (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full p-3 pr-6 z-50 shadow-2xl shadow-black/50 ring-1 ring-white/5 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) hover:scale-105 ${startPlaying ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0'}`}>
            <div id="yt-player-hidden" className="hidden"></div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-0">

                    {/* CÍRCULO CON EFECTO VINILO (PORTADA REAL) */}
                    <div
                        className={`relative w-14 h-14 flex-shrink-0 rounded-full overflow-hidden border-2 border-white/10 shadow-lg ${isPlaying ? 'ring-2 ring-indigo-500/50' : ''}`}
                        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                    >
                        {/* 1. CONTENEDOR QUE GIRA (Spin) */}
                        <div className={`w-full h-full flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>

                            {/* 2. IMAGEN QUE HACE ZOOM (Scale) */}
                            {thumbnailUrl ? (
                                <img
                                    src={thumbnailUrl}
                                    alt="Album Art"
                                    className="w-full h-full object-cover scale-125"
                                />
                            ) : (
                                <div className="w-full h-full bg-indigo-900 flex items-center justify-center">
                                    <Disc className="text-white/50" />
                                </div>
                            )}
                        </div>

                        {/* Agujero central del vinilo */}
                        <div className="absolute inset-0 m-auto w-3 h-3 bg-black/80 rounded-full border border-white/20 z-10"></div>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-bold text-white truncate">{playlist[currentIndex]?.title}</span>
                        <span className="text-xs text-indigo-200/60 truncate">{playlist[currentIndex]?.artist}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 flex items-center justify-center bg-white text-slate-950 rounded-full hover:scale-110 hover:bg-indigo-50 transition-all duration-300 shadow-lg shadow-white/10"
                    >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <button
                        onClick={playNext}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <SkipForward size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;