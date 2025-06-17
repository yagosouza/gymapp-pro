// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_k2sL-Ayb_2T5nza8s8OK0WdBx4eN2Lc",
  authDomain: "gymapp-pro.firebaseapp.com",
  projectId: "gymapp-pro",
  storageBucket: "gymapp-pro.firebasestorage.app",
  messagingSenderId: "390761092913",
  appId: "1:390761092913:web:51ee683e22d1b26b21c210",
  measurementId: "G-S0YKYSB4QT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);