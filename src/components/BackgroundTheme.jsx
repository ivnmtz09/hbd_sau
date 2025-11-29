import React from 'react';
import {
    Gamepad2, // Minecraft / Clash Royale
    Music2,   // 1D / Justin / TØP
    Glasses,  // Betty la Fea
    Zap,      // Stranger Things / MHA / Harry Potter
    Crown,    // Clash Royale / Queen
    Ghost,    // TØP (Vibe oscura) / Halloween
    Activity, // Haikyuu (Deporte/Energía)
    Stars     // General mágico
} from 'lucide-react';

const BackgroundTheme = () => {
    // Lista de iconos que representan sus gustos
    const icons = [
        { component: Gamepad2, color: "text-green-500", size: 40 }, // Minecraft Green
        { component: Music2, color: "text-red-500", size: 45 },     // 1D Red / Music
        { component: Glasses, color: "text-indigo-400", size: 50 }, // Betty
        { component: Zap, color: "text-yellow-400", size: 35 },     // MHA / Stranger T.
        { component: Crown, color: "text-amber-500", size: 40 },    // Clash Royale
        { component: Ghost, color: "text-slate-400", size: 30 },    // Spooky / TØP
        { component: Activity, color: "text-orange-500", size: 45 },// Haikyuu Orange
        { component: Stars, color: "text-purple-500", size: 30 },   // Magic
    ];

    // Generamos posiciones aleatorias pero controladas
    const floatingIcons = Array.from({ length: 20 }).map((_, i) => {
        const IconData = icons[i % icons.length];
        const IconComponent = IconData.component;

        // Aleatoriedad para movimiento
        const randomLeft = Math.random() * 100; // Posición horizontal %
        const randomDelay = Math.random() * 5;  // Retraso animación
        const randomDuration = 15 + Math.random() * 15; // Duración flotación

        return (
            <div
                key={i}
                className={`absolute opacity-20 ${IconData.color} animate-float`}
                style={{
                    left: `${randomLeft}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${randomDelay}s`,
                    animationDuration: `${randomDuration}s`,
                }}
            >
                <IconComponent size={IconData.size} />
            </div>
        );
    });

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            {/* Capa base oscura */}
            <div className="absolute inset-0 bg-[#020617]"></div>

            {/* Degradado Principal - Rico y Profundo */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#020617] to-purple-950/30"></div>

            {/* Orbes de luz ambiental */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

            {/* Iconos flotantes */}
            {floatingIcons}

            {/* Efecto de ruido/grano sutil para toque retro y premium */}
            <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>

            {/* Vignette para centrar la atención */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.4)_100%)]"></div>

            <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 0.3; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
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