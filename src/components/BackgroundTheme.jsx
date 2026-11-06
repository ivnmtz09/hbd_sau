import React, { useMemo } from 'react';
import {
    Gamepad2, // Minecraft / Clash Royale
    Music2,   // 1D / Justin / TØP
    Glasses,  // Betty la Fea
    Zap,      // Stranger Things / MHA / Harry Potter
    Crown,    // Clash Royale / Queen Saudí
    Ghost,    // TØP (Vibe oscura) / Spooky
    Activity, // Haikyuu (Deporte/Energía)
    Stars,    // General mágico / Anime
    Sparkles, // Party
    Heart     // Love
} from 'lucide-react';
import ClayScene3D from './ClayScene3D';

const BackgroundTheme = () => {
    // Lista de iconos que representan sus gustos y pasiones
    const icons = useMemo(() => [
        { component: Gamepad2, color: "text-emerald-400", size: 36 }, // Minecraft Green
        { component: Music2, color: "text-rose-400", size: 40 },     // 1D Red / Music
        { component: Glasses, color: "text-indigo-400", size: 46 }, // Betty la Fea
        { component: Zap, color: "text-yellow-400", size: 32 },     // MHA / Stranger Things
        { component: Crown, color: "text-amber-400", size: 36 },    // Clash Royale / Saudí Queen
        { component: Ghost, color: "text-purple-400", size: 30 },    // Spooky / TØP
        { component: Activity, color: "text-orange-400", size: 40 },// Haikyuu Orange
        { component: Stars, color: "text-pink-400", size: 28 },     // Magic
        { component: Sparkles, color: "text-cyan-400", size: 26 },  // Anime Sparkles
        { component: Heart, color: "text-rose-500", size: 26 },     // Amistad
    ], []);

    // Posiciones fijas memoizadas (Evita re-cálculos de Math.random() en cada render)
    const floatingIcons = useMemo(() => {
        return Array.from({ length: 14 }).map((_, i) => {
            const IconData = icons[i % icons.length];
            const IconComponent = IconData.component;

            const randomLeft = ((i * 23 + 7) % 92) + 4;
            const randomTop = ((i * 29 + 11) % 88) + 6;
            const randomDelay = (i * 0.8) % 5;
            const randomDuration = 14 + (i % 6) * 2;

            return (
                <div
                    key={i}
                    className={`absolute opacity-20 ${IconData.color} animate-float pointer-events-none select-none`}
                    style={{
                        left: `${randomLeft}%`,
                        top: `${randomTop}%`,
                        animationDelay: `${randomDelay}s`,
                        animationDuration: `${randomDuration}s`,
                    }}
                >
                    <IconComponent size={IconData.size} />
                </div>
            );
        });
    }, [icons]);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            {/* Capa base oscura con textura suave de arcilla nocturna */}
            <div className="absolute inset-0 bg-[#090d1c]"></div>

            {/* Degradado Principal Claymorphic */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/45 via-[#090d1c] to-pink-950/25"></div>

            {/* Escena 3D Three.js Interactiva (Pastel, globos y estrellas Clay) */}
            <ClayScene3D />

            {/* Orbes de luz ambiental de alto impacto */}
            <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-pink-600/15 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>

            {/* Iconos flotantes */}
            {floatingIcons}

            {/* Vignette para enfocar el contenido en el centro */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,13,28,0.65)_100%)]"></div>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); opacity: 0.12; }
                    50% { transform: translateY(-16px) rotate(6deg); opacity: 0.28; }
                    100% { transform: translateY(0px) rotate(0deg); opacity: 0.12; }
                }
                .animate-float {
                    animation-name: float;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </div>
    );
};

export default BackgroundTheme;
