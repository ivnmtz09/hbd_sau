import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBU7j-LQUGD-MBzOL7o2t2off0QlTJekA8",
    authDomain: "cumple-saudith.firebaseapp.com",
    projectId: "cumple-saudith",
    storageBucket: "cumple-saudith.firebasestorage.app",
    messagingSenderId: "430567254264",
    appId: "1:430567254264:web:c562aac1f554b5090fb30d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);