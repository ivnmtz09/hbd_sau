import React from 'react';

const SaudiAvatarClay = ({ size = 48, className = "" }) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 p-0.5 shadow-clay-pink group-hover:scale-105 active:scale-95 transition-all select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="Saudith ✨"
    >
      {/* Brillo interior y textura Claymorphic */}
      <div className="w-full h-full rounded-[14px] overflow-hidden bg-gradient-to-br from-indigo-950 via-[#13112c] to-purple-950 flex items-center justify-center relative">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md transform group-hover:rotate-3 transition-transform"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradiente de Plastilina para el Cabello Negro/Oscuro */}
            <linearGradient id="hairClay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2e2938" />
              <stop offset="50%" stopColor="#18151f" />
              <stop offset="100%" stopColor="#0d0b12" />
            </linearGradient>

            {/* Gradiente de Plastilina para la Piel Morena/Cálida de Saudí */}
            <radialGradient id="skinClay" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ecc0a0" />
              <stop offset="50%" stopColor="#d59973" />
              <stop offset="85%" stopColor="#ba7c56" />
              <stop offset="100%" stopColor="#9a5f3d" />
            </radialGradient>

            {/* Gradiente de Plastilina para la Lengua Jugetona */}
            <radialGradient id="tongueClay" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="60%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </radialGradient>

            {/* Gradiente Corona Dorada Clay */}
            <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            {/* Gradiente Camiseta Azul (como en la foto selfie) */}
            <linearGradient id="shirtClay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Sombra de relieve de plastilina */}
            <filter id="clayInset" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* 1. Fondo suave interior */}
          <circle cx="60" cy="60" r="56" fill="#1e1838" />

          {/* 2. Camiseta Azul de Saudí (como en la foto selfie) */}
          <path
            d="M 22 120 C 22 98, 40 92, 60 92 C 80 92, 98 98, 98 120 Z"
            fill="url(#shirtClay)"
            filter="url(#clayInset)"
          />

          {/* Cuello de la camiseta */}
          <path
            d="M 46 93 C 46 102, 74 102, 74 93 Z"
            fill="#1e40af"
            opacity="0.8"
          />

          {/* Cuello */}
          <path
            d="M 50 82 L 50 94 C 50 97, 70 97, 70 94 L 70 82 Z"
            fill="#ba7c56"
          />

          {/* 3. Cabello posterior / moño recogido (volumen detrás) */}
          <circle cx="60" cy="46" r="38" fill="url(#hairClay)" />
          {/* Moño superior suave */}
          <circle cx="60" cy="22" r="16" fill="url(#hairClay)" />

          {/* 4. Rostro Claymorphic de Saudí (ovalo suave) */}
          <ellipse
            cx="60"
            cy="58"
            rx="27"
            ry="29"
            fill="url(#skinClay)"
            filter="url(#clayInset)"
          />

          {/* Orejas con zarcillos dorados */}
          <ellipse cx="33" cy="58" rx="4.5" ry="7" fill="#c4865f" />
          <circle cx="33" cy="61" r="1.5" fill="#facc15" />
          <ellipse cx="87" cy="58" rx="4.5" ry="7" fill="#c4865f" />
          <circle cx="87" cy="61" r="1.5" fill="#facc15" />

          {/* Flequillo / Cabello frontal peinado hacia atrás con volumen */}
          <path
            d="M 33 50 C 35 32, 50 26, 60 26 C 70 26, 85 32, 87 50 C 82 38, 72 34, 60 34 C 48 34, 38 38, 33 50 Z"
            fill="url(#hairClay)"
          />
          {/* Mechón suave lateral */}
          <path
            d="M 33 48 C 31 56, 33 64, 34 68 C 36 62, 36 54, 35 48 Z"
            fill="#18151f"
            opacity="0.7"
          />

          {/* Rubor en las mejillas (Chubby Cute Blush) */}
          <ellipse cx="44" cy="63" rx="5" ry="2.5" fill="#f43f5e" opacity="0.3" />
          <ellipse cx="76" cy="63" rx="5" ry="2.5" fill="#f43f5e" opacity="0.3" />

          {/* 5. Cejas naturales oscuras y bien definidas */}
          <path
            d="M 40 47 Q 47 43 53 46"
            stroke="#1c1917"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 67 46 Q 73 43 80 47"
            stroke="#1c1917"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* 6. Ojos grandes, oscuros y expresivos con brillo Anime */}
          {/* Ojo izquierdo */}
          <ellipse cx="47" cy="54" rx="4.5" ry="5.5" fill="#1c1917" />
          <circle cx="45.5" cy="52.5" r="1.6" fill="#ffffff" />
          <circle cx="48" cy="56" r="0.8" fill="#ffffff" opacity="0.8" />

          {/* Ojo derecho */}
          <ellipse cx="73" cy="54" rx="4.5" ry="5.5" fill="#1c1917" />
          <circle cx="71.5" cy="52.5" r="1.6" fill="#ffffff" />
          <circle cx="74" cy="56" r="0.8" fill="#ffffff" opacity="0.8" />

          {/* Pestañas sutiles */}
          <path d="M 43 51 Q 47 49 52 51" stroke="#000" strokeWidth="1.2" fill="none" />
          <path d="M 68 51 Q 73 49 77 51" stroke="#000" strokeWidth="1.2" fill="none" />

          {/* 7. Nariz redondeada suave (Button nose de plastilina) */}
          <ellipse cx="60" cy="62" rx="3" ry="2" fill="#ba7c56" />
          <ellipse cx="59.5" cy="61.5" rx="1.5" ry="0.8" fill="#ecc0a0" opacity="0.6" />

          {/* 8. Boca y Lengua sacada hacia el lado (Expresión signature del selfie) */}
          {/* Labio superior / línea de sonrisa pícara */}
          <path
            d="M 50 69 Q 58 72 68 68"
            stroke="#6c2e17"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Lengüita divertida de plastilina saliendo hacia la izquierda */}
          <path
            d="M 52 70 C 49 71, 46 76, 50 80 C 54 83, 58 80, 58 71 Z"
            fill="url(#tongueClay)"
            stroke="#9f1239"
            strokeWidth="1"
            filter="url(#clayInset)"
          />
          {/* Línea central de la lengua */}
          <path
            d="M 52 72 Q 52 76 53 78"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* 9. Mano con Pulgar Arriba (Thumbs Up 👍 como en el selfie) */}
          <g transform="translate(18, 72) scale(0.42)">
            {/* Palma / Mano */}
            <circle cx="30" cy="40" r="16" fill="url(#skinClay)" filter="url(#clayInset)" />
            {/* Dedos doblados */}
            <rect x="22" y="32" width="16" height="6" rx="3" fill="#ba7c56" />
            <rect x="22" y="39" width="16" height="6" rx="3" fill="#ba7c56" />
            <rect x="22" y="46" width="16" height="6" rx="3" fill="#ba7c56" />
            {/* Pulgar arriba con brillo */}
            <path
              d="M 28 32 C 28 20, 36 12, 38 12 C 43 12, 45 22, 40 32 Z"
              fill="url(#skinClay)"
              filter="url(#clayInset)"
            />
            {/* Uña del pulgar */}
            <ellipse cx="37" cy="18" rx="2.5" ry="3.5" fill="#ecc0a0" opacity="0.7" />
          </g>

          {/* 10. Mini Corona de Cumpleaños Dorada sobre la cabeza */}
          <g transform="translate(68, 14) rotate(14) scale(0.68)">
            <path
              d="M 0 16 L 4 0 L 12 8 L 20 0 L 24 16 Z"
              fill="url(#crownGold)"
              stroke="#854d0e"
              strokeWidth="1"
              filter="url(#clayInset)"
            />
            {/* Gemas en la corona */}
            <circle cx="4" cy="3" r="2" fill="#ef4444" />
            <circle cx="12" cy="9" r="2" fill="#3b82f6" />
            <circle cx="20" cy="3" r="2" fill="#ec4899" />
          </g>

          {/* Destello de plastilina animado */}
          <circle cx="82" cy="22" r="1.5" fill="#fde047" className="animate-ping" />
        </svg>
      </div>
    </div>
  );
};

export default SaudiAvatarClay;
