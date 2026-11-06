import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
// Es válido solo si existe, no es undefined y no está vacío
const isConfigured = Boolean(
    apiKey && 
    apiKey !== "undefined" && 
    apiKey.trim() !== "" && 
    apiKey.length > 5
);

const firebaseConfig = {
    apiKey: apiKey || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app = null;
let db = null;
let auth = null;

if (isConfigured) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        db = getFirestore(app);
        auth = getAuth(app);
    } catch (err) {
        console.warn("Aviso: No se pudo conectar con Firebase:", err);
    }
} else {
    console.warn("Aviso: Variables de Firebase no configuradas en .env. El sitio operará en modo local y seguro sin errores.");
}

export { app, db, auth, isConfigured };
