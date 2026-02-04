import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCXocCCKsliGZFPO_B3hVsZYSRL0Vu3v18",
    authDomain: "rdz-studio.firebaseapp.com",
    projectId: "rdz-studio",
    storageBucket: "rdz-studio.firebasestorage.app",
    messagingSenderId: "407568499977",
    appId: "1:407568499977:web:bb5997129611ec053fffd8",
    measurementId: "G-XNJPQ21XT2"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
const db = getFirestore(app);

export { db };
