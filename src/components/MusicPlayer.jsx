import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Disc, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { audioBridge } from '../utils/audioBridge';

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
    const [playlist] = useState(() => {
        const shuffled = [...ORIGINAL_PLAYLIST];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [player, setPlayer] = useState(null);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const playerRef = useRef(null);
    const isPlayingRef = useRef(false);
    const playNextRef = useRef(null);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // 1. INICIALIZAR YOUTUBE
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
                        setPlayer(e.target);
                        playerRef.current = e.target;
                    },
                    'onStateChange': (e) => {
                        if (e.data === 0 && playNextRef.current) {
                            playNextRef.current();
                        }
                    }
                }
            });
        };
    }, []);

    // 3. SUSCRIPCIÓN AL PUENTE DE AUDIO (Para pausar cuando se reproduzca un video)
    useEffect(() => {
        const unsubscribe = audioBridge.subscribe((shouldPause) => {
            if (!playerRef.current) return;
            if (shouldPause) {
                if (isPlayingRef.current) {
                    playerRef.current.pauseVideo();
                    setIsPlaying(false);
                }
            } else {
                playerRef.current.playVideo();
                setIsPlaying(true);
            }
        });
        return () => unsubscribe();
    }, []);

    // 4. INICIAR CUANDO SE DA CLICK EN HOME SCREEN
    useEffect(() => {
        if (startPlaying && player && playlist.length > 0) {
            player.loadVideoById(playlist[0].id);
            setTimeout(() => {
                player.playVideo();
                setIsPlaying(true);
            }, 500);
        }
    }, [startPlaying, player, playlist]);

    const togglePlay = () => {
        if (!player) return;
        if (isPlaying) {
            player.pauseVideo();
            setIsPlaying(false);
        } else {
            player.playVideo();
            setIsPlaying(true);
        }
    };

    const playNext = () => {
        if (!player || playlist.length === 0) return;
        const next = (currentIndex + 1) % playlist.length;
        setCurrentIndex(next);
        player.loadVideoById(playlist[next].id);
        setIsPlaying(true);
    };

    useEffect(() => {
        playNextRef.current = playNext;
    });

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
            {/* LISTA DE REPRODUCCIÓN DESPLEGABLE CLAYMORPHIC */}
            <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden z-40 transition-all duration-300 origin-bottom shadow-clay-card ${showPlaylist ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none translate-y-4'}`}>
                <div className="p-4 border-b border-white/10 bg-slate-950/70 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse"></span>
                        <h3 className="text-white font-black text-sm tracking-tight">Soundtrack de Saudí</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-yellow-300 bg-yellow-400/10 px-2.5 py-0.5 rounded-full shadow-clay-badge border border-yellow-400/20">
                        {playlist.length} tracks
                    </span>
                </div>

                <div className="max-h-64 overflow-y-auto p-2 space-y-1.5 custom-scrollbar bg-slate-900/95">
                    {playlist.map((song, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelectSong(index)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all text-left border ${
                                index === currentIndex 
                                    ? 'bg-indigo-950/60 border-indigo-400/70 shadow-clay-badge text-white' 
                                    : 'bg-slate-950/40 border-white/5 hover:border-white/15'
                            }`}
                        >
                            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                                <img
                                    src={`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`text-xs font-black truncate ${index === currentIndex ? 'text-pink-300' : 'text-slate-200'}`}>
                                    {song.title}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">
                                    {song.artist}
                                </p>
                            </div>
                            {index === currentIndex && (
                                <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* REPRODUCTOR FLOTANTE CLAYMORPHIC */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-full p-2.5 pr-5 z-35 shadow-clay-header transition-all duration-500 hover:scale-[1.02] ${startPlaying ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0'}`}>
                <div id="yt-player-hidden" className="hidden"></div>

                <div className="flex items-center justify-between gap-3">
                    <div
                        className="flex items-center gap-3.5 overflow-hidden flex-1 min-w-0 cursor-pointer group select-none"
                        onClick={() => setShowPlaylist(!showPlaylist)}
                        title="Ver lista de canciones"
                    >
                        {/* CÍRCULO CON EFECTO VINILO CLAY */}
                        <div
                            className={`relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-white/40 shadow-clay-badge ${isPlaying ? 'ring-2 ring-pink-400/80' : ''}`}
                            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                        >
                            <div className={`w-full h-full flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
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
                            <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-black rounded-full border border-white/40 z-10"></div>
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-black text-white truncate group-hover:text-pink-300 transition-colors">
                                {playlist[currentIndex]?.title}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 font-medium">
                                <span>{playlist[currentIndex]?.artist}</span>
                                <span className="text-[10px] text-indigo-300 font-mono font-bold flex items-center gap-0.5">
                                    {showPlaylist ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
                                    Tracks
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={togglePlay}
                            className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-yellow-300 to-amber-400 text-slate-950 font-black rounded-full shadow-clay-yellow active:scale-95 transition-all"
                            title={isPlaying ? "Pausar" : "Reproducir"}
                        >
                            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button
                            onClick={playNext}
                            className="w-10 h-10 flex items-center justify-center bg-slate-800/90 hover:bg-slate-700 text-white rounded-full shadow-clay-btn active:scale-95 transition-all"
                            title="Siguiente canción"
                        >
                            <SkipForward size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MusicPlayer;
