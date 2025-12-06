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
    { title: "I Think We're Alone Now", artist: "Tiffany", id: "w6Q3mHyzn78" },
    { title: "Kiss You", artist: "One Direction", id: "XAXE3JANcsU" },
    { title: "Night Changes", artist: "One Direction", id: "syFZfO_wfMQ" },
    { title: "One Thing", artist: "One Direction", id: "Y1xs_xPb46M" },
    { title: "Live While We're Young", artist: "One Direction", id: "qKVWYJFct5U" },
    { title: "You & I", artist: "One Direction", id: "_kqQDCxRCzM" },
    { title: "One Love", artist: "One Direction", id: "_kqQDCxRCzM" },
    { title: "Beauty And A Beat", artist: "Justin Bieber ft. Nicki Minaj", id: "Ys7-6_t7OEQ" },
    { title: "Let Me Love You", artist: "DJ Snake ft. Justin Bieber", id: "euCqAq6BRa4" },
    { title: "Mistletoe", artist: "Justin Bieber", id: "LUjn3RpkcKY" },
    { title: "Snowman", artist: "Sia", id: "gset79KMmt0" },
    { title: "Chandelier", artist: "Sia", id: "2vjPBrBU-TM" },
    { title: "Unstoppable", artist: "Sia", id: "YaEG2aWJnZ8" },
    { title: "Umbrella", artist: "Rihanna ft. JAY-Z", id: "CvBfHwUxHIk" },
    { title: "Diamonds", artist: "Rihanna", id: "lWA2pjMjpBs" },
    { title: "Man Down", artist: "Rihanna", id: "sEhy-RXkNo0" },
    { title: "Where Have You Been", artist: "Rihanna", id: "HBxt_v0WF6Y" },
    { title: "We Found Love", artist: "Rihanna ft. Calvin Harris", id: "tg00YEETFzg" },
    { title: "Tear in my Heart", artist: "Twenty One Pilots", id: "nky4me4NP70" },
    { title: "My Blood", artist: "Twenty One Pilots", id: "8mn-FFjIbo8" },
    { title: "Level of Concern", artist: "Twenty One Pilots", id: "loOWKm8GW6A" },
    { title: "Car Radio", artist: "Twenty One Pilots", id: "92XVwY54h5k" },
    { title: "Guns For Hands", artist: "Twenty One Pilots", id: "aco9DmDR2jI" },
    { title: "Holding On To You", artist: "Twenty One Pilots", id: "ktBMxkLUIwY" },
    { title: "House of Gold", artist: "Twenty One Pilots", id: "mDyxykpYeu8" },
    { title: "Trees", artist: "Twenty One Pilots", id: "szp9x1ZlZn4" },
];

const MusicPlayer = ({ startPlaying }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [player, setPlayer] = useState(null);
    const [showPlaylist, setShowPlaylist] = useState(false);

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

    const handleSelectSong = (index) => {
        setCurrentIndex(index);
        player.loadVideoById(playlist[index].id);
        setIsPlaying(true);
        setShowPlaylist(false);
    };

    // Obtener la URL de la miniatura actual
    const currentVideoId = playlist[currentIndex]?.id;
    const thumbnailUrl = currentVideoId
        ? `https://img.youtube.com/vi/${currentVideoId}/mqdefault.jpg`
        : null;

    if (playlist.length === 0) return null;

    return (
        <>
            {/* LISTA DE REPRODUCCIÓN DESPLEGABLE */}
            <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden z-40 transition-all duration-300 origin-bottom shadow-2xl ${showPlaylist ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none translate-y-4'}`}>
                <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <h3 className="text-white font-bold text-sm">Lista de Reproducción</h3>
                    <span className="text-xs text-indigo-300">{playlist.length} canciones</span>
                </div>
                <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {playlist.map((song, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelectSong(index)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${index === currentIndex ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`}
                                    alt=""
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`text-sm font-medium truncate ${index === currentIndex ? 'text-indigo-300' : 'text-slate-200'}`}>
                                    {song.title}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {song.artist}
                                </p>
                            </div>
                            {index === currentIndex && (
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* REPRODUCTOR FLOTANTE */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full p-3 pr-6 z-50 shadow-2xl shadow-black/50 ring-1 ring-white/5 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) hover:scale-105 ${startPlaying ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0'}`}>
                <div id="yt-player-hidden" className="hidden"></div>

                <div className="flex items-center justify-between gap-4">
                    <div
                        className="flex items-center gap-4 overflow-hidden flex-1 min-w-0 cursor-pointer group"
                        onClick={() => setShowPlaylist(!showPlaylist)}
                    >

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

                        <div className="flex flex-col min-w-0 flex-1 group-hover:opacity-80 transition-opacity">
                            <span className="text-sm font-bold text-white truncate">{playlist[currentIndex]?.title}</span>
                            <span className="text-xs text-indigo-200/60 truncate flex items-center gap-1">
                                {playlist[currentIndex]?.artist}
                                <span className="text-[10px] opacity-50">• Ver lista</span>
                            </span>
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
        </>
    );
};

export default MusicPlayer;