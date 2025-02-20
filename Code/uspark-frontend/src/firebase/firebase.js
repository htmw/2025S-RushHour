// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsjVq_MNKdpzojB4RFwtlHvBGC4R68ltA",
  authDomain: "uspark-1473a.firebaseapp.com",
  projectId: "uspark-1473a",
  storageBucket: "uspark-1473a.firebasestorage.app",
  messagingSenderId: "45052347204",
  appId: "1:45052347204:web:726f5e7d62549249d7cd11",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

export { auth, googleProvider, appleProvider, signInWithPopup };
