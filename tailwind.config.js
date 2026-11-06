/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                // Tokens Claymorphic (3D Plastilina Puffy)
                'clay-card': '14px 18px 36px rgba(0, 0, 0, 0.5), inset 3px 3px 6px rgba(255, 255, 255, 0.2), inset -4px -4px 8px rgba(0, 0, 0, 0.45)',
                'clay-header': '0px 14px 30px rgba(0, 0, 0, 0.55), inset 2px 2px 4px rgba(255, 255, 255, 0.25), inset -2px -2px 6px rgba(0, 0, 0, 0.4)',
                'clay-btn': '6px 8px 18px rgba(0, 0, 0, 0.4), inset 2px 2px 4px rgba(255, 255, 255, 0.35), inset -3px -3px 6px rgba(0, 0, 0, 0.35)',
                'clay-btn-active': 'inset 3px 3px 6px rgba(0, 0, 0, 0.55), inset -2px -2px 4px rgba(255, 255, 255, 0.2)',
                'clay-pink': '8px 12px 24px rgba(236, 72, 153, 0.35), inset 2px 2px 5px rgba(255, 255, 255, 0.5), inset -3px -3px 6px rgba(131, 24, 67, 0.4)',
                'clay-indigo': '8px 12px 24px rgba(99, 102, 241, 0.35), inset 2px 2px 5px rgba(255, 255, 255, 0.5), inset -3px -3px 6px rgba(49, 46, 129, 0.4)',
                'clay-yellow': '8px 12px 24px rgba(234, 179, 8, 0.35), inset 2px 2px 5px rgba(255, 255, 255, 0.6), inset -3px -3px 6px rgba(113, 63, 18, 0.4)',
                'clay-emerald': '8px 12px 24px rgba(16, 185, 129, 0.35), inset 2px 2px 5px rgba(255, 255, 255, 0.5), inset -3px -3px 6px rgba(6, 78, 59, 0.4)',
                'clay-badge': '4px 6px 12px rgba(0, 0, 0, 0.3), inset 1px 1px 3px rgba(255, 255, 255, 0.35), inset -2px -2px 4px rgba(0, 0, 0, 0.3)',

                // Retrocompatibilidad
                'neo-sm': '2px 2px 0px 0px rgba(0, 0, 0, 0.9)',
                'neo': '4px 4px 0px 0px rgba(0, 0, 0, 0.95)',
                'neo-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
            },
            colors: {
                clay: {
                    dark: '#0e1222',
                    card: '#161b33',
                    cardLight: '#1f2647',
                    pink: '#f472b6',
                    indigo: '#6366f1',
                    purple: '#a855f7',
                    mint: '#34d399',
                    cream: '#fef3c7',
                },
                cyber: {
                    pink: '#ff2a85',
                    yellow: '#ffe600',
                    cyan: '#00f5d4',
                    purple: '#7b2cbf',
                    dark: '#070913',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'scale-in': 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'wiggle': 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-14px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.92)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            },
        },
    },
    plugins: [],
}
