import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgRA5KpkRFHAWksUu22YAJTRCKlFr4f9w",
  authDomain: "prepwise-12cec.firebaseapp.com",
  projectId: "prepwise-12cec",
  storageBucket: "prepwise-12cec.firebasestorage.app",
  messagingSenderId: "547281179438",
  appId: "1:547281179438:web:8a33c5aaf23efe43b060bf",
  measurementId: "G-V9BNH622Y5"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app)
export const dp = getFirestore(app)
